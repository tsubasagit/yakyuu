import { useGameStore } from '../../store/useGameStore'

export default function WaitingScreen() {
  const showWaitingScreen = useGameStore((s) => s.showWaitingScreen)
  const awayTeam = useGameStore((s) => s.awayTeam)
  const homeTeam = useGameStore((s) => s.homeTeam)
  const mascotImages = useGameStore((s) => s.mascotImages)

  if (!showWaitingScreen) return null

  const mascotSrc = mascotImages['waiting']
    ?? (import.meta.env.BASE_URL + 'mascot/mascot-waiting.png')

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50">
      <div className="bg-black/70 backdrop-blur-sm rounded-2xl px-16 py-12 flex flex-col items-center gap-6">
        <img
          src={mascotSrc}
          alt="マスコット"
          className="h-[200px] w-auto mascot-float drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none'
          }}
        />
        <div className="text-3xl font-bold text-white waiting-pulse">
          まもなく試合開始
        </div>
        <div className="flex items-center gap-4 text-2xl font-bold">
          <span style={{ color: awayTeam.color }}>{awayTeam.name}</span>
          <span className="text-gray-400">vs</span>
          <span style={{ color: homeTeam.color }}>{homeTeam.name}</span>
        </div>
      </div>
    </div>
  )
}
