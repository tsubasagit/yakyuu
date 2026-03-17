import { useGameStore } from '../../store/useGameStore'

function Dots({
  label,
  count,
  max,
  activeColor,
}: {
  label: string
  count: number
  max: number
  activeColor: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400 font-bold text-xs w-3">{label}</span>
      <div className="flex gap-1">
        {Array.from({ length: max }, (_, i) => (
          <div
            key={i}
            className={`w-3.5 h-3.5 rounded-full border ${
              i < count
                ? `${activeColor} border-transparent`
                : 'bg-gray-700 border-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default function BSOCount() {
  const count = useGameStore((s) => s.count)

  return (
    <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-3 flex flex-col gap-1.5">
      <Dots label="B" count={count.balls} max={4} activeColor="bg-green-500" />
      <Dots
        label="S"
        count={count.strikes}
        max={3}
        activeColor="bg-yellow-400"
      />
      <Dots label="O" count={count.outs} max={3} activeColor="bg-red-500" />
    </div>
  )
}
