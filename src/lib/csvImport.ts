import type { LineupPlayer, Position } from '../types'

const VALID_POSITIONS: Position[] = ['投', '捕', '一', '二', '三', '遊', '左', '中', '右', 'DH']

/**
 * CSV テキストから LineupPlayer[] をパースする。
 *
 * 期待フォーマット（ヘッダー行あり）:
 *   順番,名前,背番号,守備,打率,HR,打点,OPS,登板数,勝敗
 *
 * - 1〜9行目: 野手（打率・HR・打点・OPS を使用）
 * - 10行目: 投手（登板数・勝敗を使用）
 * - ヘッダー行は自動スキップ（1列目が数値でなければヘッダーと判定）
 */
export function parseLineupCsv(text: string): LineupPlayer[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  if (lines.length === 0) {
    throw new Error('CSVが空です')
  }

  // ヘッダー行をスキップ
  const firstCol = lines[0]!.split(',')[0]!.trim()
  const dataLines = /^\d+$/.test(firstCol) ? lines : lines.slice(1)

  if (dataLines.length === 0) {
    throw new Error('データ行がありません')
  }

  const players: LineupPlayer[] = []

  for (const line of dataLines) {
    const cols = line.split(',').map((c) => c.trim())
    const order = parseInt(cols[0] ?? '', 10)
    if (isNaN(order) || order < 1 || order > 10) continue

    const name = cols[1] ?? ''
    const number = cols[2] ?? ''
    const posRaw = cols[3] ?? ''
    const position = (VALID_POSITIONS.includes(posRaw as Position) ? posRaw : '') as Position

    if (order === 10) {
      // 投手
      players.push({
        order,
        name,
        number,
        position: position || '投',
        appearances: cols[8] ?? '',
        record: cols[9] ?? '',
      })
    } else {
      // 野手
      players.push({
        order,
        name,
        number,
        position,
        battingAvg: cols[4] ?? '',
        homeRuns: cols[5] ?? '',
        rbi: cols[6] ?? '',
        ops: cols[7] ?? '',
      })
    }
  }

  // 不足分を空行で埋める（10人分）
  for (let i = 1; i <= 10; i++) {
    if (!players.find((p) => p.order === i)) {
      players.push({
        order: i,
        name: '',
        number: '',
        position: (i === 10 ? '投' : '') as Position,
      })
    }
  }

  // order 順にソート
  players.sort((a, b) => a.order - b.order)

  return players
}
