import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

const colors = ['#a99bf7', '#f5946e', '#63d5aa', '#f28fb4']
let seed = 7
const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
const dots = Array.from({ length: 96 }, (_, index) => ({
  drift: index % 3,
  left: 3 + random() * 94,
  top: 4 + random() * 92,
  size: 7 + random() * 7,
  color: colors[index % colors.length],
  opacity: 0.35 + random() * 0.35,
  duration: 18 + random() * 10,
  delay: -random() * 20,
}))

export function TasteBackdrop() {
  return (
    <Backdrop aria-hidden="true">
      {dots.map((dot, index) => <Dot key={index} $dot={dot} />)}
    </Backdrop>
  )
}

const drift0 = keyframes`
  0% { transform: translate(0, 0); }
  50% { transform: translate(14px, -10px); }
  100% { transform: translate(-10px, 12px); }
`

const drift1 = keyframes`
  0% { transform: translate(0, 0); }
  50% { transform: translate(-12px, 8px); }
  100% { transform: translate(9px, -13px); }
`

const drift2 = keyframes`
  0% { transform: translate(0, 0); }
  50% { transform: translate(8px, 12px); }
  100% { transform: translate(-13px, -8px); }
`

const drifts = [drift0, drift1, drift2]

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  filter: blur(14px);
  opacity: .18;
  pointer-events: none;
`

const Dot = styled.span<{ $dot: (typeof dots)[number] }>`
  position: absolute;
  left: ${({ $dot }) => $dot.left}%;
  top: ${({ $dot }) => $dot.top}%;
  display: block;
  width: ${({ $dot }) => $dot.size}px;
  aspect-ratio: 1;
  border-radius: 50%;
  color: ${({ $dot }) => $dot.color};
  background: currentColor;
  opacity: ${({ $dot }) => $dot.opacity};
  animation-name: ${({ $dot }) => drifts[$dot.drift]};
  animation-duration: ${({ $dot }) => $dot.duration}s;
  animation-delay: ${({ $dot }) => $dot.delay}s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
`
