import { useBroadcastSync } from '../hooks/useBroadcastSync'
import { useGameStore } from '../store/useGameStore'
import Scoreboard from '../components/overlay/Scoreboard'
import BSOCount from '../components/overlay/BSOCount'
import RunnerDiamond from '../components/overlay/RunnerDiamond'
import PlayerInfo from '../components/overlay/PlayerInfo'
import PlayLog from '../components/overlay/PlayLog'
import LineupCard from '../components/overlay/LineupCard'
import GameTimer from '../components/overlay/GameTimer'
import Ticker from '../components/overlay/Ticker'
import EffectOverlay from '../components/overlay/EffectOverlay'

export default function OverlayPage() {
  useBroadcastSync()

  const currentInning = useGameStore((s) => s.currentInning)
  const currentHalf = useGameStore((s) => s.currentHalf)

  return (
    <div className="w-[1920px] h-[1080px] relative select-none pointer-events-none">
      {/* スコアボード — 左上 */}
      <div className="absolute top-6 left-6">
        <Scoreboard />
      </div>

      {/* BSO + ダイヤモンド — スコアボード下 */}
      <div className="absolute top-[140px] left-6 flex gap-3 items-start">
        <BSOCount />
        <RunnerDiamond />
        <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm font-bold">
          {currentInning}回{currentHalf === 'top' ? '表' : '裏'}
        </div>
        <GameTimer />
      </div>

      {/* 攻撃チーム打順 — 右上 */}
      <div className="absolute top-6 right-6">
        <LineupCard />
      </div>

      {/* 選手情報 — 左下 */}
      <div className="absolute bottom-6 left-6">
        <PlayerInfo />
      </div>

      {/* 経過ログ — 右下 */}
      <div className="absolute bottom-6 right-6">
        <PlayLog />
      </div>

      {/* 速報テロップ — 最下部 */}
      <Ticker />

      {/* エフェクト — 画面中央 */}
      <EffectOverlay />
    </div>
  )
}
