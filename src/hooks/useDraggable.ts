import { useCallback, useEffect, useRef, useState } from 'react'

interface Position {
  x: number
  y: number
}

export function useDraggable(initialPos: Position) {
  const [pos, setPos] = useState<Position>(initialPos)
  const dragging = useRef(false)
  const offset = useRef<Position>({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true
    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    }
    e.preventDefault()
  }, [pos])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return
      setPos({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      })
    }
    const onMouseUp = () => {
      dragging.current = false
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return { ref, pos, onMouseDown }
}
