export type HalfInning = 'top' | 'bottom'

export type Position = '投' | '捕' | '一' | '二' | '三' | '遊' | '左' | '中' | '右' | 'DH' | ''

export interface Count {
  balls: number
  strikes: number
  outs: number
}

export interface Runners {
  first: boolean
  second: boolean
  third: boolean
}

export interface PlayerInfo {
  name: string
  number: string
  stat: string
  statLabel: string
}

export interface LineupPlayer {
  order: number
  name: string
  number: string
  position: Position
  // 打者用（1-9番）
  battingAvg?: string   // 打率
  homeRuns?: string     // 本塁打数
  rbi?: string          // 打点
  ops?: string          // OPS
  // 投手用（10番目）
  appearances?: string  // 登板数
  record?: string       // 勝敗（例: "5勝3敗"）
}

export interface InningScore {
  inning: number
  top: number | null
  bottom: number | null
}

export interface PlayLogEntry {
  id: string
  timestamp: number
  inning: number
  half: HalfInning
  text: string
}

export type MascotMode = 'idle' | 'hidden' | 'celebration' | 'waiting'

export type EffectType = 'homerun' | 'strikeout' | 'double' | 'triple' | 'hit' | 'steal' | 'fineplay' | 'error' | 'walk' | 'change' | null

export interface Team {
  name: string
  shortName: string
  color: string
}

export interface OverlayPosition {
  x: number
  y: number
}

export interface GameState {
  awayTeam: Team
  homeTeam: Team
  currentInning: number
  currentHalf: HalfInning
  isGameOver: boolean
  innings: InningScore[]
  awayTotal: number
  homeTotal: number
  awayHits: number
  homeHits: number
  awayErrors: number
  homeErrors: number
  count: Count
  runners: Runners
  batter: PlayerInfo
  pitcher: PlayerInfo
  awayLineup: LineupPlayer[]
  homeLineup: LineupPlayer[]
  awayBatterIndex: number
  homeBatterIndex: number
  playLog: PlayLogEntry[]
  pitchCount: number
  gameStartTime: number | null
  ticker: string
  activeEffect: EffectType
  effectTimestamp: number
  showMascot: boolean
  mascotMode: MascotMode
  mascotImages: Record<string, string>
  autoChangeEffect: boolean
  showWaitingScreen: boolean
  overlayPositions: Record<string, OverlayPosition>
  overlayScale: number
  /** コントロールパネルで選択中のチーム。オーバーレイの打順表示に連動する */
  lineupDisplayTeam: 'away' | 'home'
}

export const initialPlayerInfo: PlayerInfo = {
  name: '',
  number: '',
  stat: '',
  statLabel: '',
}

function emptyLineup(): LineupPlayer[] {
  return Array.from({ length: 10 }, (_, i) => ({
    order: i + 1,
    name: '',
    number: '',
    position: (i === 9 ? '投' : '') as Position,
  }))
}

/** 打者のスタッツ文字列を生成 */
export function formatBatterStat(player: LineupPlayer): string {
  const parts: string[] = []
  if (player.battingAvg) parts.push(player.battingAvg)
  if (player.homeRuns) parts.push(`${player.homeRuns}本`)
  if (player.rbi) parts.push(`${player.rbi}打点`)
  if (player.ops) parts.push(`OPS${player.ops}`)
  return parts.join(' ')
}

// デモ用: 広島東洋カープ 2025スタメン
export const CARP_LINEUP: LineupPlayer[] = [
  { order: 1, name: '秋山 翔吾', number: '55', position: '左', battingAvg: '.278', homeRuns: '4', rbi: '28', ops: '.735' },
  { order: 2, name: '野間 峻祥', number: '37', position: '中', battingAvg: '.265', homeRuns: '3', rbi: '22', ops: '.698' },
  { order: 3, name: '小園 海斗', number: '51', position: '遊', battingAvg: '.291', homeRuns: '14', rbi: '58', ops: '.815' },
  { order: 4, name: '坂倉 将吾', number: '31', position: '捕', battingAvg: '.288', homeRuns: '16', rbi: '62', ops: '.838' },
  { order: 5, name: '末包 昇大', number: '64', position: '右', battingAvg: '.258', homeRuns: '20', rbi: '60', ops: '.798' },
  { order: 6, name: 'マクブルーム', number: '42', position: '一', battingAvg: '.272', homeRuns: '22', rbi: '68', ops: '.825' },
  { order: 7, name: '菊池 涼介', number: '33', position: '二', battingAvg: '.248', homeRuns: '5', rbi: '30', ops: '.672' },
  { order: 8, name: '上本 崇司', number: '0', position: '三', battingAvg: '.242', homeRuns: '3', rbi: '18', ops: '.655' },
  { order: 9, name: '田村 俊介', number: '38', position: 'DH', battingAvg: '.240', homeRuns: '2', rbi: '15', ops: '.638' },
  { order: 10, name: '森下 暢仁', number: '18', position: '投', appearances: '22', record: '10勝5敗' },
]

export const DEFAULT_OVERLAY_POSITIONS: Record<string, OverlayPosition> = {
  scoreboard: { x: 24, y: 24 },
  timer: { x: 24, y: 160 },
  lineup: { x: 1420, y: 24 },
  playerInfo: { x: 24, y: 1020 },
  playLog: { x: 1560, y: 800 },
  mascot: { x: 1740, y: 900 },
}

export const initialGameState: GameState = {
  awayTeam: { name: '広島カープ', shortName: 'C', color: '#ED1A3D' },
  homeTeam: { name: '広島カープ', shortName: 'C', color: '#ED1A3D' },
  currentInning: 1,
  currentHalf: 'top',
  isGameOver: false,
  innings: Array.from({ length: 9 }, (_, i) => ({ inning: i + 1, top: null, bottom: null })),
  awayTotal: 0,
  homeTotal: 0,
  awayHits: 0,
  homeHits: 0,
  awayErrors: 0,
  homeErrors: 0,
  count: { balls: 0, strikes: 0, outs: 0 },
  runners: { first: false, second: false, third: false },
  batter: { name: '秋山 翔吾', number: '55', stat: '.278 4本 28打点 OPS.735', statLabel: '' },
  pitcher: { name: '森下 暢仁', number: '18', stat: '10勝5敗', statLabel: '22登板' },
  awayLineup: [...CARP_LINEUP],
  homeLineup: [...CARP_LINEUP],
  awayBatterIndex: 0,
  homeBatterIndex: 0,
  playLog: [],
  pitchCount: 0,
  gameStartTime: null,
  ticker: '',
  activeEffect: null,
  effectTimestamp: 0,
  showMascot: false,
  mascotMode: 'idle',
  mascotImages: {},
  autoChangeEffect: true,
  showWaitingScreen: false,
  overlayPositions: { ...DEFAULT_OVERLAY_POSITIONS },
  overlayScale: 1,
  lineupDisplayTeam: 'away',
}

export { emptyLineup }
