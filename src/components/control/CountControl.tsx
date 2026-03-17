import { useGameStore } from '../../store/useGameStore'

export default function CountControl() {
  const count = useGameStore((s) => s.count)
  const addBall = useGameStore((s) => s.addBall)
  const addStrike = useGameStore((s) => s.addStrike)
  const addOut = useGameStore((s) => s.addOut)
  const resetCount = useGameStore((s) => s.resetCount)
  const subtractBall = useGameStore((s) => s.subtractBall)
  const subtractStrike = useGameStore((s) => s.subtractStrike)
  const subtractOut = useGameStore((s) => s.subtractOut)
  const pitchCount = useGameStore((s) => s.pitchCount)
  const setPitchCount = useGameStore((s) => s.setPitchCount)

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <h2 className="text-white font-bold text-lg">カウント</h2>

      <div className="grid grid-cols-3 gap-3">
        {/* ボール */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-green-400 font-bold text-sm">B</span>
            <span className="text-white font-mono text-2xl font-bold">
              {count.balls}
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={subtractBall}
              disabled={count.balls <= 0}
              className="flex-1 bg-green-900 hover:bg-green-800 disabled:opacity-30 text-white px-2 py-2 rounded text-sm font-bold"
            >
              -1
            </button>
            <button
              onClick={addBall}
              className="flex-1 bg-green-700 hover:bg-green-600 text-white px-2 py-2 rounded text-sm font-bold"
            >
              +1
            </button>
          </div>
        </div>

        {/* ストライク */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-bold text-sm">S</span>
            <span className="text-white font-mono text-2xl font-bold">
              {count.strikes}
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={subtractStrike}
              disabled={count.strikes <= 0}
              className="flex-1 bg-yellow-900 hover:bg-yellow-800 disabled:opacity-30 text-white px-2 py-2 rounded text-sm font-bold"
            >
              -1
            </button>
            <button
              onClick={addStrike}
              className="flex-1 bg-yellow-700 hover:bg-yellow-600 text-white px-2 py-2 rounded text-sm font-bold"
            >
              +1
            </button>
          </div>
        </div>

        {/* アウト */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-bold text-sm">O</span>
            <span className="text-white font-mono text-2xl font-bold">
              {count.outs}
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={subtractOut}
              disabled={count.outs <= 0}
              className="flex-1 bg-red-900 hover:bg-red-800 disabled:opacity-30 text-white px-2 py-2 rounded text-sm font-bold"
            >
              -1
            </button>
            <button
              onClick={addOut}
              className="flex-1 bg-red-700 hover:bg-red-600 text-white px-2 py-2 rounded text-sm font-bold"
            >
              +1
            </button>
          </div>
        </div>
      </div>

      {/* 球数 */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-700">
        <span className="text-gray-400 text-sm">投球数</span>
        <span className="text-white font-mono text-xl font-bold">{pitchCount}</span>
        <button
          onClick={() => setPitchCount(Math.max(0, pitchCount - 1))}
          className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
        >
          -1
        </button>
        <button
          onClick={() => setPitchCount(pitchCount + 1)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
        >
          +1
        </button>
        <button
          onClick={() => setPitchCount(0)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
        >
          リセット
        </button>
      </div>

      {/* プリセット */}
      <div className="flex gap-2 pt-2 border-t border-gray-700">
        <button
          onClick={() => {
            addStrike()
            addStrike()
            addStrike()
          }}
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-xs font-bold"
        >
          三振
        </button>
        <button
          onClick={() => {
            addBall()
            addBall()
            addBall()
            addBall()
          }}
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-xs font-bold"
        >
          四球
        </button>
        <button
          onClick={resetCount}
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-xs font-bold"
        >
          カウントリセット
        </button>
      </div>
    </div>
  )
}
