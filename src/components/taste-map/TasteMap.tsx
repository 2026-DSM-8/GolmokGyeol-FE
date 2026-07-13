import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { restaurants } from '../../mocks/restaurants'
import type { Restaurant, TastePoint } from '../../types/restaurant'

type TasteMapProps = {
  taste: TastePoint
  onTasteChange: (point: TastePoint) => void
  onOpenRestaurant: (restaurant: Restaurant) => void
  recommendations: Restaurant[]
  loading?: boolean
}

const getPointColor = ([x, y]: TastePoint) => (
  y >= 0 ? (x < 0 ? 'var(--violet)' : 'var(--orange)') : (x < 0 ? 'var(--green)' : 'var(--pink)')
)

const screenPoint = ([x, y]: TastePoint) => ({
  x: 500 + x * 400,
  y: 500 - y * 400,
})

const confidenceFor = (restaurant: Restaurant) => {
  if (restaurant.reviews < 40) return 'low'
  return 'high'
}

export function TasteMap({ taste, onTasteChange, onOpenRestaurant, recommendations, loading = false }: TasteMapProps) {
  const shellRef = useRef<HTMLDivElement>(null)
  const [draggingUser, setDraggingUser] = useState(false)
  const [loadStep, setLoadStep] = useState(0)
  const [coach, setCoach] = useState(0)
  const [mapPixelWidth, setMapPixelWidth] = useState(1000)
  const recommendationIds = new Set(recommendations.map((restaurant) => restaurant.id))
  const userPoint = screenPoint(taste)
  const nodeHitRadius = Math.max(24, 24 * 1000 / mapPixelWidth)

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return

    const updateWidth = () => setMapPixelWidth(Math.max(1, shell.getBoundingClientRect().width))
    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(shell)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (loading) {
      setCoach(0)
      setLoadStep(0)
      const first = window.setTimeout(() => setLoadStep(1), 500)
      const second = window.setTimeout(() => setLoadStep(2), 900)
      return () => { window.clearTimeout(first); window.clearTimeout(second) }
    }
    const timer = window.setTimeout(() => setCoach(1), 700)
    return () => window.clearTimeout(timer)
  }, [loading])

  const onUserPointerDown = (event: ReactPointerEvent<SVGGElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setDraggingUser(true)
    shellRef.current?.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingUser || !shellRef.current) return
    const rect = shellRef.current.getBoundingClientRect()
    const scale = 1000 / rect.width
    const pointerX = (event.clientX - rect.left) * scale
    const pointerY = (event.clientY - rect.top) * scale
    onTasteChange([
      Math.min(1.15, Math.max(-1.15, (pointerX - 500) / 400)),
      Math.min(1.15, Math.max(-1.15, -(pointerY - 500) / 400)),
    ])
  }

  const stopDragging = () => setDraggingUser(false)
  const finishCoach = () => setCoach(0)
  const advanceCoach = () => {
    if (coach < 2) {
      setCoach(coach + 1)
      return
    }
    setCoach(3)
    window.setTimeout(finishCoach, 1100)
  }
  const budget = taste[0] < -.15 ? '저렴' : taste[0] > .15 ? '좀 비쌈' : '중간 가격'
  const pace = taste[1] > .15 ? '오래 머물기' : taste[1] < -.15 ? '후딱 먹기' : '적당히'
  const bubble = `${budget} · ${pace}`
  const bubbleWidth = [...bubble].reduce((width, character) => (
    width + (character === ' ' ? 4 : character === '·' ? 5 : 12)
  ), 10)

  return (
    <MapShell
      ref={shellRef}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      <MapSvg viewBox="0 0 1000 1000" aria-label="가격과 머무는 시간에 따른 식당 취향 지도">
        <MapWash width="500" height="500" $color="var(--violet)" />
        <MapWash x="500" width="500" height="500" $color="var(--orange)" />
        <MapWash y="500" width="500" height="500" $color="var(--green)" />
        <MapWash x="500" y="500" width="500" height="500" $color="var(--pink)" />
        <AxisLine d="M0 500H1000M500 0V1000" />

        {restaurants.map((restaurant, index) => {
          const point = screenPoint(restaurant.position)
          const recommended = recommendationIds.has(restaurant.id)
          const confidence = confidenceFor(restaurant)
          const showName = recommended || confidence !== 'high'
          const pointColor = getPointColor(restaurant.position)
          const opacity = recommended ? 1 : confidence === 'low' ? .78 : .45
          const distance = Math.hypot(restaurant.position[0] - taste[0], restaurant.position[1] - taste[1])
          const magnet = draggingUser ? 1 + Math.max(0, .35 * (1 - distance / .5)) : 1
          const nameY = recommended ? 28 : 26
          const statusLabel = confidence === 'low' ? '후기 적음' : '후기 충분'
          return (
            <RestaurantNode
              key={restaurant.id}
              $opacity={opacity}
              $delay={index * 20}
              transform={`translate(${point.x} ${point.y})`}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => { event.stopPropagation(); onOpenRestaurant(restaurant) }}
              role="button"
              tabIndex={0}
              aria-label={`${restaurant.name}, ${statusLabel}, 상세 보기`}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onOpenRestaurant(restaurant)
                }
              }}
            >
              <NodeHitArea r={nodeHitRadius} />
              <NodeMagnet transform={`scale(${magnet})`}>
                {recommended && <NodeRing r={confidence === 'low' ? 20 : 15} $color={pointColor} />}
                {confidence === 'high' && <NodeShape r={recommended ? 9 : 6} $color={pointColor} />}
                {confidence === 'low' && <NodeLowHalo r={recommended ? 22 : 20} $color={pointColor} />}
                {confidence === 'low' && <NodeDiamond d={recommended ? 'M0 -12L12 0L0 12L-12 0Z' : 'M0 -10L10 0L0 10L-10 0Z'} $color={pointColor} />}
              </NodeMagnet>
              {showName && <NodeName y={nameY} textAnchor="middle" $low={confidence === 'low'}>{restaurant.name}</NodeName>}
            </RestaurantNode>
          )
        })}

        <TastePoint transform={`translate(${userPoint.x} ${userPoint.y})`} onPointerDown={onUserPointerDown} role="slider" tabIndex={0} aria-label="내 취향 좌표" $dragging={draggingUser}>
          <TasteHalo r="20" />
          <TasteCore r="8" />
          <circle r="15" fill="transparent" />
          <g transform="translate(0 34)">
            <TasteBubble x={-bubbleWidth / 2} y="-13" width={bubbleWidth} height="26" rx="8" />
            <TasteBubbleLabel y="4" textAnchor="middle">{bubble}</TasteBubbleLabel>
          </g>
        </TastePoint>
      </MapSvg>

      <LabelLayer aria-hidden="true">
        <AxisLabel $position="left">← 저렴</AxisLabel><AxisLabel $position="right">비쌈 →</AxisLabel>
        <AxisLabel $position="top">오래 머물기 ↑</AxisLabel><AxisLabel $position="bottom">↓ 후딱 먹기</AxisLabel>
        <Quadrant $position="top-left" $color="var(--violet)">느긋한 밥집</Quadrant><Quadrant $position="top-right" $color="var(--orange)">카페 같은 곳</Quadrant>
        <Quadrant $position="bottom-left" $color="var(--green)">가성비 혼밥</Quadrant><Quadrant $position="bottom-right" $color="var(--pink)">퀄리티 혼밥</Quadrant>
      </LabelLayer>

      <ConfidenceLegend aria-label="노드 모양 안내">
        <span><LegendIcon $diamond={false} />후기 충분</span>
        <span><LegendIcon $diamond />후기 적음</span>
      </ConfidenceLegend>
      {loading && (
        <Loading>
          <span>{[
            '조용한 자리를 찾고 계시는군요',
            '은행동에서 23곳을 찾았어요',
            <>이 안에서도 갈리네요 —<br />후딱 먹기 ↔ 오래 머물기</>,
          ][loadStep]}</span>
          <div><i /></div>
        </Loading>
      )}

      {coach > 0 && !loading && (
        <Coach onPointerDown={(event) => event.stopPropagation()}>
          <svg viewBox="0 0 1000 1000" aria-hidden="true">
            <defs><mask id="taste-coach-hole"><rect width="1000" height="1000" fill="white" /><circle cx={userPoint.x} cy={userPoint.y} r={coach === 2 ? 120 : 46} fill="black" /></mask></defs>
            <rect width="1000" height="1000" fill="var(--background)" opacity=".7" mask="url(#taste-coach-hole)" />
            <circle cx={userPoint.x} cy={userPoint.y} r={coach === 2 ? 120 : 46} fill="none" stroke="var(--accent)" strokeWidth="1" opacity=".6" />
          </svg>
          <CoachCaption $left={Math.max(18, Math.min(82, userPoint.x / 10))} $top={Math.max(18, Math.min(76, userPoint.y / 10 + (coach === 2 ? 15 : 9)))}>
            <strong>{coach === 1 ? '이게 당신이에요' : coach === 2 ? '가까울수록 취향에 맞아요' : '점을 살살 밀어보세요'}</strong>
            {coach < 3 && <button onClick={advanceCoach}>{coach === 2 ? '밀어볼게요' : '다음'}</button>}
          </CoachCaption>
          {coach < 3 && <CoachSkip onClick={finishCoach}>건너뛰기</CoachSkip>}
        </Coach>
      )}
    </MapShell>
  )
}

