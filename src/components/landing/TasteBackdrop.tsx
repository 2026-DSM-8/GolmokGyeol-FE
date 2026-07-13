import type { CSSProperties } from 'react'

const colors = ['#7f77dd', '#d85a30', '#1d9e75', '#d4537e']
let seed = 7
const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
const dots = Array.from({ length: 48 }, (_, index) => ({
  className: `backdrop-dot drift-${index % 3}`,
  style: {
    left: `${3 + random() * 94}%`,
    top: `${4 + random() * 92}%`,
    width: `${7 + random() * 7}px`,
    color: colors[index % colors.length],
    background: colors[index % colors.length],
    opacity: 0.4 + random() * 0.4,
    animationDuration: `${15 + random() * 5}s`,
    animationDelay: `${-random() * 20}s`,
  } as CSSProperties,
}))

export function TasteBackdrop() {
  return (
    <div className="taste-backdrop" aria-hidden="true">
      {dots.map((dot, index) => <span key={index} className={dot.className} style={dot.style} />)}
    </div>
  )
}
