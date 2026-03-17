import { useGameStore } from '../../store/useGameStore'

export default function RunnerDiamond() {
  const runners = useGameStore((s) => s.runners)

  const baseColor = (on: boolean) =>
    on ? 'fill-yellow-400 stroke-yellow-500' : 'fill-gray-700 stroke-gray-500'

  return (
    <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3">
      <svg viewBox="0 0 80 80" className="w-20 h-20">
        {/* 二塁 */}
        <rect
          x="32"
          y="5"
          width="16"
          height="16"
          rx="2"
          transform="rotate(45 40 13)"
          className={baseColor(runners.second)}
          strokeWidth="1.5"
        />
        {/* 三塁 */}
        <rect
          x="10"
          y="27"
          width="16"
          height="16"
          rx="2"
          transform="rotate(45 18 35)"
          className={baseColor(runners.third)}
          strokeWidth="1.5"
        />
        {/* 一塁 */}
        <rect
          x="54"
          y="27"
          width="16"
          height="16"
          rx="2"
          transform="rotate(45 62 35)"
          className={baseColor(runners.first)}
          strokeWidth="1.5"
        />
        {/* ホーム */}
        <rect
          x="32"
          y="49"
          width="16"
          height="16"
          rx="2"
          transform="rotate(45 40 57)"
          className="fill-white/20 stroke-gray-500"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  )
}
