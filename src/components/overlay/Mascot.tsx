import { useGameStore } from '../../store/useGameStore'

const DEFAULT_IMAGES: Record<string, string> = {
  idle: import.meta.env.BASE_URL + 'mascot/mascot-idle.png',
  celebration: import.meta.env.BASE_URL + 'mascot/mascot-celebration.png',
  waiting: import.meta.env.BASE_URL + 'mascot/mascot-waiting.png',
}

export default function Mascot() {
  const showMascot = useGameStore((s) => s.showMascot)
  const mascotMode = useGameStore((s) => s.mascotMode)
  const mascotImages = useGameStore((s) => s.mascotImages)

  if (!showMascot || mascotMode === 'hidden') return null

  const src = mascotImages[mascotMode] ?? DEFAULT_IMAGES[mascotMode] ?? DEFAULT_IMAGES.idle
  const animClass = mascotMode === 'celebration' ? 'mascot-celebration' : 'mascot-float'

  return (
    <div className={`pointer-events-none ${animClass}`}>
      <img
        src={src}
        alt="マスコット"
        className="h-[120px] w-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none'
        }}
      />
    </div>
  )
}
