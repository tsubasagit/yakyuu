import { useEffect, useRef } from 'react'
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

const SECTIONS = [
  { id: 'game', label: '試合管理' },
  { id: 'inning', label: 'イニング' },
  { id: 'count', label: 'カウント' },
  { id: 'runner', label: '走者' },
  { id: 'player', label: '選手情報' },
  { id: 'score', label: '得点・安打・失策' },
  { id: 'lineup', label: '打順・選手' },
  { id: 'effect', label: 'エフェクト' },
  { id: 'mascot', label: 'マスコット' },
  { id: 'ticker', label: '速報テロップ' },
  { id: 'playlog', label: '経過ログ' },
] as const

export default function ControlPage() {
  useEffect(() => {
    return onStateRequest(() => {
      broadcastState(extractGameState(useGameStore.getState()))
    })
  }, [])

  usePeriodicBroadcast()

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const setRef = (id: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el
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

        {/* セクション移動ドロップダウン */}
        <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm py-2 -mx-2 px-2 sm:-mx-4 sm:px-4">
          <select
            className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm font-bold"
            defaultValue=""
            onChange={(e) => { scrollTo(e.target.value); e.target.value = '' }}
          >
            <option value="" disabled>セクションへ移動...</option>
            {SECTIONS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div ref={setRef('game')}><GameControl /></div>
            <div ref={setRef('inning')}><InningControl /></div>
            <div ref={setRef('count')}><CountControl /></div>
            <div ref={setRef('runner')}><RunnerControl /></div>
            <div ref={setRef('player')}><PlayerControl /></div>
          </div>
          <div className="space-y-4">
            <div ref={setRef('score')}><ScoreControl /></div>
            <div ref={setRef('lineup')}><LineupControl /></div>
            <div ref={setRef('effect')}><EffectControl /></div>
            <div ref={setRef('mascot')}><MascotControl /></div>
            <div ref={setRef('ticker')}><TickerControl /></div>
            <div ref={setRef('playlog')}><PlayLogControl /></div>
          </div>
        </div>
      </div>
    </div>
  )
}
