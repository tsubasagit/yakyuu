import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/useGameStore'
import { onStateUpdate } from '../lib/sync'
import { cacheOverlayState } from '../lib/overlayCache'

export function useBroadcastSync(): void {
  const replaceState = useGameStore((s) => s.replaceState)
  // コントロール側の overlayPositions が変わったかを追跡
  const prevPositionsRef = useRef<string>('')

  useEffect(() => {
    const unsubscribe = onStateUpdate((state) => {
      // overlayPositions: コントロール側で変更があった場合のみ反映する。
      // オーバーレイは localStorage に書けないため、
      // ドラッグ後のブロードキャストで古い位置に戻るのを防ぐ。
      const newPosStr = JSON.stringify(state.overlayPositions ?? {})
      if (prevPositionsRef.current && newPosStr === prevPositionsRef.current) {
        // コントロール側からの位置変更なし → オーバーレイの現在位置を維持
        state.overlayPositions = useGameStore.getState().overlayPositions
      }
      prevPositionsRef.current = newPosStr

      replaceState(state)

      // BroadcastChannel 経由で受信したデータをキャッシュ。
      // OBS 再起動時にメインの localStorage が空でもキャッシュから復元可能にする。
      cacheOverlayState(state)
    })
    return unsubscribe
  }, [replaceState])
}
