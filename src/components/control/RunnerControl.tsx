import { useGameStore } from '../../store/useGameStore'

export default function RunnerControl() {
  const runners = useGameStore((s) => s.runners)
  const setRunner = useGameStore((s) => s.setRunner)

  const bases = [
    { key: 'first' as const, label: '一塁' },
    { key: 'second' as const, label: '二塁' },
    { key: 'third' as const, label: '三塁' },
  ]

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <h2 className="text-white font-bold text-lg">走者</h2>

      <div className="flex gap-3">
        {bases.map((base) => (
          <button
            key={base.key}
            onClick={() => setRunner(base.key, !runners[base.key])}
            className={`px-4 py-3 rounded text-sm font-bold transition-colors ${
              runners[base.key]
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            {base.label}
          </button>
        ))}
      </div>
    </div>
  )
}
