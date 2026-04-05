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
  const count = useGameStore((s) => s.count)
  const runners = useGameStore((s) => s.runners)
  const pitchCount = useGameStore((s) => s.currentHalf === 'top' ? s.homePitchCount : s.awayPitchCount)

  const minInnings = 9
  const displayCount = Math.max(minInnings, innings.length)
  const displayInnings = Array.from({ length: displayCount }, (_, i) => {
    const num = i + 1
    const existing = innings.find((inn) => inn.inning === num)
    return existing ?? { inning: num, top: null, bottom: null }
  })

  return (
    <div className="font-mono text-sm select-none">
      {/* メインスコアボード */}
      <div className="scoreboard-main rounded-t-lg overflow-hidden">
        <table className="border-collapse w-full">
          <thead>
            <tr className="bg-gray-900/95">
              <th className="w-[100px]" />
              {displayInnings.map((inn) => (
                <th
                  key={inn.inning}
                  className={`px-1.5 py-1 text-center min-w-[24px] text-xs ${
                    inn.inning === currentInning
                      ? 'text-white bg-white/15 font-bold'
                      : 'text-gray-500'
                  }`}
                >
                  {inn.inning}
                </th>
              ))}
              <th className="px-2 py-1 text-center text-xs text-gray-400 border-l border-gray-600 min-w-[28px]">得点</th>
              <th className="px-2 py-1 text-center text-xs text-gray-400 min-w-[28px]">安打</th>
              <th className="px-2 py-1 text-center text-xs text-gray-400 min-w-[28px]">失策</th>
            </tr>
          </thead>
          <tbody>
            {/* アウェイ */}
            <tr className="border-b border-gray-700/50">
              <td className="py-1.5">
                <div className="flex items-center">
                  <div
                    className="w-1 h-8 rounded-r"
                    style={{ backgroundColor: awayTeam.color }}
                  />
                  <div className="flex items-center gap-1.5 px-2">
                    {currentHalf === 'top' && (
                      <span className="text-[8px] text-yellow-400">▶</span>
                    )}
                    <span className="text-white font-bold text-sm">{awayTeam.name}</span>
                  </div>
                </div>
              </td>
              {displayInnings.map((inn) => {
                // 表（away）: 現在イニング以前は完了扱い → null を 0 表示
                const topPlayed = inn.inning <= currentInning
                return (
                  <td
                    key={inn.inning}
                    className={`px-1.5 py-1.5 text-center text-white text-xs ${
                      inn.inning === currentInning && currentHalf === 'top'
                        ? 'bg-white/10 font-bold'
                        : ''
                    }`}
                  >
                    {topPlayed
                      ? (inn.top ?? 0)
                      : <span className="text-gray-600">-</span>
                    }
                  </td>
                )
              })}
              <td className="px-2 py-1.5 text-center font-bold text-white text-base border-l border-gray-600">
                {awayTotal}
              </td>
              <td className="px-2 py-1.5 text-center text-gray-300 text-xs">{awayHits}</td>
              <td className="px-2 py-1.5 text-center text-gray-300 text-xs">{awayErrors}</td>
            </tr>
            {/* ホーム */}
            <tr>
              <td className="py-1.5">
                <div className="flex items-center">
                  <div
                    className="w-1 h-8 rounded-r"
                    style={{ backgroundColor: homeTeam.color }}
                  />
                  <div className="flex items-center gap-1.5 px-2">
                    {currentHalf === 'bottom' && (
                      <span className="text-[8px] text-yellow-400">▶</span>
                    )}
                    <span className="text-white font-bold text-sm">{homeTeam.name}</span>
                  </div>
                </div>
              </td>
              {displayInnings.map((inn) => {
                // 裏（home）: 前イニング以前 or 現在イニングの裏なら完了扱い
                const bottomPlayed = inn.inning < currentInning ||
                  (inn.inning === currentInning && currentHalf === 'bottom')
                return (
                  <td
                    key={inn.inning}
                    className={`px-1.5 py-1.5 text-center text-white text-xs ${
                      inn.inning === currentInning && currentHalf === 'bottom'
                        ? 'bg-white/10 font-bold'
                        : ''
                    }`}
                  >
                    {bottomPlayed
                      ? (inn.bottom ?? 0)
                      : <span className="text-gray-600">-</span>
                    }
                  </td>
                )
              })}
              <td className="px-2 py-1.5 text-center font-bold text-white text-base border-l border-gray-600">
                {homeTotal}
              </td>
              <td className="px-2 py-1.5 text-center text-gray-300 text-xs">{homeHits}</td>
              <td className="px-2 py-1.5 text-center text-gray-300 text-xs">{homeErrors}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ボトムバー: イニング + BSO + 走者 + 球数 */}
      <div className="bg-gray-900/95 rounded-b-lg px-3 py-1.5 flex items-center gap-4 border-t border-gray-600/50">
        {/* イニング */}
        <div className="flex items-center gap-1">
          <span className="text-yellow-400 text-xs font-bold">
            {currentHalf === 'top' ? '▲' : '▼'}
          </span>
          <span className="text-white text-xs font-bold">
            {currentInning}回
          </span>
        </div>

        <div className="w-px h-4 bg-gray-600" />

        {/* BSO */}
        <div className="flex items-center gap-2">
          <BSODots label="B" count={count.balls} max={4} color="bg-green-500" />
          <BSODots label="S" count={count.strikes} max={3} color="bg-yellow-400" />
          <BSODots label="O" count={count.outs} max={3} color="bg-red-500" />
        </div>

        <div className="w-px h-4 bg-gray-600" />

        {/* ミニダイヤモンド */}
        <MiniDiamond first={runners.first} second={runners.second} third={runners.third} />

        {/* 球数 */}
        <div className="text-gray-400 text-[10px] ml-auto">
          <span className="text-gray-500">P</span>{' '}
          <span className="text-white font-bold text-xs">{pitchCount}</span>
        </div>
      </div>
    </div>
  )
}

function BSODots({ label, count, max, color }: { label: string; count: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-gray-500 text-[10px] font-bold w-2">{label}</span>
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${
            i < count ? color : 'bg-gray-700'
          }`}
        />
      ))}
    </div>
  )
}

function MiniDiamond({ first, second, third }: { first: boolean; second: boolean; third: boolean }) {
  const base = (on: boolean) =>
    `w-2.5 h-2.5 rotate-45 ${on ? 'bg-yellow-400' : 'bg-gray-700'}`

  return (
    <div className="relative w-[22px] h-[22px]">
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 ${base(second)}`} />
      <div className={`absolute top-1/2 left-0 -translate-y-1/2 ${base(third)}`} />
      <div className={`absolute top-1/2 right-0 -translate-y-1/2 ${base(first)}`} />
    </div>
  )
}
