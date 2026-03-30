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
 */
export function useStorageSync(): void {
  const replaceState = useGameStore((s) => s.replaceState)
  const lastRawRef = useRef<string>('')

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
          replaceState(state)
          // replaceState → Zustand persist が localStorage に書き戻すため、
          // その値で lastRawRef を更新してフィードバックループを防止
          const written = localStorage.getItem(STORAGE_KEY)
          if (written) lastRawRef.current = written
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
