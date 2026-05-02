import { useGameStore } from '../../store/useGameStore'
import type { PlayerInfo } from '../../types'

export default function LineupCard({ side: sideProp }: { side?: 'away' | 'home' } = {}) {
  const awayTeam = useGameStore((s) => s.awayTeam)
  const homeTeam = useGameStore((s) => s.homeTeam)
  const awayLineup = useGameStore((s) => s.awayLineup)
  const homeLineup = useGameStore((s) => s.homeLineup)
  const currentHalf = useGameStore((s) => s.currentHalf)
  const awayBatterIndex = useGameStore((s) => s.awayBatterIndex)
  const homeBatterIndex = useGameStore((s) => s.homeBatterIndex)
  const storePitcher = useGameStore((s) => s.pitcher)
  const awayPitcherHistory = useGameStore((s) => s.awayPitcherHistory)
  const homePitcherHistory = useGameStore((s) => s.homePitcherHistory)
  const awayPitchCount = useGameStore((s) => s.awayPitchCount)
  const homePitchCount = useGameStore((s) => s.homePitchCount)
  const colVis = useGameStore((s) => s.lineupColumnVisibility)
  const showNumber = colVis?.number ?? true
  const showAvg = colVis?.battingAvg ?? true
  const showHR = colVis?.homeRuns ?? true
  const showRBI = colVis?.rbi ?? true
  const showOPS = colVis?.ops ?? true
  // コントロールパネルで選択中のチームに連動（両チーム表示モード時は props で上書き）
  const displayTeam = useGameStore((s) => s.lineupDisplayTeam ?? (currentHalf === 'top' ? 'away' : 'home'))

  const side = sideProp ?? displayTeam
  const team = side === 'away' ? awayTeam : homeTeam
  const lineup = side === 'away' ? awayLineup : homeLineup
  const currentIdx = side === 'away' ? awayBatterIndex : homeBatterIndex
  const isAttacking = (side === 'away' && currentHalf === 'top') ||
    (side === 'home' && currentHalf === 'bottom')

  // 表示対象チームに対する相手投手（自分が攻撃なら相手が投球中）
  const opposingHistory = side === 'away' ? homePitcherHistory : awayPitcherHistory
  const opposingActive = opposingHistory.find((p) => p.isActive)
  const opposingPitchCount = side === 'away' ? homePitchCount : awayPitchCount
  // 履歴に active pitcher がいればそれを使い、無ければ現攻撃時のみ store.pitcher を採用
  const pitcher: PlayerInfo = opposingActive
    ? {
        name: opposingActive.name,
        number: opposingActive.number,
        stat: opposingActive.record,
        statLabel: opposingActive.appearances ? `${opposingActive.appearances}登板` : '',
      }
    : (isAttacking ? storePitcher : { name: '', number: '', stat: '', statLabel: '' })
  const pitchCount = opposingActive ? opposingActive.pitchCount : (isAttacking ? opposingPitchCount : 0)

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
              {showNumber && player.number && (
                <span className="text-gray-400 font-mono text-[10px] shrink-0">
                  #{player.number}
                </span>
              )}
              <span className="flex-1 truncate">{player.name}</span>
              {showAvg && player.battingAvg && (
                <span className="text-yellow-400/70 font-mono text-[10px] shrink-0">
                  {player.battingAvg}
                </span>
              )}
              {showHR && player.homeRuns && (
                <span className="text-yellow-400/70 font-mono text-[10px] shrink-0">
                  {player.homeRuns}本
                </span>
              )}
              {showRBI && player.rbi && (
                <span className="text-yellow-400/70 font-mono text-[10px] shrink-0">
                  {player.rbi}打点
                </span>
              )}
              {showOPS && player.ops && (
                <span className="text-yellow-400/70 font-mono text-[10px] shrink-0">
                  OPS{player.ops}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* 相手投手情報 */}
      <PitcherBar
        pitcher={pitcher}
        pitchCount={pitchCount}
        teamName={side === 'away' ? homeTeam.shortName : awayTeam.shortName}
        teamColor={side === 'away' ? homeTeam.color : awayTeam.color}
      />
    </div>
  )
}

function PitcherBar({ pitcher, pitchCount, teamName, teamColor }: {
  pitcher: PlayerInfo; pitchCount: number; teamName: string; teamColor: string
}) {
  if (!pitcher.name) return null

  return (
    <div className="mt-3 pt-2 border-t border-gray-600/50">
      {/* 相手チーム名ヘッダー */}
      <div
        className="text-[10px] font-bold mb-1 px-2 py-0.5 rounded flex items-center gap-1.5"
        style={{ backgroundColor: teamColor + '30' }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full inline-block"
          style={{ backgroundColor: teamColor }}
        />
        <span className="text-gray-300">{teamName}</span>
        <span className="text-red-400">投手</span>
      </div>
      <div className="px-2 flex items-center gap-2 text-xs">
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
    </div>
  )
}
