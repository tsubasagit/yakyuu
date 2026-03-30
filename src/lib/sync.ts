import type { GameState } from '../types'

const CHANNEL_NAME = 'yakyuu-sync'

export type SyncMessage = {
  type: 'state-update'
  state: GameState
}

let channel: BroadcastChannel | null = null

function getChannel(): BroadcastChannel | null {
  if (!channel) {
    try {
      channel = new BroadcastChannel(CHANNEL_NAME)
    } catch {
      // BroadcastChannel 非対応（Safari Private, 古いブラウザ等）
      // → localStorage フォールバックに任せる
      return null
    }
  }
  return channel
}

export function broadcastState(state: GameState): void {
  const ch = getChannel()
  if (!ch) return
  const msg: SyncMessage = { type: 'state-update', state }
  try {
    ch.postMessage(msg)
  } catch {
    // postMessage 失敗（構造化クローン不可など）は無視
  }
}

export function onStateUpdate(callback: (state: GameState) => void): () => void {
  const ch = getChannel()
  if (!ch) return () => {}
  const handler = (event: MessageEvent<SyncMessage>) => {
    if (event.data.type === 'state-update') {
      callback(event.data.state)
    }
  }
  ch.addEventListener('message', handler)
  return () => ch.removeEventListener('message', handler)
}
