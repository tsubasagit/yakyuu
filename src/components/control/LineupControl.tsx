import { useRef, useState } from 'react'
import { useGameStore } from '../../store/useGameStore'
import type { LineupPlayer, Position } from '../../types'
import { ORIX_LINEUP, HAWKS_LINEUP } from '../../types'
import { parseLineupCsv } from '../../lib/csvImport'

const POSITIONS: Position[] = ['投', '捕', '一', '二', '三', '遊', '左', '中', '右', 'DH']

function BatterRow({
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
        className="bg-gray-700 text-white rounded px-1 py-1 text-xs w-12 shrink-0"
        placeholder="打率"
        value={player.battingAvg || ''}
        onChange={(e) => onChange({ ...player, battingAvg: e.target.value })}
      />
      <input
        className="bg-gray-700 text-white rounded px-1 py-1 text-xs w-10 shrink-0"
        placeholder="HR"
        value={player.homeRuns || ''}
        onChange={(e) => onChange({ ...player, homeRuns: e.target.value })}
      />
      <input
        className="bg-gray-700 text-white rounded px-1 py-1 text-xs w-10 shrink-0"
        placeholder="打点"
        value={player.rbi || ''}
        onChange={(e) => onChange({ ...player, rbi: e.target.value })}
      />
      <input
        className="bg-gray-700 text-white rounded px-1 py-1 text-xs w-14 shrink-0"
        placeholder="OPS"
        value={player.ops || ''}
        onChange={(e) => onChange({ ...player, ops: e.target.value })}
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

function PitcherRow({
  player,
  onSelect,
  onChange,
}: {
  player: LineupPlayer
  onSelect: () => void
  onChange: (p: LineupPlayer) => void
}) {
  return (
    <div className="flex items-center gap-1.5 text-sm rounded px-1.5 py-1 bg-red-900/20 border border-red-800/30">
      <span className="text-red-400 w-4 text-center text-xs shrink-0 font-bold">
        P
      </span>
      <span className="text-red-400 text-xs w-12 shrink-0 text-center font-bold">
        投
      </span>
      <input
        className="bg-gray-700 text-white rounded px-2 py-1 text-xs flex-1 min-w-0"
        placeholder="投手名"
        value={player.name}
        onChange={(e) => onChange({ ...player, name: e.target.value })}
      />
      <input
        className="bg-gray-700 text-white rounded px-1 py-1 text-xs w-10 shrink-0"
        placeholder="登板"
        value={player.appearances || ''}
        onChange={(e) => onChange({ ...player, appearances: e.target.value })}
      />
      <input
        className="bg-gray-700 text-white rounded px-1 py-1 text-xs w-20 shrink-0"
        placeholder="勝敗"
        value={player.record || ''}
        onChange={(e) => onChange({ ...player, record: e.target.value })}
      />
      <button
        onClick={onSelect}
        className="text-xs px-2 py-1 rounded shrink-0 bg-red-700 hover:bg-red-600 text-white font-bold"
        title="この投手を登板"
      >
        登板
      </button>
    </div>
  )
}

export default function LineupControl() {
  const [activeTeam, setActiveTeam] = useState<'away' | 'home'>('away')
  const [csvError, setCsvError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
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

  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCsvError(null)
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const players = parseLineupCsv(reader.result as string)
        setLineup(activeTeam, players)
        setCsvError(null)
      } catch (err) {
        setCsvError(err instanceof Error ? err.message : 'CSV読み込みに失敗しました')
      }
    }
    reader.readAsText(file)
    // 同じファイルを再選択できるようにリセット
    e.target.value = ''
  }

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

      {/* CSV インポート / プリセット */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleCsvImport}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-bold"
          >
            CSV読込
          </button>
          <a
            href="./samples/template.csv"
            download="template.csv"
            className="text-blue-400 hover:text-blue-300 text-xs underline"
          >
            テンプレート
          </a>
          <span className="text-gray-600 text-xs">|</span>
          <span className="text-gray-500 text-xs">サンプル:</span>
          <a
            href="./samples/orix.csv"
            download="orix.csv"
            className="text-gray-400 hover:text-gray-300 text-xs underline"
          >
            オリックス
          </a>
          <a
            href="./samples/softbank.csv"
            download="softbank.csv"
            className="text-gray-400 hover:text-gray-300 text-xs underline"
          >
            ソフトバンク
          </a>
        </div>
        {/* プリセット（従来互換） */}
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
        {csvError && (
          <div className="bg-red-900/50 border border-red-500 rounded px-3 py-1.5 text-red-300 text-xs">
            {csvError}
          </div>
        )}
      </div>

      {/* ラインナップ（1-9番打者） */}
      <div className="space-y-0.5">
        {lineup.slice(0, 9).map((player, idx) => (
          <BatterRow
            key={player.order}
            player={player}
            isCurrent={idx === batterIdx && isAttacking}
            onSelect={() => selectBatter(activeTeam, idx)}
            onChange={(p) => setLineupPlayer(activeTeam, idx, p)}
          />
        ))}
      </div>

      {/* 投手（10番目） */}
      {lineup[9] && (
        <PitcherRow
          player={lineup[9]}
          onSelect={() => selectBatter(activeTeam, 9)}
          onChange={(p) => setLineupPlayer(activeTeam, 9, p)}
        />
      )}
    </div>
  )
}
