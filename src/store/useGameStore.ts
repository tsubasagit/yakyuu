import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EffectType, GameState, HalfInning, LineupPlayer, MascotMode, OverlayPosition, PlayerInfo, Runners } from '../types'
import { initialGameState, initialPlayerInfo, formatBatterStat, DEFAULT_OVERLAY_POSITIONS } from '../types'
import { broadcastState } from '../lib/sync'
import { backupToIDB, restoreFromIDB } from '../lib/idbBackup'

/**
 * オーバーレイページでは localStorage への書き込みを禁止する。
 * コントロールパネルだけが writer、オーバーレイは reader に徹することで
 * 書き込み競合（チーム名が反映されない・選手データが初期化される等）を防止する。
 */
let _preventPersistWrites = false
export function setPreventPersistWrites(prevent: boolean) {
  _preventPersistWrites = prevent
}

/** エフェクト自動クリア用タイマー。多重発火を防ぐため前回をクリアしてから再セットする。 */
let _effectTimer: ReturnType<typeof setTimeout> | null = null
const EFFECT_DURATION_MS = 6000

const DATA_KEYS: (keyof GameState)[] = [
  'awayTeam', 'homeTeam', 'currentInning', 'currentHalf', 'isGameOver',
  'innings', 'awayTotal', 'homeTotal', 'awayHits', 'homeHits',
  'awayErrors', 'homeErrors', 'count', 'runners',
  'batter', 'pitcher', 'awayLineup', 'homeLineup',
  'awayBatterIndex', 'homeBatterIndex', 'playLog',
  'pitchCount', 'gameStartTime', 'ticker', 'activeEffect', 'effectTimestamp',
  'showMascot', 'mascotMode', 'mascotImages', 'autoChangeEffect', 'showWaitingScreen',
  'overlayPositions', 'overlayScale', 'lineupDisplayTeam',
]

export function extractGameState(store: GameState): GameState {
  return Object.fromEntries(
    DATA_KEYS.map((key) => [key, store[key]]),
  ) as unknown as GameState
}

function recalcTotals(state: GameState): GameState {
  let awayTotal = 0
  let homeTotal = 0
  for (const inn of state.innings) {
    awayTotal += inn.top ?? 0
    homeTotal += inn.bottom ?? 0
  }
  return { ...state, awayTotal, homeTotal }
}

interface GameActions {
  addBall: () => void
  addStrike: () => void
  addOut: () => void
  resetCount: () => void
  advanceInning: () => void
  setRunner: (base: keyof Runners, on: boolean) => void
  addRun: (team: 'away' | 'home') => void
  setInningScore: (inning: number, half: HalfInning, score: number) => void
  setBatter: (info: PlayerInfo) => void
  setPitcher: (info: PlayerInfo) => void
  addHit: (team: 'away' | 'home') => void
  addError: (team: 'away' | 'home') => void
  setHits: (team: 'away' | 'home', count: number) => void
  setErrors: (team: 'away' | 'home', count: number) => void
  setLineup: (team: 'away' | 'home', lineup: LineupPlayer[]) => void
  setLineupPlayer: (team: 'away' | 'home', index: number, player: LineupPlayer) => void
  selectBatter: (team: 'away' | 'home', index: number) => void
  nextBatter: () => void
  addPlayLog: (text: string) => void
  clearPlayLog: () => void
  setTeamName: (team: 'away' | 'home', name: string, shortName: string) => void
  setGameOver: (over: boolean) => void
  newGame: () => void
  replaceState: (state: GameState) => void
  subtractBall: () => void
  subtractStrike: () => void
  subtractOut: () => void
  subtractRun: (team: 'away' | 'home') => void
  addPitch: () => void
  setPitchCount: (n: number) => void
  startGameTimer: () => void
  stopGameTimer: () => void
  setTicker: (text: string) => void
  triggerEffect: (type: EffectType) => void
  setTeamColor: (team: 'away' | 'home', color: string) => void
  rewindInning: () => void
  setShowMascot: (show: boolean) => void
  setMascotMode: (mode: MascotMode) => void
  setMascotImage: (mode: string, dataUrl: string | null) => void
  setAutoChangeEffect: (on: boolean) => void
  setShowWaitingScreen: (show: boolean) => void
  setOverlayPosition: (id: string, pos: OverlayPosition) => void
  resetOverlayPositions: () => void
  setOverlayScale: (scale: number) => void
  setLineupDisplayTeam: (team: 'away' | 'home') => void
}

