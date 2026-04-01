import type { GameState } from '../types'

const CHANNEL_NAME = 'yakyuu-sync'

export type SyncMessage =
  | { type: 'state-update'; state: GameState }
  | { type: 'request-state' }

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

/** オーバーレイ起動時にコントロールパネルへ現在のステートを要求する */
export function requestState(): void {
  const ch = getChannel()
  if (!ch) return
  try {
    ch.postMessage({ type: 'request-state' } satisfies SyncMessage)
  } catch {
    // ignore
  }
}

/** コントロールパネル側: ステート要求を受信したときのコールバックを登録 */
export function onStateRequest(callback: () => void): () => void {
  const ch = getChannel()
  if (!ch) return () => {}
  const handler = (event: MessageEvent<SyncMessage>) => {
    if (event.data.type === 'request-state') {
      callback()
    }
  }
  ch.addEventListener('message', handler)
  return () => ch.removeEventListener('message', handler)
}
