import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { Axes, Restaurant, TastePoint } from '../../types/restaurant'
import { formatQuadrantLabel } from '../../utils/restaurantDisplay'

type TasteMapProps = {
  taste: TastePoint
  onTasteChange: (point: TastePoint) => void
  onOpenRestaurant: (restaurant: Restaurant) => void
  restaurants: Restaurant[]
  recommendations: Restaurant[]
  axes: Axes
  quadrants: [string, string, string, string]
  onMapBackgroundClick: () => void
  onCoachActiveChange?: (active: boolean) => void
  loading?: boolean
}

const getPointColor = ([x, y]: TastePoint) => (
  y >= 0 ? (x < 0 ? 'var(--violet)' : 'var(--orange)') : (x < 0 ? 'var(--green)' : 'var(--pink)')
)

const screenPoint = ([x, y]: TastePoint) => ({
  x: 500 + x * 400,
  y: 500 - y * 400,
})

const MIN_MAP_ZOOM = 1
const MAX_MAP_ZOOM = 8
const ZOOM_STEP = 1.35
type PanOffset = { x: number; y: number }

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const clampPan = ({ x, y }: PanOffset, zoom: number, width: number): PanOffset => {
  const maxPan = Math.max(0, width * (zoom - 1) / 2)
  return {
    x: clamp(x, -maxPan, maxPan),
    y: clamp(y, -maxPan, maxPan),
  }
}

