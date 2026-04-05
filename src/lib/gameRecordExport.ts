import type { GameState } from '../types'
import { formatInningsPitched } from '../types'

/** 試合記録を自己完結 HTML として生成 */
export function generateGameRecordHTML(state: GameState): string {
  const date = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const scoreRows = buildScoreTable(state)
  const awayPitchers = buildPitcherTable(state.awayPitcherHistory)
  const homePitchers = buildPitcherTable(state.homePitcherHistory)
  const playLogHTML = buildPlayLog(state)

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(state.awayTeam.name)} vs ${esc(state.homeTeam.name)} - 試合記録</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Hiragino Sans', 'Noto Sans JP', sans-serif; max-width: 800px; margin: 0 auto; padding: 24px; background: #f5f5f5; color: #333; }
  h1 { font-size: 1.4rem; margin-bottom: 4px; }
  h2 { font-size: 1.1rem; margin: 20px 0 8px; border-left: 4px solid #538bb0; padding-left: 8px; }
  .date { color: #888; font-size: 0.85rem; margin-bottom: 16px; }
  .result { font-size: 1.2rem; font-weight: bold; margin-bottom: 16px; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 16px; font-size: 0.85rem; }
  th, td { border: 1px solid #ccc; padding: 4px 8px; text-align: center; }
  th { background: #e8e8e8; font-weight: bold; }
  .team-name { text-align: left; font-weight: bold; min-width: 80px; }
  .total { font-weight: bold; background: #f0f0f0; }
  .pitcher-active { color: #2a7a2a; }
  .log-inning { font-weight: bold; color: #538bb0; margin-top: 12px; margin-bottom: 4px; }
  .log-entry { font-size: 0.8rem; color: #555; padding-left: 12px; }
  footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #ddd; font-size: 0.75rem; color: #aaa; text-align: center; }
</style>
</head>
<body>
<h1>${esc(state.awayTeam.name)} vs ${esc(state.homeTeam.name)}</h1>
<p class="date">${date}</p>
<p class="result">${state.awayTotal} - ${state.homeTotal}${state.isGameOver ? ' (試合終了)' : ''}</p>

<h2>スコア</h2>
${scoreRows}

<h2>${esc(state.awayTeam.name)} 投手成績</h2>
${awayPitchers}

<h2>${esc(state.homeTeam.name)} 投手成績</h2>
${homePitchers}

${playLogHTML}

<footer>yakyuu スコアボード — ${date}</footer>
</body>
</html>`
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function buildScoreTable(state: GameState): string {
  const maxInning = Math.max(9, state.innings.length)
  const display = Array.from({ length: maxInning }, (_, i) => {
    const num = i + 1
    return state.innings.find(inn => inn.inning === num) ?? { inning: num, top: null, bottom: null }
  })

  const headers = display.map(inn => `<th>${inn.inning}</th>`).join('')
  const awayScores = display.map(inn =>
    `<td>${inn.top !== null ? inn.top : ''}</td>`
  ).join('')
  const homeScores = display.map(inn =>
    `<td>${inn.bottom !== null ? inn.bottom : ''}</td>`
  ).join('')

  return `<table>
<tr><th></th>${headers}<th class="total">R</th><th class="total">H</th><th class="total">E</th></tr>
<tr><td class="team-name">${esc(state.awayTeam.shortName)}</td>${awayScores}<td class="total">${state.awayTotal}</td><td class="total">${state.awayHits}</td><td class="total">${state.awayErrors}</td></tr>
<tr><td class="team-name">${esc(state.homeTeam.shortName)}</td>${homeScores}<td class="total">${state.homeTotal}</td><td class="total">${state.homeHits}</td><td class="total">${state.homeErrors}</td></tr>
</table>`
}

function buildPitcherTable(history: GameState['awayPitcherHistory']): string {
  if (history.length === 0) return '<p style="font-size:0.85rem;color:#888;">記録なし</p>'

  const rows = history.map((p, i) => {
    const label = i === 0 ? '先発' : `${i}番手`
    const activeClass = p.isActive ? ' class="pitcher-active"' : ''
    const status = p.isActive ? ' (登板中)' : ''
    return `<tr${activeClass}><td>${label}</td><td style="text-align:left">${esc(p.name)}</td><td>${formatInningsPitched(p.outsRecorded)}</td><td>${p.pitchCount}</td><td>${status}</td></tr>`
  }).join('\n')

  const totalPitches = history.reduce((sum, p) => sum + p.pitchCount, 0)
  const totalOuts = history.reduce((sum, p) => sum + p.outsRecorded, 0)

  return `<table>
<tr><th></th><th style="text-align:left">投手</th><th>投球回</th><th>投球数</th><th></th></tr>
${rows}
<tr class="total"><td></td><td style="text-align:left">合計</td><td>${formatInningsPitched(totalOuts)}</td><td>${totalPitches}</td><td></td></tr>
</table>`
}

function buildPlayLog(state: GameState): string {
  if (state.playLog.length === 0) return ''

  // playLog は新しい順なので逆順にする
  const sorted = [...state.playLog].reverse()

  let html = '<h2>経過</h2>'
  let currentLabel = ''
  for (const entry of sorted) {
    const label = `${entry.inning}回${entry.half === 'top' ? '表' : '裏'}`
    if (label !== currentLabel) {
      currentLabel = label
      html += `<p class="log-inning">${label}</p>`
    }
    html += `<p class="log-entry">${esc(entry.text)}</p>`
  }
  return html
}
