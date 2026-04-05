import { useState, useEffect } from 'react'
import { useGameStore } from '../../store/useGameStore'
import type { PlayerInfo } from '../../types'

function PlayerForm({
  label,
  player,
  onApply,
}: {
  label: string
  player: PlayerInfo
  onApply: (info: PlayerInfo) => void
}) {
  const [name, setName] = useState(player.name)
  const [number, setNumber] = useState(player.number)
  const [stat, setStat] = useState(player.stat)
  const [statLabel, setStatLabel] = useState(player.statLabel)

  useEffect(() => {
    setName(player.name)
    setNumber(player.number)
    setStat(player.stat)
    setStatLabel(player.statLabel)
  }, [player.name, player.number, player.stat, player.statLabel])

  const apply = () => onApply({ name, number, stat, statLabel })

  return (
    <div className="space-y-2">
      <label className="text-gray-400 text-xs font-bold">{label}</label>
      <div className="grid grid-cols-4 gap-2">
        <input
          className="bg-gray-700 text-white rounded px-2 py-1.5 text-sm col-span-2"
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={apply}
        />
        <input
          className="bg-gray-700 text-white rounded px-2 py-1.5 text-sm"
          placeholder="背番号"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          onBlur={apply}
        />
        <button
          onClick={apply}
          className="bg-accent hover:bg-accent/80 text-white rounded text-sm font-bold"
        >
          反映
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <input
          className="bg-gray-700 text-white rounded px-2 py-1.5 text-sm col-span-1"
          placeholder="ラベル（例: 打率）"
          value={statLabel}
          onChange={(e) => setStatLabel(e.target.value)}
          onBlur={apply}
        />
        <input
          className="bg-gray-700 text-white rounded px-2 py-1.5 text-sm col-span-1"
          placeholder="値（例: .312）"
          value={stat}
          onChange={(e) => setStat(e.target.value)}
          onBlur={apply}
        />
      </div>
    </div>
  )
}

function PitchCountControl() {
  const currentHalf = useGameStore((s) => s.currentHalf)
  const awayPitchCount = useGameStore((s) => s.awayPitchCount)
  const homePitchCount = useGameStore((s) => s.homePitchCount)
  const setPitchCount = useGameStore((s) => s.setPitchCount)
  const pitchCount = currentHalf === 'top' ? homePitchCount : awayPitchCount

  return (
    <div className="flex items-center gap-2 pt-1">
      <span className="text-gray-400 text-xs">投球数</span>
      <span className="text-white font-mono text-lg font-bold">{pitchCount}</span>
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
        onClick={() => setPitchCount(pitchCount + 10)}
        className="bg-blue-700 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold"
      >
        +10
      </button>
      <button
        onClick={() => setPitchCount(0)}
        className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
      >
        リセット
      </button>
    </div>
  )
}

export default function PlayerControl() {
  const batter = useGameStore((s) => s.batter)
  const pitcher = useGameStore((s) => s.pitcher)
  const setBatter = useGameStore((s) => s.setBatter)
  const setPitcher = useGameStore((s) => s.setPitcher)

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <h2 className="text-white font-bold text-lg">選手情報</h2>
      <PlayerForm label="打者" player={batter} onApply={setBatter} />
      <PlayerForm label="投手" player={pitcher} onApply={setPitcher} />
      <PitchCountControl />
    </div>
  )
}
