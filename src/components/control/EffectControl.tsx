import { useGameStore } from '../../store/useGameStore'
import type { EffectType } from '../../types'

const EFFECTS: { type: EffectType; label: string; color: string }[] = [
  { type: 'homerun', label: 'ホームラン', color: 'bg-yellow-600 hover:bg-yellow-500' },
  { type: 'strikeout', label: '三振', color: 'bg-red-600 hover:bg-red-500' },
  { type: 'double', label: '二塁打', color: 'bg-green-600 hover:bg-green-500' },
  { type: 'triple', label: '三塁打', color: 'bg-blue-600 hover:bg-blue-500' },
]

export default function EffectControl() {
  const activeEffect = useGameStore((s) => s.activeEffect)
  const triggerEffect = useGameStore((s) => s.triggerEffect)

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <h2 className="text-white font-bold text-lg">エフェクト</h2>
      <div className="grid grid-cols-2 gap-2">
        {EFFECTS.map((e) => (
          <button
            key={e.type}
            onClick={() => triggerEffect(e.type)}
            disabled={!!activeEffect}
            className={`${e.color} text-white px-3 py-2 rounded text-sm font-bold disabled:opacity-50`}
          >
            {e.label}
          </button>
        ))}
      </div>
      {activeEffect && (
        <div className="text-yellow-400 text-xs text-center animate-pulse">
          エフェクト表示中...
        </div>
      )}
    </div>
  )
}
