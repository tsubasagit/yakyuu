import { useState } from 'react'
import { useGameStore } from '../../store/useGameStore'
import type { LineupPlayer, Position } from '../../types'
import { ORIX_LINEUP, HAWKS_LINEUP } from '../../types'

const POSITIONS: Position[] = ['投', '捕', '一', '二', '三', '遊', '左', '中', '右', 'DH']

function LineupRow({
  player,
  isCurrent,
  onSelect,
  onChange,
}: {
  player: LineupPlayer
  isCurrent: boolean
  onSelect: () => void
  onChange: (p: LineupPlayer) => void
}) {
  return (
    <div
      className={`flex items-center gap-1.5 text-sm rounded px-1.5 py-1 ${
        isCurrent ? 'bg-accent/30 ring-1 ring-accent' : ''
      }`}
    >
      <span className="text-gray-500 w-4 text-center text-xs shrink-0">
        {player.order}
      </span>
      <select
        className="bg-gray-700 text-white rounded px-1 py-1 text-xs w-12 shrink-0"
        value={player.position}
        onChange={(e) => onChange({ ...player, position: e.target.value as Position })}
      >
        <option value="">--</option>
        {POSITIONS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <input
        className="bg-gray-700 text-white rounded px-2 py-1 text-xs flex-1 min-w-0"
        placeholder="名前"
        value={player.name}
        onChange={(e) => onChange({ ...player, name: e.target.value })}
      />
      <input
        className="bg-gray-700 text-white rounded px-1 py-1 text-xs w-10 shrink-0"
        placeholder="#"
        value={player.number}
        onChange={(e) => onChange({ ...player, number: e.target.value })}
      />
      <input
        className="bg-gray-700 text-white rounded px-1 py-1 text-xs w-14 shrink-0"
        placeholder="打率"
        value={player.battingAvg}
        onChange={(e) => onChange({ ...player, battingAvg: e.target.value })}
      />
      <button
        onClick={onSelect}
        className={`text-xs px-2 py-1 rounded shrink-0 ${
          isCurrent
            ? 'bg-accent text-white font-bold'
            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
        }`}
        title="この打者を選択"
      >
        打席
      </button>
    </div>
  )
}

export default function LineupControl() {
  const [activeTeam, setActiveTeam] = useState<'away' | 'home'>('away')
  const awayTeam = useGameStore((s) => s.awayTeam)
  const homeTeam = useGameStore((s) => s.homeTeam)
  const awayLineup = useGameStore((s) => s.awayLineup)
  const homeLineup = useGameStore((s) => s.homeLineup)
  const awayBatterIndex = useGameStore((s) => s.awayBatterIndex)
  const homeBatterIndex = useGameStore((s) => s.homeBatterIndex)
  const currentHalf = useGameStore((s) => s.currentHalf)
  const setLineupPlayer = useGameStore((s) => s.setLineupPlayer)
  const setLineup = useGameStore((s) => s.setLineup)
  const selectBatter = useGameStore((s) => s.selectBatter)
  const nextBatter = useGameStore((s) => s.nextBatter)

  const lineup = activeTeam === 'away' ? awayLineup : homeLineup
  const batterIdx = activeTeam === 'away' ? awayBatterIndex : homeBatterIndex
  const isAttacking = (activeTeam === 'away' && currentHalf === 'top') ||
    (activeTeam === 'home' && currentHalf === 'bottom')

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-lg">打順・選手</h2>
        <button
          onClick={nextBatter}
          className="bg-accent hover:bg-accent/80 text-white px-3 py-1.5 rounded text-xs font-bold"
        >
          次の打者 →
        </button>
      </div>

      {/* チーム切替タブ */}
      <div className="flex gap-1">
        <button
          onClick={() => setActiveTeam('away')}
          className={`px-3 py-1.5 rounded text-sm font-bold ${
            activeTeam === 'away'
              ? 'bg-accent text-white'
              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
          }`}
        >
          {awayTeam.shortName}（先攻）
        </button>
        <button
          onClick={() => setActiveTeam('home')}
          className={`px-3 py-1.5 rounded text-sm font-bold ${
            activeTeam === 'home'
              ? 'bg-accent text-white'
              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
          }`}
        >
          {homeTeam.shortName}（後攻）
        </button>
        {isAttacking && (
          <span className="text-yellow-400 text-xs flex items-center ml-2">攻撃中</span>
        )}
      </div>

      {/* プリセット */}
      <div className="flex gap-2">
        <button
          onClick={() => setLineup('away', [...ORIX_LINEUP])}
          className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs"
        >
          オリックス読込
        </button>
        <button
          onClick={() => setLineup('home', [...HAWKS_LINEUP])}
          className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs"
        >
          ソフトバンク読込
        </button>
      </div>

      {/* ラインナップ */}
      <div className="space-y-0.5">
        {lineup.map((player, idx) => (
          <LineupRow
            key={player.order}
            player={player}
            isCurrent={idx === batterIdx && isAttacking}
            onSelect={() => selectBatter(activeTeam, idx)}
            onChange={(p) => setLineupPlayer(activeTeam, idx, p)}
          />
        ))}
      </div>
    </div>
  )
}
