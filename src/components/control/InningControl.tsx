import { useGameStore } from '../../store/useGameStore'

export default function InningControl() {
  const currentInning = useGameStore((s) => s.currentInning)
  const currentHalf = useGameStore((s) => s.currentHalf)
  const advanceInning = useGameStore((s) => s.advanceInning)
  const rewindInning = useGameStore((s) => s.rewindInning)

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <h2 className="text-white font-bold text-lg">イニング</h2>

      <div className="flex items-center gap-4">
        <button
          onClick={rewindInning}
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm font-bold"
          disabled={currentInning <= 1 && currentHalf === 'top'}
        >
          ← 戻す
        </button>
        <div className="bg-gray-700 rounded px-4 py-2 text-white font-mono text-xl font-bold">
          {currentInning}回{currentHalf === 'top' ? '表' : '裏'}
        </div>
        <button
          onClick={advanceInning}
          className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded text-sm font-bold"
        >
          次へ →
        </button>
      </div>
    </div>
  )
}
