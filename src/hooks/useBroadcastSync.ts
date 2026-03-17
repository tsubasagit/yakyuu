import { useEffect } from 'react'
import { useGameStore } from '../store/useGameStore'
import { onStateUpdate } from '../lib/sync'

export function useBroadcastSync(): void {
  const replaceState = useGameStore((s) => s.replaceState)

  useEffect(() => {
    const unsubscribe = onStateUpdate((state) => {
      replaceState(state)
    })
    return unsubscribe
  }, [replaceState])
}
