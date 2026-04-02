import { useGameStore } from '../../store/useGameStore'
import type { PlayerInfo } from '../../types'
import { formatBatterStat } from '../../types'

export default function LineupCard() {
  const awayTeam = useGameStore((s) => s.awayTeam)
  const homeTeam = useGameStore((s) => s.homeTeam)
  const awayLineup = useGameStore((s) => s.awayLineup)
  const homeLineup = useGameStore((s) => s.homeLineup)
  const currentHalf = useGameStore((s) => s.currentHalf)
  const awayBatterIndex = useGameStore((s) => s.awayBatterIndex)
  const homeBatterIndex = useGameStore((s) => s.homeBatterIndex)
  const pitcher = useGameStore((s) => s.pitcher)
  const pitchCount = useGameStore((s) => s.pitchCount)
  // コントロールパネルで選択中のチームに連動
  const displayTeam = useGameStore((s) => s.lineupDisplayTeam ?? (currentHalf === 'top' ? 'away' : 'home'))

  const side = displayTeam
  const team = side === 'away' ? awayTeam : homeTeam
  const lineup = side === 'away' ? awayLineup : homeLineup
  const currentIdx = side === 'away' ? awayBatterIndex : homeBatterIndex
  const isAttacking = (side === 'away' && currentHalf === 'top') ||
    (side === 'home' && currentHalf === 'bottom')

  const batters = lineup.slice(0, 9)
  const hasPlayers = batters.some((p) => p.name.length > 0)
  if (!hasPlayers) return null

  return (
    <div className="bg-black/85 backdrop-blur-sm rounded-lg px-3 py-2 text-white min-w-[240px]">
      {/* チームヘッダー */}
      <div
        className="text-xs font-bold mb-1.5 px-2 py-1 rounded flex items-center gap-2"
        style={{ backgroundColor: team.color + '40' }}
      >
        <span
          className="w-2 h-2 rounded-full inline-block"
          style={{ backgroundColor: team.color }}
        />
        <span className="text-white">
          {side === 'away' ? '▲' : '▼'} {team.name}
        </span>
        {isAttacking && <span className="text-yellow-400 text-[10px] ml-auto">攻撃中</span>}
        {!isAttacking && <span className="text-gray-500 text-[10px] ml-auto">守備中</span>}
      </div>

      {/* 打順（1-9番のみ） */}
      <div className="flex flex-col">
        {batters.map((player, idx) => {
          if (!player.name) return null
          const isCurrent = idx === currentIdx
          const statStr = formatBatterStat(player)
          return (
            <div
              key={player.order}
              className={`flex items-center gap-1.5 text-xs px-2 py-[3px] ${
                isCurrent
                  ? 'bg-yellow-400/20 text-white font-bold'
                  : 'text-gray-300'
              }`}
            >
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
              {statStr && (
                <span className="text-yellow-400/70 font-mono text-[10px] shrink-0">
                  {statStr}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* 投手情報 */}
      <PitcherBar pitcher={pitcher} pitchCount={pitchCount} />
    </div>
  )
}

function PitcherBar({ pitcher, pitchCount }: { pitcher: PlayerInfo; pitchCount: number }) {
  if (!pitcher.name) return null

  return (
    <div className="mt-2 pt-1.5 border-t border-gray-600/50 px-2 flex items-center gap-2 text-xs">
      <span className="text-red-400 font-bold text-[10px]">投手</span>
      <span className="font-bold text-white">{pitcher.name}</span>
      {pitcher.statLabel && (
        <span className="text-yellow-400/70 text-[10px]">
          {pitcher.statLabel}
        </span>
      )}
      {pitcher.stat && (
        <span className="text-yellow-400/70 text-[10px]">
          {pitcher.stat}
        </span>
      )}
      <span className="text-gray-400 text-[10px] ml-auto">{pitchCount}球</span>
    </div>
  )
}
