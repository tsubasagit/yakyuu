import { useGameStore } from '../../store/useGameStore'
import type { LineupPlayer, Team } from '../../types'

function TeamLineup({
  team,
  lineup,
  currentIdx,
  isAttacking,
  side,
}: {
  team: Team
  lineup: LineupPlayer[]
  currentIdx: number
  isAttacking: boolean
  side: 'away' | 'home'
}) {
  const hasPlayers = lineup.some((p) => p.name.length > 0)
  if (!hasPlayers) return null

  return (
    <div className="min-w-[220px]">
      <div
        className="text-xs font-bold mb-1.5 px-2 py-1 rounded-t flex items-center gap-2"
        style={{ backgroundColor: team.color + '40' }}
      >
        <span
          className="w-2 h-2 rounded-full inline-block"
          style={{ backgroundColor: team.color }}
        />
        <span className="text-white">
          {side === 'away' ? '▲' : '▼'} {team.name}
        </span>
        {isAttacking && (
          <span className="text-yellow-400 text-[10px] ml-auto">攻撃中</span>
        )}
      </div>
      <div className="flex flex-col">
        {lineup.map((player, idx) => {
          if (!player.name) return null
          const isCurrent = isAttacking && idx === currentIdx
          return (
            <div
              key={player.order}
              className={`flex items-center gap-1.5 text-xs px-2 py-[3px] ${
                isCurrent
                  ? 'bg-yellow-400/20 text-white font-bold'
                  : 'text-gray-300'
              }`}
            >
              {/* 打者ランプ */}
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                isCurrent
                  ? 'bg-yellow-400 shadow-[0_0_6px_2px_rgba(250,204,21,0.7)] batter-lamp'
                  : 'bg-gray-700'
              }`} />
              <span className="w-3 text-center text-gray-500 text-[10px]">
                {player.order}
              </span>
              <span className="w-5 text-center text-yellow-400/80 font-mono text-[10px]">
                {player.position}
              </span>
              <span className="flex-1 truncate">{player.name}</span>
              <span className="text-gray-500 text-[10px]">#{player.number}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function LineupCard() {
  const awayTeam = useGameStore((s) => s.awayTeam)
  const homeTeam = useGameStore((s) => s.homeTeam)
  const awayLineup = useGameStore((s) => s.awayLineup)
  const homeLineup = useGameStore((s) => s.homeLineup)
  const currentHalf = useGameStore((s) => s.currentHalf)
  const awayBatterIndex = useGameStore((s) => s.awayBatterIndex)
  const homeBatterIndex = useGameStore((s) => s.homeBatterIndex)

  const hasAway = awayLineup.some((p) => p.name.length > 0)
  const hasHome = homeLineup.some((p) => p.name.length > 0)
  if (!hasAway && !hasHome) return null

  return (
    <div className="bg-black/85 backdrop-blur-sm rounded-lg px-3 py-2 text-white flex gap-3">
      <TeamLineup
        team={awayTeam}
        lineup={awayLineup}
        currentIdx={awayBatterIndex}
        isAttacking={currentHalf === 'top'}
        side="away"
      />
      <div className="w-px bg-gray-600" />
      <TeamLineup
        team={homeTeam}
        lineup={homeLineup}
        currentIdx={homeBatterIndex}
        isAttacking={currentHalf === 'bottom'}
        side="home"
      />
    </div>
  )
}
