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
  battingAvg: string
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

export type EffectType = 'homerun' | 'strikeout' | 'double' | 'triple' | null

export interface Team {
  name: string
  shortName: string
  color: string
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
}

export const initialPlayerInfo: PlayerInfo = {
  name: '',
  number: '',
  stat: '',
  statLabel: '',
}

function emptyLineup(): LineupPlayer[] {
  return Array.from({ length: 9 }, (_, i) => ({
    order: i + 1,
    name: '',
    number: '',
    position: '' as Position,
    battingAvg: '',
  }))
}

// デモ用: オリックス・バファローズ 2025スタメン
export const ORIX_LINEUP: LineupPlayer[] = [
  { order: 1, name: '福田 周平', number: '1', position: '二', battingAvg: '.267' },
  { order: 2, name: '中川 圭太', number: '4', position: '一', battingAvg: '.280' },
  { order: 3, name: '頓宮 裕真', number: '44', position: 'DH', battingAvg: '.307' },
  { order: 4, name: '森 友哉', number: '9', position: '捕', battingAvg: '.294' },
  { order: 5, name: '杉本 裕太郎', number: '99', position: '右', battingAvg: '.256' },
  { order: 6, name: '紅林 弘太郎', number: '34', position: '遊', battingAvg: '.261' },
  { order: 7, name: '西野 真弥', number: '7', position: '左', battingAvg: '.249' },
  { order: 8, name: '太田 椋', number: '24', position: '三', battingAvg: '.233' },
  { order: 9, name: '来田 涼斗', number: '51', position: '中', battingAvg: '.245' },
]

// デモ用: ソフトバンク・ホークス 2025スタメン
export const HAWKS_LINEUP: LineupPlayer[] = [
  { order: 1, name: '近藤 健介', number: '3', position: '左', battingAvg: '.303' },
  { order: 2, name: '柳田 悠岐', number: '9', position: 'DH', battingAvg: '.285' },
  { order: 3, name: '山川 穂高', number: '33', position: '一', battingAvg: '.272' },
  { order: 4, name: '栗原 陵矢', number: '1', position: '右', battingAvg: '.268' },
  { order: 5, name: '牧原 大成', number: '2', position: '二', battingAvg: '.282' },
  { order: 6, name: '今宮 健太', number: '6', position: '遊', battingAvg: '.248' },
  { order: 7, name: '甲斐 拓也', number: '19', position: '捕', battingAvg: '.231' },
  { order: 8, name: '柳町 達', number: '64', position: '中', battingAvg: '.255' },
  { order: 9, name: '周東 佑京', number: '4', position: '三', battingAvg: '.246' },
]

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
  batter: { name: '福田 周平', number: '1', stat: '.267', statLabel: '打率' },
  pitcher: { name: '東浜 巨', number: '11', stat: '2.85', statLabel: '防御率' },
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
}

export { emptyLineup }
