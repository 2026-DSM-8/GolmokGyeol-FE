import { useState } from 'react'
import type { KeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react'
import type { TastePoint } from '../types/restaurant'

export const useTasteDrag = (
  svgRef: RefObject<SVGSVGElement | null>,
  taste: TastePoint,
  onChange: (taste: TastePoint) => void,
) => {
  const [isDragging, setIsDragging] = useState(false)

  const onPointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!isDragging || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const x = Math.min(1, Math.max(-1, ((event.clientX - rect.left) / rect.width) * 2 - 1))
    const y = Math.min(1, Math.max(-1, 1 - ((event.clientY - rect.top) / rect.height) * 2))
    onChange([x, y])
  }

  const onPointerDown = (event: ReactPointerEvent<SVGGElement>) => {
    event.preventDefault()
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerEnd = () => setIsDragging(false)

  const onKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    const delta = event.shiftKey ? 0.12 : 0.05
    const moves: Record<string, TastePoint> = {
      ArrowLeft: [-delta, 0], ArrowRight: [delta, 0], ArrowUp: [0, delta], ArrowDown: [0, -delta],
    }
    const move = moves[event.key]
    if (!move) return
    event.preventDefault()
    onChange([
      Math.min(1, Math.max(-1, taste[0] + move[0])),
      Math.min(1, Math.max(-1, taste[1] + move[1])),
    ])
  }

  return { isDragging, onPointerMove, onPointerDown, onPointerEnd, onKeyDown }
}
