import type { CSSProperties } from 'react'

const colors = ['#a99bf7', '#f5946e', '#63d5aa', '#f28fb4']
let seed = 7
const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
const dots = Array.from({ length: 96 }, (_, index) => ({
  className: `backdrop-dot drift-${index % 3}`,
  style: {
    left: `${3 + random() * 94}%`,
    top: `${4 + random() * 92}%`,
    width: `${7 + random() * 7}px`,
    color: colors[index % colors.length],
    background: colors[index % colors.length],
    opacity: 0.35 + random() * 0.35,
    animationDuration: `${18 + random() * 10}s`,
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
