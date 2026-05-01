import { useGameStore } from '../../store/useGameStore'
import { OVERLAY_VISIBILITY_IDS, type OverlayVisibilityId } from '../../types'

const LABELS: Record<OverlayVisibilityId, string> = {
  scoreboard: 'スコアボード',
  timer: '経過時間',
  lineup: '打順',
  playerInfo: '選手情報',
  playLog: '経過ログ',
  ticker: '速報テロップ',
}

export default function VisibilityControl() {
  const visibility = useGameStore((s) => s.overlayVisibility)
  const setOverlayVisibility = useGameStore((s) => s.setOverlayVisibility)
  const resetOverlayVisibility = useGameStore((s) => s.resetOverlayVisibility)

  const isOn = (id: string) => visibility?.[id] !== false

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-lg">表示切替</h2>
        <button
          onClick={resetOverlayVisibility}
          className="text-gray-400 hover:text-white text-xs underline"
        >
          全て表示
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {OVERLAY_VISIBILITY_IDS.map((id) => {
          const on = isOn(id)
          return (
            <button
              key={id}
              onClick={() => setOverlayVisibility(id, !on)}
              className={`flex items-center justify-between px-3 py-2 rounded text-sm font-bold ${
                on
                  ? 'bg-green-600 hover:bg-green-500 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-400'
              }`}
            >
              <span>{LABELS[id]}</span>
              <span className="text-xs">{on ? 'ON' : 'OFF'}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
