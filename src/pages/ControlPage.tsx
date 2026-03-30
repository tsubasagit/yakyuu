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

export default function ControlPage() {
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <GameControl />
            <InningControl />
            <CountControl />
            <RunnerControl />
            <PlayerControl />
          </div>
          <div className="space-y-4">
            <ScoreControl />
            <LineupControl />
            <EffectControl />
            <MascotControl />
            <TickerControl />
            <PlayLogControl />
          </div>
        </div>
      </div>
    </div>
  )
}
