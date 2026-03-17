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

export default function ControlPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-5xl mx-auto space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">
            yakyuu コントロールパネル
          </h1>
          <a
            href="/overlay"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent/80 text-sm underline"
          >
            オーバーレイを開く →
          </a>
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
            <TickerControl />
            <PlayLogControl />
          </div>
        </div>
      </div>
    </div>
  )
}
