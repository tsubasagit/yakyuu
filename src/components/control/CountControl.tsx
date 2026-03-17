import { useGameStore } from '../../store/useGameStore'

export default function CountControl() {
  const count = useGameStore((s) => s.count)
  const addBall = useGameStore((s) => s.addBall)
  const addStrike = useGameStore((s) => s.addStrike)
  const addOut = useGameStore((s) => s.addOut)
  const resetCount = useGameStore((s) => s.resetCount)
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
          <button
            onClick={addBall}
            className="w-full bg-green-700 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-bold"
          >
            ボール +1
          </button>
        </div>

        {/* ストライク */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-bold text-sm">S</span>
            <span className="text-white font-mono text-2xl font-bold">
              {count.strikes}
            </span>
          </div>
          <button
            onClick={addStrike}
            className="w-full bg-yellow-700 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm font-bold"
          >
            ストライク +1
          </button>
        </div>

        {/* アウト */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-bold text-sm">O</span>
            <span className="text-white font-mono text-2xl font-bold">
              {count.outs}
            </span>
          </div>
          <button
            onClick={addOut}
            className="w-full bg-red-700 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-bold"
          >
            アウト +1
          </button>
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
