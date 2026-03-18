import { useGameStore } from '../../store/useGameStore'
import type { EffectType } from '../../types'

const BATTING_EFFECTS: { type: EffectType; label: string; color: string }[] = [
  { type: 'homerun', label: 'ホームラン', color: 'bg-yellow-600 hover:bg-yellow-500' },
  { type: 'triple', label: '三塁打', color: 'bg-blue-600 hover:bg-blue-500' },
  { type: 'double', label: '二塁打', color: 'bg-green-600 hover:bg-green-500' },
  { type: 'hit', label: 'ヒット', color: 'bg-green-700 hover:bg-green-600' },
  { type: 'walk', label: 'フォアボール', color: 'bg-teal-600 hover:bg-teal-500' },
  { type: 'strikeout', label: '三振', color: 'bg-red-600 hover:bg-red-500' },
]

const FIELD_EFFECTS: { type: EffectType; label: string; color: string }[] = [
  { type: 'steal', label: '盗塁成功', color: 'bg-cyan-600 hover:bg-cyan-500' },
  { type: 'fineplay', label: 'ファインプレー', color: 'bg-purple-600 hover:bg-purple-500' },
  { type: 'error', label: 'エラー', color: 'bg-orange-600 hover:bg-orange-500' },
  { type: 'change', label: 'チェンジ', color: 'bg-gray-500 hover:bg-gray-400' },
]

export default function EffectControl() {
  const activeEffect = useGameStore((s) => s.activeEffect)
  const triggerEffect = useGameStore((s) => s.triggerEffect)
  const autoChangeEffect = useGameStore((s) => s.autoChangeEffect)
  const setAutoChangeEffect = useGameStore((s) => s.setAutoChangeEffect)

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <h2 className="text-white font-bold text-lg">エフェクト</h2>

      <div className="space-y-1">
        <span className="text-gray-400 text-xs">打撃結果</span>
        <div className="grid grid-cols-3 gap-2">
          {BATTING_EFFECTS.map((e) => (
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
      </div>

      <div className="space-y-1">
        <span className="text-gray-400 text-xs">守備・走塁</span>
        <div className="grid grid-cols-2 gap-2">
          {FIELD_EFFECTS.map((e) => (
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
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-700">
        <span className="text-gray-400 text-xs">3アウト時 自動チェンジ演出</span>
        <button
          onClick={() => setAutoChangeEffect(!autoChangeEffect)}
          className={`px-3 py-1 rounded text-xs font-bold ${
            autoChangeEffect
              ? 'bg-green-600 text-white'
              : 'bg-gray-600 text-gray-300'
          }`}
        >
          {autoChangeEffect ? 'ON' : 'OFF'}
        </button>
      </div>

      {activeEffect && (
        <div className="text-yellow-400 text-xs text-center animate-pulse">
          エフェクト表示中...
        </div>
      )}
    </div>
  )
}
