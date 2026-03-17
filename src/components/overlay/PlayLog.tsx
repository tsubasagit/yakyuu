import { useGameStore } from '../../store/useGameStore'

export default function PlayLog() {
  const playLog = useGameStore((s) => s.playLog)

  if (playLog.length === 0) return null

  const display = playLog.slice(0, 8)

  return (
    <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-3 text-white text-xs max-w-[260px]">
      <div className="text-accent font-bold text-xs mb-2">経過</div>
      <div className="flex flex-col gap-1">
        {display.map((entry) => (
          <div key={entry.id} className="flex gap-2">
            <span className="text-gray-400 shrink-0">
              {entry.inning}回{entry.half === 'top' ? '表' : '裏'}
            </span>
            <span className="truncate">{entry.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
