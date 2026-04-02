import { useEffect, useState } from 'react'
import SyncStatus from '../components/control/SyncStatus'
import GameControl from '../components/control/GameControl'
import InningControl from '../components/control/InningControl'
import CountControl from '../components/control/CountControl'
import RunnerControl from '../components/control/RunnerControl'
import ScoreControl from '../components/control/ScoreControl'
import PlayerControl from '../components/control/PlayerControl'
import PlayLogControl from '../components/control/PlayLogControl'
import LineupControl from '../components/control/LineupControl'
import TickerControl from '../components/control/TickerControl'
import EffectControl from '../components/control/EffectControl'
import MascotControl from '../components/control/MascotControl'
import { useGameStore, extractGameState } from '../store/useGameStore'
import { broadcastState, onStateRequest } from '../lib/sync'

/** コントロール側から定期的にフルステートをブロードキャストする。 */
function usePeriodicBroadcast() {
  useEffect(() => {
    const id = setInterval(() => {
      broadcastState(extractGameState(useGameStore.getState()))
    }, 2000)
    return () => clearInterval(id)
  }, [])
}

interface Section {
  id: string
  label: string
  component: React.ReactNode
}

const STORAGE_KEY = 'yakyuu-section-order'

function loadOrder(): string[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveOrder(order: string[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(order)) } catch {}
}

export default function ControlPage() {
  useEffect(() => {
    return onStateRequest(() => {
      broadcastState(extractGameState(useGameStore.getState()))
    })
  }, [])

  usePeriodicBroadcast()

  const allSections: Section[] = [
    { id: 'game', label: '試合管理', component: <GameControl /> },
    { id: 'inning', label: 'イニング', component: <InningControl /> },
    { id: 'count', label: 'カウント', component: <CountControl /> },
    { id: 'runner', label: '走者', component: <RunnerControl /> },
    { id: 'player', label: '選手情報', component: <PlayerControl /> },
    { id: 'score', label: '得点・安打・失策', component: <ScoreControl /> },
    { id: 'lineup', label: '打順・選手', component: <LineupControl /> },
    { id: 'effect', label: 'エフェクト', component: <EffectControl /> },
    { id: 'mascot', label: 'マスコット', component: <MascotControl /> },
    { id: 'ticker', label: '速報テロップ', component: <TickerControl /> },
    { id: 'playlog', label: '経過ログ', component: <PlayLogControl /> },
  ]

  const defaultOrder = allSections.map((s) => s.id)
  const [order, setOrder] = useState<string[]>(() => loadOrder() ?? defaultOrder)

  const sorted = order
    .map((id) => allSections.find((s) => s.id === id))
    .filter((s): s is Section => !!s)

  const move = (idx: number, dir: -1 | 1) => {
    const target = idx + dir
    if (target < 0 || target >= sorted.length) return
    const next = [...order]
    const tmp = next[idx]!
    next[idx] = next[target]!
    next[target] = tmp
    setOrder(next)
    saveOrder(next)
  }

  return (
    <div className="min-h-screen bg-gray-900 p-2 sm:p-4">
      <div className="max-w-5xl mx-auto space-y-3 sm:space-y-4">
        <header className="flex items-center justify-between gap-2">
          <h1 className="text-white text-lg sm:text-2xl font-bold">
            yakyuu コントロール
          </h1>
          <div className="flex items-center gap-3">
            <SyncStatus />
            <a
              href="#/overlay"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 text-xs sm:text-sm underline whitespace-nowrap"
            >
              オーバーレイ →
            </a>
          </div>
        </header>

        <div className="columns-1 lg:columns-2 gap-4 space-y-3">
          {sorted.map((section, idx) => (
            <div key={section.id} className="relative break-inside-avoid">
              {/* 移動ボタン */}
              <div className="absolute -left-1 top-1 flex flex-col gap-0.5 z-10">
                <button
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  className="text-gray-500 hover:text-white disabled:opacity-20 text-xs leading-none px-1"
                  title="上へ移動"
                >
                  ▲
                </button>
                <button
                  onClick={() => move(idx, 1)}
                  disabled={idx === sorted.length - 1}
                  className="text-gray-500 hover:text-white disabled:opacity-20 text-xs leading-none px-1"
                  title="下へ移動"
                >
                  ▼
                </button>
              </div>
              <div className="ml-4">
                {section.component}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