type GameStore = GameState & GameActions

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...initialGameState,

      addBall: () =>
        set((s) => {
          const balls = s.count.balls + 1
          if (balls >= 4) {
            return { ...applyWalk(s), pitchCount: s.pitchCount + 1 }
          }
          return { count: { ...s.count, balls }, pitchCount: s.pitchCount + 1 }
        }),

      addStrike: () =>
        set((s) => {
          const strikes = s.count.strikes + 1
          if (strikes >= 3) {
            const outs = s.count.outs + 1
            if (outs >= 3) {
              return { ...advanceInningPatch(s), pitchCount: s.pitchCount + 1 }
            }
            return { count: { balls: 0, strikes: 0, outs }, pitchCount: s.pitchCount + 1 }
          }
          return { count: { ...s.count, strikes }, pitchCount: s.pitchCount + 1 }
        }),

      addOut: () =>
        set((s) => {
          const outs = s.count.outs + 1
          if (outs >= 3) {
            return advanceInningPatch(s)
          }
          return { count: { balls: 0, strikes: 0, outs } }
        }),

      resetCount: () =>
        set((s) => ({ count: { ...s.count, balls: 0, strikes: 0 } })),

      advanceInning: () => set((s) => advanceInningPatch(s)),

      setRunner: (base, on) =>
        set((s) => ({ runners: { ...s.runners, [base]: on } })),

      addRun: (team) =>
        set((s) => {
          const innings = [...s.innings]
          const currentIdx = innings.findIndex(
            (inn) => inn.inning === s.currentInning,
          )
          if (currentIdx === -1) return s

          const inn = { ...innings[currentIdx]! }
          const half = team === 'away' ? 'top' as const : 'bottom' as const
          inn[half] = (inn[half] ?? 0) + 1
          innings[currentIdx] = inn

          return recalcTotals({ ...extractGameState(s), innings })
        }),

      setInningScore: (inning, half, score) =>
        set((s) => {
          const innings = [...s.innings]
          const idx = innings.findIndex((inn) => inn.inning === inning)
          if (idx === -1) return s

          const inn = { ...innings[idx]! }
          inn[half] = score
          innings[idx] = inn

          return recalcTotals({ ...extractGameState(s), innings })
        }),

      setBatter: (info) => set({ batter: info }),

      setPitcher: (info) => set({ pitcher: info }),

      addHit: (team) =>
        set((s) => team === 'away'
          ? { awayHits: s.awayHits + 1 }
          : { homeHits: s.homeHits + 1 }),

      addError: (team) =>
        set((s) => team === 'away'
          ? { awayErrors: s.awayErrors + 1 }
          : { homeErrors: s.homeErrors + 1 }),

      setHits: (team, count) =>
        set(team === 'away' ? { awayHits: count } : { homeHits: count }),

      setErrors: (team, count) =>
        set(team === 'away' ? { awayErrors: count } : { homeErrors: count }),

      setLineup: (team, lineup) =>
        set(team === 'away' ? { awayLineup: lineup } : { homeLineup: lineup }),

      setLineupPlayer: (team, index, player) =>
        set((s) => {
          const key = team === 'away' ? 'awayLineup' : 'homeLineup'
          const lineup = [...s[key]]
          lineup[index] = player
          return { [key]: lineup }
        }),

      selectBatter: (team, index) =>
        set((s) => {
          const key = team === 'away' ? 'awayLineup' : 'homeLineup'
          const player = s[key][index]
          if (!player) return s

          // 10番目（index 9）は投手 → 投手として登録
          if (index === 9) {
            return {
              pitcher: {
                name: player.name,
                number: player.number,
                stat: player.record || '',
                statLabel: player.appearances ? `${player.appearances}登板` : '',
              },
            }
          }

          const idxKey = team === 'away' ? 'awayBatterIndex' : 'homeBatterIndex'
          return {
            [idxKey]: index,
            batter: {
              name: player.name,
              number: player.number,
              stat: formatBatterStat(player),
              statLabel: '',
            },
          }
        }),

      nextBatter: () =>
        set((s) => {
          const isAway = s.currentHalf === 'top'
          const key = isAway ? 'awayLineup' : 'homeLineup'
          const idxKey = isAway ? 'awayBatterIndex' : 'homeBatterIndex'
          const currentIdx = s[idxKey]
          const nextIdx = (currentIdx + 1) % 9  // 1-9番のみ巡回（10番目=投手は除外）
          const player = s[key][nextIdx]
          if (!player) return s
          return {
            [idxKey]: nextIdx,
            batter: {
              name: player.name,
              number: player.number,
              stat: formatBatterStat(player),
              statLabel: '',
            },
            count: { ...s.count, balls: 0, strikes: 0 },
          }
        }),

      addPlayLog: (text) =>
        set((s) => {
          const entry = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            inning: s.currentInning,
            half: s.currentHalf,
            text,
          }
          return { playLog: [entry, ...s.playLog] }
        }),

      clearPlayLog: () => set({ playLog: [] }),

      setTeamName: (team, name, shortName) =>
        set((s) => {
          if (team === 'away') {
            return { awayTeam: { ...s.awayTeam, name, shortName } }
          }
          return { homeTeam: { ...s.homeTeam, name, shortName } }
        }),

      setGameOver: (over) => set({ isGameOver: over }),

      newGame: () => set({ ...initialGameState }),

      replaceState: (state) => set(state),

      subtractBall: () =>
        set((s) => ({
          count: { ...s.count, balls: Math.max(0, s.count.balls - 1) },
        })),

      subtractStrike: () =>
        set((s) => ({
          count: { ...s.count, strikes: Math.max(0, s.count.strikes - 1) },
        })),

      subtractOut: () =>
        set((s) => ({
          count: { ...s.count, outs: Math.max(0, s.count.outs - 1) },
        })),

      subtractRun: (team) =>
        set((s) => {
          const innings = [...s.innings]
          const currentIdx = innings.findIndex(
            (inn) => inn.inning === s.currentInning,
          )
          if (currentIdx === -1) return s

          const inn = { ...innings[currentIdx]! }
          const half = team === 'away' ? 'top' as const : 'bottom' as const
          const current = inn[half] ?? 0
          if (current <= 0) return s
          inn[half] = current - 1
          innings[currentIdx] = inn

          return recalcTotals({ ...extractGameState(s), innings })
        }),

      addPitch: () => set((s) => ({ pitchCount: s.pitchCount + 1 })),

      setPitchCount: (n) => set({ pitchCount: n }),

      startGameTimer: () => set({ gameStartTime: Date.now(), showWaitingScreen: false }),

      stopGameTimer: () => set({ gameStartTime: null }),

      setTicker: (text) => set({ ticker: text }),

      triggerEffect: (type) => {
        // 前回のタイマーをクリアして多重発火を防止
        if (_effectTimer) { clearTimeout(_effectTimer); _effectTimer = null }
        if (type) {
          set({ activeEffect: type, effectTimestamp: Date.now() })
          _effectTimer = setTimeout(() => {
            _effectTimer = null
            set({ activeEffect: null, effectTimestamp: 0 })
          }, EFFECT_DURATION_MS)
        } else {
          set({ activeEffect: null, effectTimestamp: 0 })
        }
      },

      setTeamColor: (team, color) =>
        set((s) => {
          if (team === 'away') {
            return { awayTeam: { ...s.awayTeam, color } }
          }
          return { homeTeam: { ...s.homeTeam, color } }
        }),

      rewindInning: () =>
        set((s) => {
          if (s.currentHalf === 'bottom') {
            return {
              currentHalf: 'top' as const,
              count: { balls: 0, strikes: 0, outs: 0 },
              runners: { first: false, second: false, third: false },
            }
          }
          if (s.currentInning <= 1) return s
          return {
            currentInning: s.currentInning - 1,
            currentHalf: 'bottom' as const,
            count: { balls: 0, strikes: 0, outs: 0 },
            runners: { first: false, second: false, third: false },
          }
        }),

      setShowMascot: (show) => set({ showMascot: show }),

      setMascotMode: (mode) => set({ mascotMode: mode }),

      setMascotImage: (mode, dataUrl) =>
        set((s) => {
          const mascotImages = { ...s.mascotImages }
          if (dataUrl) {
            mascotImages[mode] = dataUrl
          } else {
            delete mascotImages[mode]
          }
          return { mascotImages }
        }),

      setAutoChangeEffect: (on) => set({ autoChangeEffect: on }),

      setShowWaitingScreen: (show) => set({ showWaitingScreen: show }),

      setOverlayPosition: (id, pos) =>
        set((s) => ({
          overlayPositions: { ...s.overlayPositions, [id]: pos },
        })),

      resetOverlayPositions: () =>
        set({ overlayPositions: { ...DEFAULT_OVERLAY_POSITIONS } }),

      setOverlayScale: (scale) =>
        set({ overlayScale: Math.max(0.5, Math.min(3, scale)) }),

      setLineupDisplayTeam: (team) => set({ lineupDisplayTeam: team }),
    }),
    {
      name: 'yakyuu-game-state',
      storage: {
        getItem: (name) => {
          try {
            const raw = localStorage.getItem(name)
            if (raw) return JSON.parse(raw)
            // localStorage が空の場合 IndexedDB バックアップからの非同期復元をスケジュール
            // (getItem は同期 API なので初回は null を返し、復元完了後に replaceState する)
            if (!_preventPersistWrites) {
              restoreFromIDB().then((backup) => {
                if (backup) {
                  try {
                    const parsed = JSON.parse(backup)
                    const state = parsed.state
                    if (state) {
                      // localStorage に書き戻し + store を更新
                      localStorage.setItem(name, backup)
                      useGameStore.getState().replaceState(state)
                      console.info('Restored state from IndexedDB backup')
                    }
                  } catch { /* ignore */ }
                }
              })
            }
            return null
          } catch {
            // JSON 破損時はデータを削除して初期状態で起動（白画面防止）
            console.warn('Failed to parse localStorage — starting fresh')
            try { localStorage.removeItem(name) } catch { /* ignore */ }
            return null
          }
        },
        setItem: (name, value) => {
          if (_preventPersistWrites) return  // オーバーレイは書き込み禁止
          try {
            const raw = JSON.stringify(value)
            localStorage.setItem(name, raw)
            // IndexedDB にもバックアップ（非同期・失敗しても問題なし）
            backupToIDB(raw)
          } catch {
            // QuotaExceededError: 容量超過時は書き込みをスキップ
            console.warn('localStorage quota exceeded — state not persisted')
          }
        },
        removeItem: (name) => {
          if (_preventPersistWrites) return
          localStorage.removeItem(name)
        },
      },
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<GameStore>),
        // エフェクトは一時的な表示状態なので、リロード時にリセット
        activeEffect: null,
        effectTimestamp: 0,
      }),
    },
  ),
)

