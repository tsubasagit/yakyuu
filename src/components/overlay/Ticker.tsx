import { useGameStore } from '../../store/useGameStore'

export default function Ticker() {
  const ticker = useGameStore((s) => s.ticker)

  if (!ticker) return null

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/90 overflow-hidden h-8 flex items-center">
      <div className="ticker-scroll whitespace-nowrap text-white text-sm font-bold px-4">
        {ticker}
      </div>
    </div>
  )
}
