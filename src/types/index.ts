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

export interface PitcherAppearance {
  id: string
  name: string
  number: string
  record: string        // 勝敗 ("10勝5敗")
  appearances: string   // 登板数
  pitchCount: number
  outsRecorded: number  // アウト取得数（投球回算出用）
  enteredInning: number
  enteredHalf: HalfInning
  exitedInning: number | null   // null = 現在登板中
  exitedHalf: HalfInning | null
  isActive: boolean
}

/** アウト取得数から投球回表記を生成（例: 20 → "6.2" = 6回2/3） */
export function formatInningsPitched(outsRecorded: number): string {
  const full = Math.floor(outsRecorded / 3)
  const remainder = outsRecorded % 3
  return remainder === 0 ? `${full}` : `${full}.${remainder}`
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
  scale?: number
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
  awayPitchCount: number
  homePitchCount: number
  awayPitcherHistory: PitcherAppearance[]
  homePitcherHistory: PitcherAppearance[]
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

// デモ用: 福岡ソフトバンクホークス 2025スタメン
export const HAWKS_LINEUP: LineupPlayer[] = [
  { order: 1, name: '周東 佑京', number: '4', position: '中', battingAvg: '.268', homeRuns: '5', rbi: '25', ops: '.710' },
  { order: 2, name: '今宮 健太', number: '6', position: '遊', battingAvg: '.255', homeRuns: '8', rbi: '35', ops: '.698' },
  { order: 3, name: '柳田 悠岐', number: '9', position: '左', battingAvg: '.285', homeRuns: '20', rbi: '65', ops: '.880' },
  { order: 4, name: '山川 穂高', number: '33', position: '一', battingAvg: '.270', homeRuns: '28', rbi: '80', ops: '.890' },
  { order: 5, name: '近藤 健介', number: '3', position: 'DH', battingAvg: '.302', homeRuns: '15', rbi: '58', ops: '.865' },
  { order: 6, name: '栗原 陵矢', number: '1', position: '右', battingAvg: '.262', homeRuns: '12', rbi: '45', ops: '.758' },
  { order: 7, name: '牧原 大成', number: '2', position: '二', battingAvg: '.278', homeRuns: '3', rbi: '20', ops: '.695' },
  { order: 8, name: '甲斐 拓也', number: '19', position: '捕', battingAvg: '.230', homeRuns: '8', rbi: '30', ops: '.640' },
  { order: 9, name: '三森 大貴', number: '0', position: '三', battingAvg: '.245', homeRuns: '4', rbi: '22', ops: '.665' },
  { order: 10, name: '東浜 巨', number: '14', position: '投', appearances: '20', record: '8勝6敗' },
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
  awayTeam: { name: '楽天', shortName: '楽天', color: '#860012' },
  homeTeam: { name: 'ソフトバンク', shortName: 'ソフトバンク', color: '#F5C51C' },
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
  awayPitchCount: 0,
  homePitchCount: 0,
  awayPitcherHistory: [],
  homePitcherHistory: [],
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
