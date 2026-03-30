import { useGameStore } from '../../store/useGameStore'
import type { HalfInning } from '../../types'

export default function ScoreControl() {
  const innings = useGameStore((s) => s.innings)
  const awayTeam = useGameStore((s) => s.awayTeam)
  const homeTeam = useGameStore((s) => s.homeTeam)
  const awayTotal = useGameStore((s) => s.awayTotal)
  const homeTotal = useGameStore((s) => s.homeTotal)
  const awayHits = useGameStore((s) => s.awayHits)
  const homeHits = useGameStore((s) => s.homeHits)
  const awayErrors = useGameStore((s) => s.awayErrors)
  const homeErrors = useGameStore((s) => s.homeErrors)
  const currentInning = useGameStore((s) => s.currentInning)
  const currentHalf = useGameStore((s) => s.currentHalf)
  const addRun = useGameStore((s) => s.addRun)
  const subtractRun = useGameStore((s) => s.subtractRun)
  const setInningScore = useGameStore((s) => s.setInningScore)
  const addHit = useGameStore((s) => s.addHit)
  const addError = useGameStore((s) => s.addError)
  const setHits = useGameStore((s) => s.setHits)
  const setErrors = useGameStore((s) => s.setErrors)

  const handleScoreClick = (inning: number, half: HalfInning) => {
    const inn = innings.find((i) => i.inning === inning)
    if (!inn) return
    const current = inn[half] ?? 0
    const input = prompt(`${inning}回${half === 'top' ? '表' : '裏'}の得点:`, String(current))
    if (input === null) return
    const score = parseInt(input, 10)
    if (!isNaN(score) && score >= 0) {
      setInningScore(inning, half, score)
    }
  }

  const handleStatClick = (team: 'away' | 'home', stat: 'hits' | 'errors') => {
    const current = stat === 'hits'
      ? (team === 'away' ? awayHits : homeHits)
      : (team === 'away' ? awayErrors : homeErrors)
    const label = stat === 'hits' ? 'ヒット数' : 'エラー数'
    const teamLabel = team === 'away' ? awayTeam.shortName : homeTeam.shortName
    const input = prompt(`${teamLabel} ${label}:`, String(current))
    if (input === null) return
    const val = parseInt(input, 10)
    if (!isNaN(val) && val >= 0) {
      if (stat === 'hits') setHits(team, val)
      else setErrors(team, val)
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <h2 className="text-white font-bold text-lg">得点・安打・失策</h2>

      {/* クイック操作ボタン — アウェイ */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => subtractRun('away')}
          className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-2 rounded text-xs font-bold"
        >
          {awayTeam.shortName} -1点
        </button>
        <button
          onClick={() => addRun('away')}
          className="bg-accent hover:bg-accent/80 text-white px-2 py-2 rounded text-xs font-bold"
        >
          {awayTeam.shortName} +1点
        </button>
        <button
          onClick={() => addHit('away')}
          className="bg-green-700 hover:bg-green-600 text-white px-2 py-2 rounded text-xs font-bold"
        >
          +1H
        </button>
        <button
          onClick={() => addError('away')}
          className="bg-red-700 hover:bg-red-600 text-white px-2 py-2 rounded text-xs font-bold"
        >
          +1E
        </button>
        <button
          onClick={() => setErrors('away', Math.max(0, awayErrors - 1))}
          className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-2 rounded text-xs font-bold"
        >
          -1E
        </button>
      </div>
      {/* クイック操作ボタン — ホーム */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => subtractRun('home')}
          className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-2 rounded text-xs font-bold"
        >
          {homeTeam.shortName} -1点
        </button>
        <button
          onClick={() => addRun('home')}
          className="bg-accent hover:bg-accent/80 text-white px-2 py-2 rounded text-xs font-bold"
        >
          {homeTeam.shortName} +1点
        </button>
        <button
          onClick={() => addHit('home')}
          className="bg-green-700 hover:bg-green-600 text-white px-2 py-2 rounded text-xs font-bold"
        >
          +1H
        </button>
        <button
          onClick={() => addError('home')}
          className="bg-red-700 hover:bg-red-600 text-white px-2 py-2 rounded text-xs font-bold"
        >
          +1E
        </button>
        <button
          onClick={() => setErrors('home', Math.max(0, homeErrors - 1))}
          className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-2 rounded text-xs font-bold"
        >
          -1E
        </button>
      </div>

      {/* スコアグリッド */}
      <div className="overflow-x-auto">
        <table className="text-white text-sm font-mono border-collapse w-full">
          <thead>
            <tr>
              <th className="px-2 py-1 text-left text-gray-400">チーム</th>
              {innings.map((inn) => (
                <th
                  key={inn.inning}
                  className={`px-2 py-1 text-center ${
                    inn.inning === currentInning
                      ? 'text-accent'
                      : 'text-gray-400'
                  }`}
                >
                  {inn.inning}
                </th>
              ))}
              <th className="px-2 py-1 text-center text-yellow-400">R</th>
              <th className="px-2 py-1 text-center text-green-400">H</th>
              <th className="px-2 py-1 text-center text-red-400">E</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-2 py-1 font-bold">{awayTeam.shortName}</td>
              {innings.map((inn) => (
                <td
                  key={inn.inning}
                  className={`px-2 py-1 text-center cursor-pointer hover:bg-gray-600 rounded ${
                    inn.inning === currentInning && currentHalf === 'top'
                      ? 'bg-gray-700'
                      : ''
                  }`}
                  onClick={() => handleScoreClick(inn.inning, 'top')}
                >
                  {inn.top ?? '-'}
                </td>
              ))}
              <td className="px-2 py-1 text-center text-yellow-400 font-bold">
                {awayTotal}
              </td>
              <td
                className="px-2 py-1 text-center text-green-400 font-bold cursor-pointer hover:bg-gray-600 rounded"
                onClick={() => handleStatClick('away', 'hits')}
              >
                {awayHits}
              </td>
              <td
                className="px-2 py-1 text-center text-red-400 font-bold cursor-pointer hover:bg-gray-600 rounded"
                onClick={() => handleStatClick('away', 'errors')}
              >
                {awayErrors}
              </td>
            </tr>
            <tr>
              <td className="px-2 py-1 font-bold">{homeTeam.shortName}</td>
              {innings.map((inn) => (
                <td
                  key={inn.inning}
                  className={`px-2 py-1 text-center cursor-pointer hover:bg-gray-600 rounded ${
                    inn.inning === currentInning && currentHalf === 'bottom'
                      ? 'bg-gray-700'
                      : ''
                  }`}
                  onClick={() => handleScoreClick(inn.inning, 'bottom')}
                >
                  {inn.bottom ?? '-'}
                </td>
              ))}
              <td className="px-2 py-1 text-center text-yellow-400 font-bold">
                {homeTotal}
              </td>
              <td
                className="px-2 py-1 text-center text-green-400 font-bold cursor-pointer hover:bg-gray-600 rounded"
                onClick={() => handleStatClick('home', 'hits')}
              >
                {homeHits}
              </td>
              <td
                className="px-2 py-1 text-center text-red-400 font-bold cursor-pointer hover:bg-gray-600 rounded"
                onClick={() => handleStatClick('home', 'errors')}
              >
                {homeErrors}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-gray-500 text-xs">※ セルをクリックで数値を直接修正</p>
    </div>
  )
}