export function TasteMap({
  taste,
  onTasteChange,
  onOpenRestaurant,
  restaurants,
  recommendations,
  axes,
  quadrants,
  onMapBackgroundClick,
  onCoachActiveChange,
  loading = false,
}: TasteMapProps) {
  const shellRef = useRef<HTMLDivElement>(null)
  const [loadStep, setLoadStep] = useState(0)
  const [coachStep, setCoachStep] = useState(0)
  const [mapZoom, setMapZoom] = useState(MIN_MAP_ZOOM)
  const [panOffset, setPanOffset] = useState<PanOffset>({ x: 0, y: 0 })
  const [panning, setPanning] = useState(false)
  const [draggingUser, setDraggingUser] = useState(false)
  const panStartRef = useRef<{
    pointerId: number
    clientX: number
    clientY: number
    offset: PanOffset
    moved: boolean
  } | null>(null)
  const userDragPointerRef = useRef<number | null>(null)
  const [mapPixelWidth, setMapPixelWidth] = useState(1000)
  const recommendationIds = new Set(recommendations.map((restaurant) => restaurant.id))
  const projectPoint = ({ x, y }: { x: number; y: number }) => ({
    x: 500 + (x - 500) * mapZoom + panOffset.x,
    y: 500 + (y - 500) * mapZoom + panOffset.y,
  })
  const userPoint = projectPoint(screenPoint(taste))
  const nodeHitRadius = Math.max(10, 24 * 1000 / mapPixelWidth)

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
    setPanOffset((current) => clampPan(current, mapZoom, mapPixelWidth))
  }, [mapPixelWidth, mapZoom])

  useEffect(() => {
    if (loading) {
      setCoachStep(0)
      setLoadStep(0)
      const first = window.setTimeout(() => setLoadStep(1), 500)
      const second = window.setTimeout(() => setLoadStep(2), 900)
      return () => { window.clearTimeout(first); window.clearTimeout(second) }
    }
    const timer = window.setTimeout(() => setCoachStep(1), 700)
    return () => window.clearTimeout(timer)
  }, [loading])

  useEffect(() => {
    onCoachActiveChange?.(coachStep > 0 && !loading)
  }, [coachStep, loading, onCoachActiveChange])

  const horizontal = taste[0] < -.15 ? axes.x.neg : taste[0] > .15 ? axes.x.pos : `${axes.x.neg}·${axes.x.pos}`
  const vertical = taste[1] > .15 ? axes.y.pos : taste[1] < -.15 ? axes.y.neg : `${axes.y.neg}·${axes.y.pos}`
  const bubble = `${horizontal} · ${vertical}`
  const bubbleWidth = [...bubble].reduce((width, character) => (
    width + (character === ' ' ? 4 : character === '·' ? 5 : 12)
  ), 10)
  const updateZoom = (nextZoom: number) => {
    setMapZoom(nextZoom)
    setPanOffset((current) => clampPan(current, nextZoom, mapPixelWidth))
  }
  const startPan = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return
    panStartRef.current = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      offset: panOffset,
      moved: false,
    }
    if (mapZoom <= MIN_MAP_ZOOM) return
    event.preventDefault()
    setPanning(true)
    shellRef.current?.setPointerCapture(event.pointerId)
  }
  const startUserDrag = (event: ReactPointerEvent<SVGGElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setDraggingUser(true)
    userDragPointerRef.current = event.pointerId
    shellRef.current?.setPointerCapture(event.pointerId)
  }
  const moveGesture = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (userDragPointerRef.current === event.pointerId && shellRef.current) {
      const rect = shellRef.current.getBoundingClientRect()
      const scale = 1000 / rect.width
      const pointerX = (event.clientX - rect.left) * scale
      const pointerY = (event.clientY - rect.top) * scale
      onTasteChange([
        clamp((pointerX - 500 - panOffset.x) / (400 * mapZoom), -1.15, 1.15),
        clamp(-(pointerY - 500 - panOffset.y) / (400 * mapZoom), -1.15, 1.15),
      ])
      return
    }

    const start = panStartRef.current
    if (!start || start.pointerId !== event.pointerId) return
    const deltaX = event.clientX - start.clientX
    const deltaY = event.clientY - start.clientY
    if (Math.hypot(deltaX, deltaY) > 4) start.moved = true
    if (mapZoom <= MIN_MAP_ZOOM) return
    const nextPan = {
      x: start.offset.x + deltaX,
      y: start.offset.y + deltaY,
    }
    setPanOffset(clampPan(nextPan, mapZoom, mapPixelWidth))
  }
  const stopGesture = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (userDragPointerRef.current === event.pointerId) {
      setDraggingUser(false)
      userDragPointerRef.current = null
      if (shellRef.current?.hasPointerCapture(event.pointerId)) {
        shellRef.current.releasePointerCapture(event.pointerId)
      }
      return
    }

    const start = panStartRef.current
    if (!start || start.pointerId !== event.pointerId) return
    setPanning(false)
    panStartRef.current = null
    if (shellRef.current?.hasPointerCapture(event.pointerId)) {
      shellRef.current.releasePointerCapture(event.pointerId)
    }
    if (!start.moved && event.type === 'pointerup') onMapBackgroundClick()
  }
  const finishCoach = () => setCoachStep(0)
  const advanceCoach = () => {
    if (coachStep < 3) {
      setCoachStep((current) => current + 1)
      return
    }
    finishCoach()
  }
  const coachScale = 1000 / mapPixelWidth
  const zoomSpotlight = {
    x: 1000 - 68 * coachScale,
    y: 1000 - 156 * coachScale,
    width: 60 * coachScale,
    height: 104 * coachScale,
  }
  const coachCaptionHeight = (mapPixelWidth <= 640 ? 140 : 128) * coachScale
  const coachCaptionWidth = Math.min(mapPixelWidth <= 640 ? 240 : 280, mapPixelWidth - 32) * coachScale
  const coachPadding = 16 * coachScale
  const coachGap = 24 * coachScale
  const zoomControlsLeft = 1000 - 56 * coachScale
  const zoomControlsCenterY = 1000 - 104 * coachScale
  const userSpotlightRadius = coachStep === 2 ? 120 : 48
  const captionBelowUser = userPoint.y + userSpotlightRadius + coachGap
  const userCaptionTop = captionBelowUser + coachCaptionHeight <= 1000 - coachPadding
    ? captionBelowUser
    : userPoint.y - userSpotlightRadius - coachGap - coachCaptionHeight
  const clampCoachLeft = (left: number) => clamp(
    left,
    (coachCaptionWidth / 2 + coachPadding) / 10,
    100 - (coachCaptionWidth / 2 + coachPadding) / 10,
  )
  const clampCoachTop = (top: number) => clamp(
    top,
    coachPadding / 10,
    (1000 - coachPadding - coachCaptionHeight) / 10,
  )
  const coachCaptionPosition = coachStep === 3
    ? {
        left: clampCoachLeft((zoomControlsLeft - coachPadding - coachCaptionWidth / 2) / 10),
        top: clampCoachTop((zoomControlsCenterY - coachCaptionHeight / 2 - 20 * coachScale) / 10),
      }
    : {
        left: clampCoachLeft(userPoint.x / 10),
        top: clampCoachTop(userCaptionTop / 10),
      }

  return (
    <MapShell
      ref={shellRef}
      $canPan={mapZoom > MIN_MAP_ZOOM}
      $panning={panning}
      onPointerDown={startPan}
      onPointerMove={moveGesture}
      onPointerUp={stopGesture}
      onPointerCancel={stopGesture}
    >
      <MapSvg viewBox="0 0 1000 1000" aria-label={`${axes.x.neg}와 ${axes.x.pos}, ${axes.y.neg}와 ${axes.y.pos}에 따른 식당 취향 지도`}>
        <MapGrid $zoom={mapZoom} $panX={panOffset.x} $panY={panOffset.y} $panning={panning}>
          <MapWash width="500" height="500" $color="var(--violet)" />
          <MapWash x="500" width="500" height="500" $color="var(--orange)" />
          <MapWash y="500" width="500" height="500" $color="var(--green)" />
          <MapWash x="500" y="500" width="500" height="500" $color="var(--pink)" />
          <AxisLine d="M0 500H1000M500 0V1000" />
        </MapGrid>

        {restaurants.map((restaurant, index) => {
          const point = projectPoint(screenPoint(restaurant.position))
          const recommended = recommendationIds.has(restaurant.id)
          const confidence = restaurant.confidence
          const showName = recommended || confidence !== 'high'
          const pointColor = getPointColor(restaurant.position)
          const opacity = recommended ? 1 : confidence === 'low' ? .78 : .45
          const nameY = recommended ? 28 : 26
          const statusLabel = confidence === 'low' ? '후기 적음' : '후기 충분'
          return (
            <RestaurantNode
              key={restaurant.id}
              $opacity={opacity}
              $delay={index * 20}
              $panning={panning}
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
              <NodeContent>
                <NodeMagnet>
                  {recommended && <NodeRing r={confidence === 'low' ? 20 : 15} $color={pointColor} />}
                  {confidence === 'high' && <NodeShape r={recommended ? 9 : 6} $color={pointColor} />}
                  {confidence === 'low' && <NodeDiamond d={recommended ? 'M0 -12L12 0L0 12L-12 0Z' : 'M0 -10L10 0L0 10L-10 0Z'} $color={pointColor} />}
                </NodeMagnet>
                {showName && <NodeName y={nameY} textAnchor="middle" $low={confidence === 'low'}>{restaurant.name}</NodeName>}
              </NodeContent>
            </RestaurantNode>
          )
        })}

        <TastePoint
          $panning={panning}
          $dragging={draggingUser}
          transform={`translate(${userPoint.x} ${userPoint.y})`}
          onPointerDown={startUserDrag}
          role="slider"
          aria-label="내 취향 좌표"
          aria-valuetext={bubble}
        >
          <TasteHitArea r="30" />
          <TasteContent>
            <TasteHalo r="30" />
            <TasteOutline r="15" />
            <TasteCore r="9" />
            <circle r="22" fill="transparent" />
            <g transform="translate(0 34)">
              <TasteBubble x={-bubbleWidth / 2} y="-13" width={bubbleWidth} height="26" rx="8" />
              <TasteBubbleLabel y="4" textAnchor="middle">{bubble}</TasteBubbleLabel>
            </g>
          </TasteContent>
        </TastePoint>
      </MapSvg>

      <ZoomControls aria-label="지도 확대 축소" onPointerDown={(event) => event.stopPropagation()}>
        <button
          type="button"
          aria-label="지도 확대"
          disabled={mapZoom >= MAX_MAP_ZOOM}
          onClick={() => updateZoom(Math.min(MAX_MAP_ZOOM, mapZoom * ZOOM_STEP))}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="지도 축소"
          disabled={mapZoom <= MIN_MAP_ZOOM}
          onClick={() => updateZoom(Math.max(MIN_MAP_ZOOM, mapZoom / ZOOM_STEP))}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14" />
          </svg>
        </button>
      </ZoomControls>

      <LabelLayer aria-hidden="true">
        <AxisLabel $position="left">← {axes.x.neg}</AxisLabel><AxisLabel $position="right">{axes.x.pos} →</AxisLabel>
        <AxisLabel $position="top">{axes.y.pos} ↑</AxisLabel><AxisLabel $position="bottom">↓ {axes.y.neg}</AxisLabel>
        <Quadrant $position="top-left" $color="var(--violet)">{formatQuadrantLabel(quadrants[2])}</Quadrant><Quadrant $position="top-right" $color="var(--orange)">{formatQuadrantLabel(quadrants[3])}</Quadrant>
        <Quadrant $position="bottom-left" $color="var(--green)">{formatQuadrantLabel(quadrants[0])}</Quadrant><Quadrant $position="bottom-right" $color="var(--pink)">{formatQuadrantLabel(quadrants[1])}</Quadrant>
      </LabelLayer>

      <ConfidenceLegend aria-label="노드 모양 안내">
        <span><LegendIcon $diamond={false} />후기 충분</span>
        <span><LegendIcon $diamond />후기 적음</span>
      </ConfidenceLegend>
      {loading && (
        <Loading>
          <span>{[
            '취향 지도를 준비하고 있어요',
            `${restaurants.length}곳의 자리를 확인했어요`,
            <>이 안에서도 갈리네요 —<br />{axes.y.neg} ↔ {axes.y.pos}</>,
          ][loadStep]}</span>
          <div><i /></div>
        </Loading>
      )}
      {coachStep > 0 && !loading && (
        <Coach
          role="dialog"
          aria-modal="true"
          aria-label={`취향 지도 사용 안내 ${coachStep}/3`}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <svg viewBox="0 0 1000 1000" aria-hidden="true">
            <defs>
              <mask id="taste-coach-hole">
                <rect width="1000" height="1000" fill="white" />
                {coachStep === 3 ? (
                  <rect {...zoomSpotlight} rx={12 * coachScale} fill="black" />
                ) : (
                  <circle cx={userPoint.x} cy={userPoint.y} r={coachStep === 2 ? 120 : 48} fill="black" />
                )}
              </mask>
            </defs>
            <rect width="1000" height="1000" fill="var(--background)" opacity=".76" mask="url(#taste-coach-hole)" />
            {coachStep === 3 ? (
              <rect {...zoomSpotlight} rx={12 * coachScale} fill="none" stroke="var(--accent)" strokeWidth={coachScale} opacity=".7" />
            ) : (
              <circle cx={userPoint.x} cy={userPoint.y} r={coachStep === 2 ? 120 : 48} fill="none" stroke="var(--accent)" strokeWidth="1" opacity=".7" />
            )}
          </svg>
          <CoachCaption $left={coachCaptionPosition.left} $top={coachCaptionPosition.top}>
            <span>{coachStep}/3</span>
            <strong>{[
              '',
              '노란 점이 내 취향 위치예요',
              '가까운 식당일수록 취향에 잘 맞아요',
              '노란 점을 옮기거나 지도를 확대해보세요',
            ][coachStep]}</strong>
            <CoachActions>
              <CoachSkip type="button" onClick={finishCoach}>건너뛰기</CoachSkip>
              <CoachNext type="button" onClick={advanceCoach}>{coachStep === 3 ? '시작하기' : '다음'}</CoachNext>
            </CoachActions>
          </CoachCaption>
        </Coach>
      )}
    </MapShell>
  )
}

