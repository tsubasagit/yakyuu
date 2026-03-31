import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/useGameStore'

const STORAGE_KEY = 'yakyuu-game-state'
const POLL_INTERVAL = 500

/**
 * localStorage 経由でステートを同期するフック。
 * BroadcastChannel が効かない環境（OBS Browser Source 等）向けのフォールバック。
 *  - storage イベント: 同一ブラウザの別タブからの変更を即時検知
 *  - ポーリング: OBS の CEF 内（Custom Dock + Browser Source）等で storage イベントが
 *    発火しないケースに対応
 *
 * 注意: オーバーレイ側は _preventPersistWrites=true のため localStorage に書き戻さない。
 * overlayPositions はオーバーレイ側のドラッグで変更されるため、コントロール側の変更のみ反映する。
 */
export function useStorageSync(): void {
  const replaceState = useGameStore((s) => s.replaceState)
  const lastRawRef = useRef<string>('')
  // コントロール側の overlayPositions が変わったかを追跡
  const prevPositionsRef = useRef<string>('')

  useEffect(() => {
    function applyStoredState() {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw || raw === lastRawRef.current) return
      lastRawRef.current = raw
      try {
        // Zustand persist format: { state: {...}, version: number }
        const parsed = JSON.parse(raw)
        const state = parsed.state
        if (state) {
          // overlayPositions: コントロール側で変更があった場合のみ反映する。
          // オーバーレイは _preventPersistWrites=true で localStorage に書けないため、
          // ドラッグ後のポーリングで古い位置に戻るのを防ぐ。
          const newPosStr = JSON.stringify(state.overlayPositions ?? {})
          if (prevPositionsRef.current && newPosStr === prevPositionsRef.current) {
            // コントロール側からの変更なし → オーバーレイの現在位置を維持
            state.overlayPositions = useGameStore.getState().overlayPositions
          }
          prevPositionsRef.current = newPosStr

          replaceState(state)
        }
      } catch {
        // ignore parse errors
      }
    }

    // 同一ブラウザの別タブからの変更を検知
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        applyStoredState()
      }
    }
    window.addEventListener('storage', handleStorage)

    // OBS CEF 等で storage イベントが発火しないケース用のポーリング
    const interval = setInterval(applyStoredState, POLL_INTERVAL)

    return () => {
      window.removeEventListener('storage', handleStorage)
      clearInterval(interval)
    }
  }, [replaceState])
}
