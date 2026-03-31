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

// デモ用: オリックス・バファローズ 2025スタメン
export const ORIX_LINEUP: LineupPlayer[] = [
  { order: 1, name: '福田 周平', number: '1', position: '二', battingAvg: '.267', homeRuns: '5', rbi: '28', ops: '.712' },
  { order: 2, name: '中川 圭太', number: '4', position: '一', battingAvg: '.280', homeRuns: '8', rbi: '42', ops: '.768' },
  { order: 3, name: '頓宮 裕真', number: '44', position: 'DH', battingAvg: '.307', homeRuns: '18', rbi: '65', ops: '.871' },
  { order: 4, name: '森 友哉', number: '9', position: '捕', battingAvg: '.294', homeRuns: '15', rbi: '58', ops: '.836' },
  { order: 5, name: '杉本 裕太郎', number: '99', position: '右', battingAvg: '.256', homeRuns: '22', rbi: '70', ops: '.815' },
  { order: 6, name: '紅林 弘太郎', number: '34', position: '遊', battingAvg: '.261', homeRuns: '10', rbi: '45', ops: '.731' },
  { order: 7, name: '西野 真弥', number: '7', position: '左', battingAvg: '.249', homeRuns: '3', rbi: '22', ops: '.668' },
  { order: 8, name: '太田 椋', number: '24', position: '三', battingAvg: '.233', homeRuns: '7', rbi: '30', ops: '.654' },
  { order: 9, name: '来田 涼斗', number: '51', position: '中', battingAvg: '.245', homeRuns: '4', rbi: '18', ops: '.645' },
  { order: 10, name: '宮城 大弥', number: '13', position: '投', appearances: '15', record: '8勝4敗' },
]

// デモ用: ソフトバンク・ホークス 2025スタメン
export const HAWKS_LINEUP: LineupPlayer[] = [
  { order: 1, name: '近藤 健介', number: '3', position: '左', battingAvg: '.303', homeRuns: '12', rbi: '52', ops: '.882' },
  { order: 2, name: '柳田 悠岐', number: '9', position: 'DH', battingAvg: '.285', homeRuns: '20', rbi: '68', ops: '.901' },
  { order: 3, name: '山川 穂高', number: '33', position: '一', battingAvg: '.272', homeRuns: '28', rbi: '82', ops: '.912' },
  { order: 4, name: '栗原 陵矢', number: '1', position: '右', battingAvg: '.268', homeRuns: '14', rbi: '55', ops: '.788' },
  { order: 5, name: '牧原 大成', number: '2', position: '二', battingAvg: '.282', homeRuns: '6', rbi: '35', ops: '.742' },
  { order: 6, name: '今宮 健太', number: '6', position: '遊', battingAvg: '.248', homeRuns: '8', rbi: '38', ops: '.698' },
  { order: 7, name: '甲斐 拓也', number: '19', position: '捕', battingAvg: '.231', homeRuns: '5', rbi: '25', ops: '.632' },
  { order: 8, name: '柳町 達', number: '64', position: '中', battingAvg: '.255', homeRuns: '3', rbi: '20', ops: '.672' },
  { order: 9, name: '周東 佑京', number: '4', position: '三', battingAvg: '.246', homeRuns: '2', rbi: '15', ops: '.658' },
  { order: 10, name: '東浜 巨', number: '11', position: '投', appearances: '18', record: '10勝3敗' },
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
  awayTeam: { name: 'オリックス', shortName: 'Bs', color: '#002D6E' },
  homeTeam: { name: 'ソフトバンク', shortName: 'SB', color: '#F5A800' },
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
  batter: { name: '福田 周平', number: '1', stat: '.267 5本 28打点 OPS.712', statLabel: '' },
  pitcher: { name: '東浜 巨', number: '11', stat: '10勝3敗', statLabel: '18登板' },
  awayLineup: [...ORIX_LINEUP],
  homeLineup: [...HAWKS_LINEUP],
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
}

export { emptyLineup }
