import { useGameStore } from '../../store/useGameStore'

export default function Scoreboard() {
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

  // 常に9回分を表示（延長があればそれ以上）
  const minInnings = 9
  const displayCount = Math.max(minInnings, innings.length)
  const displayInnings = Array.from({ length: displayCount }, (_, i) => {
    const num = i + 1
    const existing = innings.find((inn) => inn.inning === num)
    return existing ?? { inning: num, top: null, bottom: null }
  })

  return (
    <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white text-sm font-mono">
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="px-3 py-1 text-left text-accent font-bold min-w-[80px]">
              &nbsp;
            </th>
            {displayInnings.map((inn) => (
              <th
                key={inn.inning}
                className={`px-2 py-1 text-center min-w-[26px] ${
                  inn.inning === currentInning
                    ? 'text-accent font-bold'
                    : 'text-gray-400'
                }`}
              >
                {inn.inning}
              </th>
            ))}
            <th className="px-2 py-1 text-center text-yellow-400 font-bold border-l border-gray-600 min-w-[30px]">
              R
            </th>
            <th className="px-2 py-1 text-center text-green-400 font-bold min-w-[30px]">
              H
            </th>
            <th className="px-2 py-1 text-center text-red-400 font-bold min-w-[30px]">
              E
            </th>
          </tr>
        </thead>
        <tbody>
          {/* アウェイ（先攻） */}
          <tr className={currentHalf === 'top' ? 'bg-white/10' : ''}>
            <td className="px-3 py-1 font-bold">
              <span className="inline-flex items-center gap-1">
                <span
                  className="w-1 h-4 rounded-sm inline-block"
                  style={{ backgroundColor: awayTeam.color }}
                />
                {currentHalf === 'top' && (
                  <span className="text-accent text-xs">▲</span>
                )}
                {awayTeam.shortName}
              </span>
            </td>
            {displayInnings.map((inn) => (
              <td key={inn.inning} className="px-2 py-1 text-center">
                {inn.top ?? '-'}
              </td>
            ))}
            <td className="px-2 py-1 text-center font-bold border-l border-gray-600 text-yellow-400">
              {awayTotal}
            </td>
            <td className="px-2 py-1 text-center font-bold text-green-400">
              {awayHits}
            </td>
            <td className="px-2 py-1 text-center font-bold text-red-400">
              {awayErrors}
            </td>
          </tr>
          {/* ホーム（後攻） */}
          <tr className={currentHalf === 'bottom' ? 'bg-white/10' : ''}>
            <td className="px-3 py-1 font-bold">
              <span className="inline-flex items-center gap-1">
                <span
                  className="w-1 h-4 rounded-sm inline-block"
                  style={{ backgroundColor: homeTeam.color }}
                />
                {currentHalf === 'bottom' && (
                  <span className="text-accent text-xs">▼</span>
                )}
                {homeTeam.shortName}
              </span>
            </td>
            {displayInnings.map((inn) => (
              <td key={inn.inning} className="px-2 py-1 text-center">
                {inn.bottom ?? '-'}
              </td>
            ))}
            <td className="px-2 py-1 text-center font-bold border-l border-gray-600 text-yellow-400">
              {homeTotal}
            </td>
            <td className="px-2 py-1 text-center font-bold text-green-400">
              {homeHits}
            </td>
            <td className="px-2 py-1 text-center font-bold text-red-400">
              {homeErrors}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
