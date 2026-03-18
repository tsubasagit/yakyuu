import { useGameStore } from '../../store/useGameStore'

const EFFECT_CONFIG: Record<string, { label: string; color: string; emoji: string }> = {
  homerun: { label: 'HOME RUN!', color: 'text-yellow-400', emoji: '💥' },
  strikeout: { label: '三振!', color: 'text-red-400', emoji: '🔥' },
  double: { label: '二塁打!', color: 'text-green-400', emoji: '⚡' },
  triple: { label: '三塁打!', color: 'text-blue-400', emoji: '⚡' },
  hit: { label: 'ヒット!', color: 'text-green-400', emoji: '🏏' },
  steal: { label: '盗塁成功!', color: 'text-cyan-400', emoji: '💨' },
  fineplay: { label: 'ファインプレー!', color: 'text-purple-400', emoji: '👏' },
  error: { label: 'エラー!', color: 'text-orange-400', emoji: '💫' },
  walk: { label: 'フォアボール', color: 'text-green-400', emoji: '🚶' },
}

function ChangeOverlay({ timestamp }: { timestamp: number }) {
  const awayTeam = useGameStore((s) => s.awayTeam)
  const homeTeam = useGameStore((s) => s.homeTeam)
  const currentHalf = useGameStore((s) => s.currentHalf)

  const attackTeam = currentHalf === 'top' ? awayTeam : homeTeam
  const defenseTeam = currentHalf === 'top' ? homeTeam : awayTeam

  return (
    <div
      key={timestamp}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div className="w-full change-slide">
        <div
          className="w-full py-6 flex items-center justify-center gap-8"
          style={{
            background: `linear-gradient(90deg, ${defenseTeam.color}dd, ${attackTeam.color}dd)`,
          }}
        >
          <span className="text-4xl">🔄</span>
          <span className="text-4xl font-black text-white tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            チェンジ!
          </span>
          <span className="text-4xl">🔄</span>
        </div>
      </div>
    </div>
  )
}

export default function EffectOverlay() {
  const activeEffect = useGameStore((s) => s.activeEffect)
  const effectTimestamp = useGameStore((s) => s.effectTimestamp)

  if (!activeEffect) return null

  if (activeEffect === 'change') {
    return <ChangeOverlay timestamp={effectTimestamp} />
  }

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
