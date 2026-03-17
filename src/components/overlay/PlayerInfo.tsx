import { useGameStore } from '../../store/useGameStore'

export default function PlayerInfo() {
  const batter = useGameStore((s) => s.batter)
  const pitcher = useGameStore((s) => s.pitcher)
  const pitchCount = useGameStore((s) => s.pitchCount)

  const hasBatter = batter.name.length > 0
  const hasPitcher = pitcher.name.length > 0

  if (!hasBatter && !hasPitcher) return null

  return (
    <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm flex gap-6">
      {hasBatter && (
        <div className="flex items-center gap-2">
          <span className="text-accent font-bold text-xs">打者</span>
          <span className="font-bold">{batter.name}</span>
          {batter.stat && (
            <span className="text-yellow-400 text-xs">
              {batter.statLabel ? `${batter.statLabel} ` : ''}{batter.stat}
            </span>
          )}
        </div>
      )}
      {hasPitcher && (
        <div className="flex items-center gap-2">
          <span className="text-red-400 font-bold text-xs">投手</span>
          <span className="font-bold">{pitcher.name}</span>
          {pitcher.statLabel && (
            <span className="text-yellow-400 text-xs">
              {pitcher.statLabel}
            </span>
          )}
          {pitcher.stat && (
            <span className="text-yellow-400 text-xs">
              {pitcher.stat}
            </span>
          )}
          <span className="text-gray-300 text-xs ml-1">
            {pitchCount}球
          </span>
        </div>
      )}
    </div>
  )
}