// subscribe でstate変更時に自動ブロードキャスト（関数を含まないデータのみ送信）
useGameStore.subscribe((state) => {
  broadcastState(extractGameState(state))
})

/** 四球・死球: 打者→一塁、フォースで走者押し出し、満塁なら得点 */
function applyWalk(s: GameState): Partial<GameState> {
  const { first, second, third } = s.runners
  const newRunners = { first: true, second, third }
  let runsScored = 0

  if (first) {
    newRunners.second = true
    if (second) {
      newRunners.third = true
      if (third) {
        // 満塁押し出し — 三塁走者が生還
        runsScored = 1
      }
    }
  }

  const patch: Partial<GameState> = {
    count: { ...s.count, balls: 0, strikes: 0 },
    runners: newRunners,
  }

  if (runsScored > 0) {
    const innings = [...s.innings]
    const idx = innings.findIndex((inn) => inn.inning === s.currentInning)
    if (idx !== -1) {
      const inn = { ...innings[idx]! }
      const half = s.currentHalf
      inn[half] = (inn[half] ?? 0) + runsScored
      innings[idx] = inn
      const totals = recalcTotals({ ...extractGameState(s), innings })
      patch.innings = totals.innings
      patch.awayTotal = totals.awayTotal
      patch.homeTotal = totals.homeTotal
    }
  }

  return patch
}

function advanceInningPatch(s: GameState): Partial<GameState> {
  const resetState: Partial<GameState> = {
    count: { balls: 0, strikes: 0, outs: 0 },
    runners: { first: false, second: false, third: false },
    batter: { ...initialPlayerInfo },
  }

  if (s.autoChangeEffect) {
    resetState.activeEffect = 'change'
    resetState.effectTimestamp = Date.now()
    // 前回のタイマーをクリアして多重発火を防止
    if (_effectTimer) { clearTimeout(_effectTimer); _effectTimer = null }
    _effectTimer = setTimeout(() => {
      _effectTimer = null
      useGameStore.setState({ activeEffect: null, effectTimestamp: 0 })
    }, EFFECT_DURATION_MS)
  }

  if (s.currentHalf === 'top') {
    return { ...resetState, currentHalf: 'bottom' as const }
  }

  const nextInning = s.currentInning + 1
  const innings = [...s.innings]
  if (!innings.find((inn) => inn.inning === nextInning)) {
    innings.push({ inning: nextInning, top: null, bottom: null })
  }

  return {
    ...resetState,
    currentInning: nextInning,
    currentHalf: 'top' as const,
    innings,
  }
}
