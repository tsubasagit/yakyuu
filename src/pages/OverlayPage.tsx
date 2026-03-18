import { useBroadcastSync } from '../hooks/useBroadcastSync'
import { useDraggable } from '../hooks/useDraggable'
import Scoreboard from '../components/overlay/Scoreboard'
import PlayerInfo from '../components/overlay/PlayerInfo'
import PlayLog from '../components/overlay/PlayLog'
import LineupCard from '../components/overlay/LineupCard'
import GameTimer from '../components/overlay/GameTimer'
import Ticker from '../components/overlay/Ticker'
import EffectOverlay from '../components/overlay/EffectOverlay'
import Mascot from '../components/overlay/Mascot'
import WaitingScreen from '../components/overlay/WaitingScreen'

function DraggableBox({
  initialX,
  initialY,
  children,
}: {
  initialX: number
  initialY: number
  children: React.ReactNode
}) {
  const { pos, onMouseDown } = useDraggable({ x: initialX, y: initialY })

  return (
    <div
      className="absolute pointer-events-auto drag-handle"
      style={{ left: pos.x, top: pos.y }}
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  )
}

export default function OverlayPage() {
  useBroadcastSync()

  return (
    <div className="w-[1920px] h-[1080px] relative select-none pointer-events-none">
      {/* スコアボード（BSO・走者・球数 統合） — 左上 */}
      <DraggableBox initialX={24} initialY={24}>
        <Scoreboard />
      </DraggableBox>

      {/* 経過時間 */}
      <DraggableBox initialX={24} initialY={160}>
        <GameTimer />
      </DraggableBox>

      {/* 両チーム打順 — 右上 */}
      <DraggableBox initialX={1920 - 500} initialY={24}>
        <LineupCard />
      </DraggableBox>

      {/* 選手情報 — 左下 */}
      <DraggableBox initialX={24} initialY={1080 - 60}>
        <PlayerInfo />
      </DraggableBox>

      {/* 経過ログ — 右下 */}
      <DraggableBox initialX={1920 - 360} initialY={1080 - 280}>
        <PlayLog />
      </DraggableBox>

      {/* 速報テロップ — 最下部 */}
      <Ticker />

      {/* マスコット — 右下 */}
      <DraggableBox initialX={1920 - 180} initialY={1080 - 180}>
        <Mascot />
      </DraggableBox>

      {/* エフェクト — 画面中央 */}
      <EffectOverlay />

      {/* 待機画面 — 全面 */}
      <WaitingScreen />
    </div>
  )
}