const haloBreathe = keyframes`0%,100%{opacity:.18;transform:scale(.88)}50%{opacity:.3;transform:scale(1.12)}`
const loadingLine = keyframes`from{transform:scaleX(0)}to{transform:scaleX(1)}`
const MapShell = styled.div<{ $canPan: boolean; $panning: boolean }>`
  position: relative; flex: none; overflow: hidden; width: 100%; aspect-ratio: 1; border: 0; border-radius: 0;
  background: var(--background); cursor: ${({ $canPan, $panning }) => $panning ? 'grabbing' : $canPan ? 'grab' : 'default'}; touch-action: none;
`
const MapSvg = styled.svg`display: block; width: 100%; height: 100%; user-select: none;`
const MapGrid = styled.g<{ $zoom: number; $panX: number; $panY: number; $panning: boolean }>`
  transform-box: view-box;
  transform-origin: center;
  transform: translate(${({ $panX }) => $panX}px, ${({ $panY }) => $panY}px) scale(${({ $zoom }) => $zoom});
  transition: ${({ $panning }) => $panning ? 'none' : 'transform 360ms cubic-bezier(.22,1,.36,1)'};
  will-change: transform;
`
const MapWash = styled.rect<{ $color: string }>`fill: ${({ $color }) => $color}; opacity: .035;`
const AxisLine = styled.path`fill: none; stroke: var(--line); stroke-width: 1.4; stroke-dasharray: 6 6;`
const RestaurantNode = styled.g<{ $opacity: number; $delay: number; $panning: boolean }>`
  cursor: pointer; opacity: ${({ $opacity }) => $opacity}; transition-delay: ${({ $delay }) => $delay}ms;
  transition: ${({ $panning }) => $panning ? 'opacity 420ms cubic-bezier(.4,0,.2,1)' : 'transform 360ms cubic-bezier(.22,1,.36,1), opacity 420ms cubic-bezier(.4,0,.2,1)'};
  &:hover { opacity: 1; }
  &:focus-visible { outline: none; }
  &:focus-visible > circle:first-of-type { stroke: var(--accent); stroke-width: 3; }
`
const NodeHitArea = styled.circle`
  fill: transparent; pointer-events: all;
`
const NodeContent = styled.g`pointer-events: none;`
const NodeMagnet = styled.g`transition: transform 200ms cubic-bezier(.4,0,.2,1);`
const NodeRing = styled.circle<{ $color: string }>`fill: none; stroke: ${({ $color }) => $color}; stroke-width: 1.2; opacity: .35;`
const NodeShape = styled.circle<{ $color: string }>`fill: ${({ $color }) => $color}; stroke: none;`
const NodeDiamond = styled.path<{ $color: string }>`fill: var(--background); stroke: ${({ $color }) => $color}; stroke-width: 2;`
const NodeName = styled.text<{ $low: boolean }>`
  fill: var(--ink); font-size: ${({ $low }) => $low ? '13px' : '12px'}; font-weight: ${({ $low }) => $low ? 500 : 400};
  letter-spacing: -.01em; paint-order: stroke; stroke: var(--background); stroke-width: 5px; stroke-linejoin: round;
`
const TastePoint = styled.g<{ $panning: boolean; $dragging: boolean }>`
  cursor: ${({ $dragging }) => $dragging ? 'grabbing' : 'grab'};
  outline: none;
  transition: ${({ $panning, $dragging }) => $panning || $dragging ? 'none' : 'transform 360ms cubic-bezier(.22,1,.36,1)'};
`
const TasteHitArea = styled.circle`fill: transparent; pointer-events: all;`
const TasteContent = styled.g`pointer-events: none;`
const TasteHalo = styled.circle`fill: #ffd84a; opacity:.34; transform-box: fill-box; transform-origin: center; animation: ${haloBreathe} 2.4s ease-in-out infinite;`
const TasteOutline = styled.circle`fill:#fff4a8;stroke:#2f2500;stroke-width:3;filter:drop-shadow(0 2px 10px rgba(0,0,0,.8));`
const TasteCore = styled.circle`fill:#ffd400;stroke:#3a2a00;stroke-width:1.5;`
const TasteBubble = styled.rect`fill: var(--quote); stroke: #3a3733; stroke-width: 1;`
const TasteBubbleLabel = styled.text`fill: var(--ink); font-size: 12px; font-weight: 400; letter-spacing: -.01em;`
const ZoomControls = styled.div`
  position: absolute;
  z-index: 20;
  right: 20px;
  bottom: 64px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 1px solid #4a4339;
    border-radius: 8px;
    color: var(--ink);
    background: #1d1b18;
    cursor: pointer;
    box-shadow: 0 8px 22px rgba(0,0,0,.34), 0 0 0 1px rgba(255,255,255,.03) inset;
    transition: background 150ms cubic-bezier(.4,0,.2,1), border-color 150ms cubic-bezier(.4,0,.2,1), color 150ms cubic-bezier(.4,0,.2,1), transform 150ms cubic-bezier(.4,0,.2,1);
  }
  svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; }
  button:hover:not(:disabled) { color: #ffd84a; background: #24211d; border-color: #6a5a42; }
  button:active:not(:disabled) { transform: scale(.96); }
  button:disabled { color: #756f66; background: #151412; border-color: #2d2a25; cursor: default; opacity: .78; box-shadow: none; }
`
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
const CoachCaption = styled.div<{ $left: number; $top: number }>`
  position: absolute; left: ${({ $left }) => $left}%; top: ${({ $top }) => $top}%; display: flex; flex-direction: column; align-items: center;
  width: min(280px, calc(100% - 32px)); transform: translateX(-50%); text-align: center;
  span { margin-bottom: 8px; color: var(--sub); font-size: 12px; }
  strong { max-width: 100%; color: var(--ink); font-size: 20px; font-weight: 500; line-height: 1.45; word-break: keep-all; overflow-wrap: anywhere; }
  @media (max-width: 640px) { width: min(240px, calc(100% - 32px)); strong { font-size: 17px; } }
`
const CoachActions = styled.div`
  display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 20px;
`
const CoachSkip = styled.button`
  height: 40px; padding: 0 16px; border: 1px solid var(--line); border-radius: 8px;
  color: var(--sub); background: rgba(22, 21, 20, .9); cursor: pointer; font-size: 13px;
  &:hover { border-color: var(--muted); color: var(--ink); background: var(--quote); }
`
const CoachNext = styled.button`
  height: 40px; padding: 0 20px; border: 0; border-radius: 8px; color: var(--background);
  background: var(--accent); cursor: pointer; font-size: 14px; font-weight: 600;
`
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
