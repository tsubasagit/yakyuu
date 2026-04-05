import { useEffect, useState } from 'react'

const HEARTBEAT_KEY = 'yakyuu-overlay-heartbeat'
const STALE_THRESHOLD = 5000 // 5秒以上古い = 切断とみなす

type Status = 'connected' | 'disconnected'

export default function SyncStatus() {
  const [status, setStatus] = useState<Status>('disconnected')

  useEffect(() => {
    function check() {
      try {
        // localStorage を優先チェック
        let raw = localStorage.getItem(HEARTBEAT_KEY)
        // Cookie フォールバック: OBS で localStorage が共有されない場合
        if (!raw) {
          const match = document.cookie.match(/yakyuu-hb=(\d+)/)
          if (match) raw = match[1]!
        }
        if (!raw) {
          setStatus('disconnected')
          return
        }
        const ts = parseInt(raw, 10)
        setStatus(Date.now() - ts < STALE_THRESHOLD ? 'connected' : 'disconnected')
      } catch {
        setStatus('disconnected')
      }
    }
    check()
    const interval = setInterval(check, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={`w-2 h-2 rounded-full ${
          status === 'connected' ? 'bg-green-400' : 'bg-gray-500'
        }`}
      />
      <span className={status === 'connected' ? 'text-green-400' : 'text-gray-500'}>
        {status === 'connected' ? 'オーバーレイ接続中' : 'オーバーレイ未接続'}
      </span>
      {status === 'disconnected' && (
        <span className="text-gray-600 text-[10px]">
          (OBSカスタムドックを使用してください)
        </span>
      )}
    </div>
  )
}
