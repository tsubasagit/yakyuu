import { useGameStore } from '../../store/useGameStore'

export default function LineupCard() {
  const awayTeam = useGameStore((s) => s.awayTeam)
  const homeTeam = useGameStore((s) => s.homeTeam)
  const awayLineup = useGameStore((s) => s.awayLineup)
  const homeLineup = useGameStore((s) => s.homeLineup)
  const currentHalf = useGameStore((s) => s.currentHalf)
  const awayBatterIndex = useGameStore((s) => s.awayBatterIndex)
  const homeBatterIndex = useGameStore((s) => s.homeBatterIndex)

  const isAway = currentHalf === 'top'
  const lineup = isAway ? awayLineup : homeLineup
  const team = isAway ? awayTeam : homeTeam
  const currentIdx = isAway ? awayBatterIndex : homeBatterIndex

  const hasPlayers = lineup.some((p) => p.name.length > 0)
  if (!hasPlayers) return null

  return (
    <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-3 text-white min-w-[240px]">
      <div className="text-accent font-bold text-xs mb-2 flex items-center gap-2">
        <span>{isAway ? '▲' : '▼'}</span>
        <span>{team.name} 打順</span>
      </div>
      <div className="flex flex-col gap-0.5">
        {lineup.map((player, idx) => {
          if (!player.name) return null
          const isCurrent = idx === currentIdx
          return (
            <div
              key={player.order}
              className={`flex items-center gap-2 text-xs px-2 py-0.5 rounded ${
                isCurrent ? 'bg-accent/30 text-white font-bold' : 'text-gray-300'
              }`}
            >
              <span className="w-4 text-center text-gray-500 text-[10px]">
                {player.order}
              </span>
              <span className="w-6 text-center text-yellow-400 font-mono text-[10px]">
                {player.position}
              </span>
              <span className="flex-1 truncate">{player.name}</span>
              <span className="text-gray-400 text-[10px]">#{player.number}</span>
              <span className="text-yellow-400 font-mono w-10 text-right text-[11px]">
                {player.battingAvg}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
