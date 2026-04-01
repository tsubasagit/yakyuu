import type { GameState } from '../types'

/**
 * オーバーレイ専用のステートキャッシュ。
 *
 * メインの localStorage キー (yakyuu-game-state) はコントロールパネルが書き込み、
 * オーバーレイは書き込み禁止 (_preventPersistWrites) になっている。
 * OBS では Browser Source と Custom Dock で localStorage が共有されない場合があるため、
 * BroadcastChannel 経由で受信したデータをこのキャッシュに保存しておく。
 * OBS 再起動時にキャッシュからステートを復元することで、初期化を防ぐ。
 */

const OVERLAY_CACHE_KEY = 'yakyuu-overlay-cache'

export function cacheOverlayState(state: GameState): void {
  try {
    localStorage.setItem(OVERLAY_CACHE_KEY, JSON.stringify({ state, timestamp: Date.now() }))
  } catch {
    // QuotaExceededError 等 — 無視
  }
}

export function loadOverlayCache(): GameState | null {
  try {
    const raw = localStorage.getItem(OVERLAY_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed.state ?? null
  } catch {
    return null
  }
}
