import { useCallback, useEffect, useRef, useState } from 'react'
import { useBroadcastSync } from '../hooks/useBroadcastSync'
import { useStorageSync } from '../hooks/useStorageSync'
import { useGameStore } from '../store/useGameStore'
import Scoreboard from '../components/overlay/Scoreboard'
import PlayerInfo from '../components/overlay/PlayerInfo'
import PlayLog from '../components/overlay/PlayLog'
import LineupCard from '../components/overlay/LineupCard'
import GameTimer from '../components/overlay/GameTimer'
import Ticker from '../components/overlay/Ticker'
import EffectOverlay from '../components/overlay/EffectOverlay'
import Mascot from '../components/overlay/Mascot'
import WaitingScreen from '../components/overlay/WaitingScreen'

const CANVAS_W = 1920
const CANVAS_H = 1080

/** ビューポートに合わせて 1920x1080 キャンバスを自動スケーリング */
function useViewportScale() {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    function update() {
      const sx = window.innerWidth / CANVAS_W
      const sy = window.innerHeight / CANVAS_H
      setScale(Math.min(sx, sy))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return scale
}

const DEFAULT_POS = { x: 0, y: 0 }

/** Zustand にドラッグ位置を永続化する DraggableBox
 *  ドラッグ中はローカル state で描画し、mouseUp で store に書き戻す */
function DraggableBox({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  const storePos = useGameStore((s) => s.overlayPositions?.[id]) ?? DEFAULT_POS
  const setOverlayPosition = useGameStore((s) => s.setOverlayPosition)
  const [localPos, setLocalPos] = useState(storePos)
  const dragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })

  // store 側が変わったら（sync 経由など）ローカルを追従
  // 依存をプリミティブ値にして、オブジェクト参照変更での無限ループを防止
  const storeX = storePos.x
  const storeY = storePos.y
  useEffect(() => {
    if (!dragging.current) {
      setLocalPos({ x: storeX, y: storeY })
    }
  }, [storeX, storeY])

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      dragging.current = true
      offset.current = { x: e.clientX - localPos.x, y: e.clientY - localPos.y }
      e.preventDefault()
    },
    [localPos],
  )

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return
      setLocalPos({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      })
    }
    const onMouseUp = () => {
      if (!dragging.current) return
      dragging.current = false
      // ドラッグ終了時のみ store に書き込む（localStorage 書き込み削減）
      setLocalPos((p) => {
        setOverlayPosition(id, p)
        return p
      })
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [id, setOverlayPosition])

  return (
    <div
      className="absolute pointer-events-auto drag-handle"
      style={{ left: localPos.x, top: localPos.y }}
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  )
}

const HEARTBEAT_KEY = 'yakyuu-overlay-heartbeat'

/** オーバーレイが生きていることをコントロール側に伝えるハートビート */
function useOverlayHeartbeat() {
  useEffect(() => {
    function beat() {
      try {
        localStorage.setItem(HEARTBEAT_KEY, String(Date.now()))
      } catch {
        // quota exceeded — 無視
      }
    }
    beat()
    const interval = setInterval(beat, 1500)
    return () => clearInterval(interval)
  }, [])
}

export default function OverlayPage() {
  useBroadcastSync()
  useStorageSync()
  useOverlayHeartbeat()
  const scale = useViewportScale()

  return (
    <div
      style={{
        width: CANVAS_W,
        height: CANVAS_H,
        transform: scale < 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top left',
      }}
      className="relative select-none pointer-events-none"
    >
      {/* スコアボード（BSO・走者・球数 統合） — 左上 */}
      <DraggableBox id="scoreboard">
        <Scoreboard />
      </DraggableBox>

      {/* 経過時間 */}
      <DraggableBox id="timer">
        <GameTimer />
      </DraggableBox>

      {/* 両チーム打順 — 右上 */}
      <DraggableBox id="lineup">
        <LineupCard />
      </DraggableBox>

      {/* 選手情報 — 左下 */}
      <DraggableBox id="playerInfo">
        <PlayerInfo />
      </DraggableBox>

      {/* 経過ログ — 右下 */}
      <DraggableBox id="playLog">
        <PlayLog />
      </DraggableBox>

      {/* 速報テロップ — 最下部 */}
      <Ticker />

      {/* マスコット — 右下 */}
      <DraggableBox id="mascot">
        <Mascot />
      </DraggableBox>

      {/* エフェクト — 画面中央 */}
      <EffectOverlay />

      {/* 待機画面 — 全面 */}
      <WaitingScreen />
    </div>
  )
}
