import type { GameState } from '../types'

const CHANNEL_NAME = 'yakyuu-sync'

export type SyncMessage = {
  type: 'state-update'
  state: GameState
}

let channel: BroadcastChannel | null = null

function getChannel(): BroadcastChannel {
  if (!channel) {
    channel = new BroadcastChannel(CHANNEL_NAME)
  }
  return channel
}

export function broadcastState(state: GameState): void {
  const msg: SyncMessage = { type: 'state-update', state }
  getChannel().postMessage(msg)
}

export function onStateUpdate(callback: (state: GameState) => void): () => void {
  const ch = getChannel()
  const handler = (event: MessageEvent<SyncMessage>) => {
    if (event.data.type === 'state-update') {
      callback(event.data.state)
    }
  }
  ch.addEventListener('message', handler)
  return () => ch.removeEventListener('message', handler)
}
