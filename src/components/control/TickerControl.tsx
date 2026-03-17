import { useState } from 'react'
import { useGameStore } from '../../store/useGameStore'

export default function TickerControl() {
  const ticker = useGameStore((s) => s.ticker)
  const setTicker = useGameStore((s) => s.setTicker)
  const [text, setText] = useState(ticker)

  const apply = () => setTicker(text)
  const clear = () => {
    setText('')
    setTicker('')
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <h2 className="text-white font-bold text-lg">速報テロップ</h2>
      <input
        className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
        placeholder="テロップテキストを入力..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && apply()}
      />
      <div className="flex gap-2">
        <button
          onClick={apply}
          className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded text-sm font-bold"
        >
          表示
        </button>
        <button
          onClick={clear}
          className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm font-bold"
        >
          クリア
        </button>
      </div>
      {ticker && (
        <div className="text-gray-400 text-xs truncate">
          表示中: {ticker}
        </div>
      )}
    </div>
  )
}