const haloBreathe = keyframes`0%,100%{opacity:.18;transform:scale(.88)}50%{opacity:.3;transform:scale(1.12)}`
const loadingLine = keyframes`from{transform:scaleX(0)}to{transform:scaleX(1)}`
const MapShell = styled.div`
  position: relative; flex: none; overflow: hidden; width: 100%; aspect-ratio: 1; border: 0; border-radius: 0;
  background: var(--background); cursor: default; touch-action: auto;
`
const MapSvg = styled.svg`display: block; width: 100%; height: 100%; user-select: none;`
const MapWash = styled.rect<{ $color: string }>`fill: ${({ $color }) => $color}; opacity: .035;`
const AxisLine = styled.path`fill: none; stroke: var(--line); stroke-width: 1.4; stroke-dasharray: 6 6;`
const RestaurantNode = styled.g<{ $opacity: number; $delay: number }>`
  cursor: pointer; opacity: ${({ $opacity }) => $opacity}; transition-delay: ${({ $delay }) => $delay}ms;
  transition: transform 520ms cubic-bezier(.4,0,.2,1), opacity 420ms cubic-bezier(.4,0,.2,1);
  &:hover { opacity: 1; }
  &:focus-visible { outline: none; }
  &:focus-visible > circle:first-of-type { stroke: var(--accent); stroke-width: 3; }
`
const NodeHitArea = styled.circle`
  fill: transparent; pointer-events: all;
`
const NodeMagnet = styled.g`transition: transform 200ms cubic-bezier(.4,0,.2,1);`
const NodeRing = styled.circle<{ $color: string }>`fill: none; stroke: ${({ $color }) => $color}; stroke-width: 1.2; opacity: .35;`
const NodeShape = styled.circle<{ $color: string }>`fill: ${({ $color }) => $color}; stroke: none;`
const NodeLowHalo = styled.circle<{ $color: string }>`
  fill: ${({ $color }) => $color}; opacity: .16; transform-box: fill-box; transform-origin: center;
  animation: ${haloBreathe} 3.2s ease-in-out infinite;
`
const NodeDiamond = styled.path<{ $color: string }>`fill: var(--background); stroke: ${({ $color }) => $color}; stroke-width: 2;`
const NodeName = styled.text<{ $low: boolean }>`
  fill: var(--ink); font-size: ${({ $low }) => $low ? '13px' : '12px'}; font-weight: ${({ $low }) => $low ? 500 : 400};
  letter-spacing: -.01em; paint-order: stroke; stroke: var(--background); stroke-width: 5px; stroke-linejoin: round;
`
const TastePoint = styled.g<{ $dragging: boolean }>`cursor: ${({ $dragging }) => $dragging ? 'grabbing' : 'grab'}; outline: none; touch-action: none;`
const TasteHalo = styled.circle`fill: var(--accent); transform-box: fill-box; transform-origin: center; animation: ${haloBreathe} 3.2s ease-in-out infinite;`
const TasteCore = styled.circle`fill: var(--accent);`
const TasteBubble = styled.rect`fill: var(--quote); stroke: #3a3733; stroke-width: 1;`
const TasteBubbleLabel = styled.text`fill: var(--ink); font-size: 12px; font-weight: 400; letter-spacing: -.01em;`
const LabelLayer = styled.div`position: absolute; inset: 0; pointer-events: none; color: #b8b3a9; font-size: 13px; font-weight: 500; letter-spacing: -.01em;`
const AxisLabel = styled.span<{ $position: 'left'|'right'|'top'|'bottom' }>`
  position: absolute;
  ${({ $position }) => $position === 'left' ? 'top:50%;left:16px;transform:translateY(-50%);' : $position === 'right' ? 'top:50%;right:16px;transform:translateY(-50%);' : $position === 'top' ? 'top:14px;left:50%;transform:translateX(-50%);' : 'bottom:14px;left:50%;transform:translateX(-50%);'}
`
const Quadrant = styled.span<{ $position: 'top-left'|'top-right'|'bottom-left'|'bottom-right'; $color: string }>`
  position: absolute; color: ${({ $color }) => $color}; font-size: 13px;
  ${({ $position }) => $position === 'top-left' ? 'top:24px;left:24px;' : $position === 'top-right' ? 'top:24px;right:24px;' : $position === 'bottom-left' ? 'bottom:24px;left:24px;' : 'right:24px;bottom:24px;'}
`
const ConfidenceLegend = styled.div`
  position: absolute; bottom: 52px; left: 20px; display: flex; align-items: center; gap: 14px; padding: 8px 12px;
  border: 1px solid var(--line); border-radius: 8px; color: var(--muted); background: var(--card); font-size: 12px; pointer-events: none;
  span { display: flex; align-items: center; gap: 6px; white-space: nowrap; }
`
const LegendIcon = styled.i<{ $diamond: boolean }>`
  display: inline-block; flex: none; width: 9px; height: 9px;
  ${({ $diamond }) => $diamond ? 'border:1.5px solid var(--sub);background:var(--background);transform:rotate(45deg) scale(.72);' : 'border-radius:50%;background:var(--sub);'}
`
const Loading = styled.div`
  position: absolute; inset: 0; z-index: 30; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 28px; background: var(--background);
  > span { color: var(--sub); font-size: 15px; line-height: 1.6; letter-spacing: -.01em; text-align: center; }
  > div { width: 160px; height: 1px; overflow: hidden; background: var(--line); }
  > div i { display: block; width: 100%; height: 100%; background: var(--accent); transform-origin: left; animation: ${loadingLine} 1200ms linear both; }
`
const Coach = styled.div`
  position: absolute; inset: 0; z-index: 40;
  > svg { position: absolute; inset: 0; width: 100%; height: 100%; }
`
const CoachCaption = styled.div<{ $left:number; $top:number }>`
  position: absolute; left: ${({$left})=>$left}%; top: ${({$top})=>$top}%; display: flex; flex-direction: column; align-items: center; width: 260px; transform: translateX(-50%); text-align: center;
  strong { color: var(--ink); font-size: 20px; font-weight: 500; line-height: 1.4; letter-spacing: -.01em; }
  button { height: 40px; margin-top: 20px; padding: 0 20px; border: 0; border-radius: 8px; color: var(--background); background: var(--accent); cursor: pointer; font-size: 14px; font-weight: 500; }
  @media (max-width: 640px) { width: 210px; strong { font-size: 17px; } }
`
const CoachSkip = styled.button`position: absolute; top: 20px; right: 20px; padding: 0; border: 0; color: var(--sub); background: transparent; cursor: pointer; font-size: 13px;`
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
