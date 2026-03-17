import { useEffect, useState } from 'react'
import { useGameStore } from '../../store/useGameStore'

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

export default function GameTimer() {
  const gameStartTime = useGameStore((s) => s.gameStartTime)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!gameStartTime) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [gameStartTime])

  if (!gameStartTime) return null

  const elapsed = now - gameStartTime

  return (
    <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm font-mono font-bold">
      {formatElapsed(elapsed)}
    </div>
  )
}
