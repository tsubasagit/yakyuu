import { useRef, useState } from 'react'
import { useGameStore } from '../../store/useGameStore'
import type { LineupPlayer, Position } from '../../types'
import { CARP_LINEUP, HAWKS_LINEUP, formatInningsPitched } from '../../types'
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
  side,
  onSelect,
  onChange,
}: {
  player: LineupPlayer
  side: 'away' | 'home'
  onSelect: () => void
  onChange: (p: LineupPlayer) => void
}) {
  const history = useGameStore(s =>
    side === 'away' ? s.awayPitcherHistory : s.homePitcherHistory
  )
  const setTeamPitchCount = useGameStore(s => s.setTeamPitchCount)
  const archived = history.filter(p => !p.isActive)
  const active = history.find(p => p.isActive)

  return (
    <div className="space-y-1">
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
      {/* 投手交代履歴 */}
      {(archived.length > 0 || active) && (
        <div className="text-[10px] text-gray-400 px-2 space-y-0.5">
          {archived.map((p, i) => (
            <div key={p.id} className="flex gap-2">
              <span className="text-gray-500">{i === 0 ? '先発' : `${i}番手`}</span>
              <span className="text-gray-300">{p.name}</span>
              <span>{formatInningsPitched(p.outsRecorded)}回</span>
              <span>{p.pitchCount}球</span>
            </div>
          ))}
          {active && (
            <div className="space-y-1">
              <div className="flex gap-2 text-green-400">
                <span>{archived.length === 0 ? '先発' : `${archived.length}番手`}</span>
                <span>{active.name}</span>
                <span>{formatInningsPitched(active.outsRecorded)}回</span>
                <span className="font-bold">{active.pitchCount}球</span>
                <span className="animate-pulse">登板中</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setTeamPitchCount(side, Math.max(0, active.pitchCount - 1))}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-1.5 py-0.5 rounded text-[10px]"
                >-1</button>
                <button
                  onClick={() => setTeamPitchCount(side, active.pitchCount + 1)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-1.5 py-0.5 rounded text-[10px]"
                >+1</button>
                <button
                  onClick={() => setTeamPitchCount(side, active.pitchCount + 10)}
                  className="bg-blue-700 hover:bg-blue-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold"
                >+10</button>
                <button
                  onClick={() => setTeamPitchCount(side, 0)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-1.5 py-0.5 rounded text-[10px]"
                >リセット</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/** 1チーム分の打順パネル */
function TeamLineupPanel({ side }: { side: 'away' | 'home' }) {
  const [csvError, setCsvError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const team = useGameStore((s) => side === 'away' ? s.awayTeam : s.homeTeam)
  const lineup = useGameStore((s) => side === 'away' ? s.awayLineup : s.homeLineup)
  const batterIdx = useGameStore((s) => side === 'away' ? s.awayBatterIndex : s.homeBatterIndex)
  const currentHalf = useGameStore((s) => s.currentHalf)
  const setLineupPlayer = useGameStore((s) => s.setLineupPlayer)
  const setLineup = useGameStore((s) => s.setLineup)
  const selectBatter = useGameStore((s) => s.selectBatter)
  const nextBatter = useGameStore((s) => s.nextBatter)
  const prevBatter = useGameStore((s) => s.prevBatter)
  const setLineupDisplayTeam = useGameStore((s) => s.setLineupDisplayTeam)

  const isAttacking = (side === 'away' && currentHalf === 'top') ||
    (side === 'home' && currentHalf === 'bottom')
  const label = side === 'away' ? '先攻' : '後攻'

  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCsvError(null)
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const players = parseLineupCsv(reader.result as string)
        setLineup(side, players)
        setCsvError(null)
      } catch (err) {
        setCsvError(err instanceof Error ? err.message : 'CSV読み込みに失敗しました')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div
      className={`rounded-lg p-3 space-y-2 ${
        isAttacking
          ? 'bg-yellow-900/20 border-2 border-yellow-500/50'
          : 'bg-gray-800 border border-gray-700'
      }`}
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 rounded" style={{ backgroundColor: team.color }} />
          <span className="text-white font-bold text-sm">{team.name}</span>
          <span className="text-gray-400 text-xs">（{label}）</span>
          {isAttacking && (
            <span className="text-yellow-400 text-xs font-bold animate-pulse">攻撃中</span>
          )}
          {!isAttacking && (
            <span className="text-gray-500 text-xs">守備中</span>
          )}
        </div>
        {isAttacking && (
          <div className="flex gap-1">
            <button
              onClick={() => { setLineupDisplayTeam(side); prevBatter() }}
              className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1.5 rounded text-xs font-bold"
            >
              ← 前の打者
            </button>
            <button
              onClick={() => { setLineupDisplayTeam(side); nextBatter() }}
              className="bg-accent hover:bg-accent/80 text-white px-3 py-1.5 rounded text-xs font-bold"
            >
              次の打者 →
            </button>
          </div>
        )}
      </div>

      {/* CSV / プリセット */}
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
          className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold"
        >
          CSV読込
        </button>
        <button
          onClick={() => setLineup(side, [...CARP_LINEUP])}
          className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs"
        >
          サンプル：広島カープ
        </button>
        <button
          onClick={() => setLineup(side, [...HAWKS_LINEUP])}
          className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs"
        >
          サンプル：ソフトバンク
        </button>
      </div>
      {csvError && (
        <div className="bg-red-900/50 border border-red-500 rounded px-3 py-1.5 text-red-300 text-xs">
          {csvError}
        </div>
      )}

      {/* ラインナップ（1-9番打者） */}
      <div className="space-y-0.5">
        {lineup.slice(0, 9).map((player, idx) => (
          <BatterRow
            key={player.order}
            player={player}
            isCurrent={idx === batterIdx && isAttacking}
            onSelect={() => selectBatter(side, idx)}
            onChange={(p) => setLineupPlayer(side, idx, p)}
          />
        ))}
      </div>

      {/* 投手（10番目） */}
      {lineup[9] && (
        <PitcherRow
          player={lineup[9]}
          side={side}
          onSelect={() => selectBatter(side, 9)}
          onChange={(p) => setLineupPlayer(side, 9, p)}
        />
      )}
    </div>
  )
}

export default function LineupControl() {
  return (
    <div className="space-y-3">
      <h2 className="text-white font-bold text-lg">打順・選手</h2>
      <TeamLineupPanel side="away" />
      <TeamLineupPanel side="home" />
    </div>
  )
}
