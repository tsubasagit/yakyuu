import { useGameStore } from '../../store/useGameStore'

const EFFECT_CONFIG: Record<string, { label: string; color: string; emoji: string }> = {
  homerun: { label: 'HOME RUN!', color: 'text-yellow-400', emoji: '💥' },
  strikeout: { label: '三振!', color: 'text-red-400', emoji: '🔥' },
  double: { label: '二塁打!', color: 'text-green-400', emoji: '⚡' },
  triple: { label: '三塁打!', color: 'text-blue-400', emoji: '⚡' },
}

export default function EffectOverlay() {
  const activeEffect = useGameStore((s) => s.activeEffect)
  const effectTimestamp = useGameStore((s) => s.effectTimestamp)

  if (!activeEffect) return null

  const config = EFFECT_CONFIG[activeEffect]
  if (!config) return null

  return (
    <div
      key={effectTimestamp}
      className="absolute inset-0 flex items-center justify-center pointer-events-none effect-animate"
    >
      <div className={`text-center ${config.color}`}>
        <div className="text-6xl mb-2">{config.emoji}</div>
        <div className="text-5xl font-black tracking-wider drop-shadow-[0_0_20px_currentColor]">
          {config.label}
        </div>
      </div>
    </div>
  )
}
