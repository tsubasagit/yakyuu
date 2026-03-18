import { useRef } from 'react'
import { useGameStore } from '../../store/useGameStore'
import type { MascotMode } from '../../types'

const MODES: { mode: MascotMode; label: string }[] = [
  { mode: 'idle', label: '通常' },
  { mode: 'celebration', label: 'お祝い' },
  { mode: 'waiting', label: '考え中' },
  { mode: 'hidden', label: '非表示' },
]

const UPLOAD_MODES: { mode: string; label: string }[] = [
  { mode: 'idle', label: '通常' },
  { mode: 'celebration', label: 'お祝い' },
  { mode: 'waiting', label: '考え中' },
]

function resizeImage(file: File, maxHeight: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = maxHeight / img.height
      const w = Math.round(img.width * scale)
      const h = maxHeight
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('画像の読み込みに失敗しました'))
    }
    img.src = url
  })
}

export default function MascotControl() {
  const showMascot = useGameStore((s) => s.showMascot)
  const mascotMode = useGameStore((s) => s.mascotMode)
  const mascotImages = useGameStore((s) => s.mascotImages)
  const setShowMascot = useGameStore((s) => s.setShowMascot)
  const setMascotMode = useGameStore((s) => s.setMascotMode)
  const setMascotImage = useGameStore((s) => s.setMascotImage)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadTargetRef = useRef<string>('idle')

  const handleUpload = (mode: string) => {
    uploadTargetRef.current = mode
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await resizeImage(file, 300)
      setMascotImage(uploadTargetRef.current, dataUrl)
    } catch {
      // ignore
    }
    e.target.value = ''
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-lg">マスコット</h2>
        <button
          onClick={() => setShowMascot(!showMascot)}
          className={`px-3 py-1 rounded text-sm font-bold ${
            showMascot
              ? 'bg-green-600 hover:bg-green-500 text-white'
              : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
          }`}
        >
          {showMascot ? 'ON' : 'OFF'}
        </button>
      </div>

      {showMascot && (
        <>
          <div className="grid grid-cols-4 gap-2">
            {MODES.map((m) => (
              <button
                key={m.mode}
                onClick={() => setMascotMode(m.mode)}
                className={`px-2 py-1.5 rounded text-xs font-bold ${
                  mascotMode === m.mode
                    ? 'bg-accent text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-700">
            <span className="text-gray-400 text-xs">画像アップロード</span>
            <div className="grid grid-cols-3 gap-2">
              {UPLOAD_MODES.map((m) => (
                <div key={m.mode} className="flex flex-col items-center gap-1">
                  {mascotImages[m.mode] ? (
                    <img
                      src={mascotImages[m.mode]}
                      alt={m.label}
                      className="h-12 w-auto rounded bg-gray-900/50"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded bg-gray-700 flex items-center justify-center text-gray-500 text-lg">
                      ?
                    </div>
                  )}
                  <span className="text-gray-400 text-[10px]">{m.label}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleUpload(m.mode)}
                      className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-0.5 rounded text-[10px]"
                    >
                      変更
                    </button>
                    {mascotImages[m.mode] && (
                      <button
                        onClick={() => setMascotImage(m.mode, null)}
                        className="bg-red-900/50 hover:bg-red-800/50 text-red-300 px-2 py-0.5 rounded text-[10px]"
                      >
                        削除
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  )
}
