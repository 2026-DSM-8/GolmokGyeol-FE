import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from 'react'
import { restaurants } from '../../mocks/restaurants'
import type { Restaurant, TastePoint } from '../../types/restaurant'

type TasteMapProps = {
  taste: TastePoint
  onTasteChange: (point: TastePoint) => void
  onOpenRestaurant: (restaurant: Restaurant) => void
  recommendations: Restaurant[]
  loading?: boolean
}

type DragMode = 'pan' | 'user' | null

const getPointClass = ([x, y]: TastePoint) => (
  y >= 0 ? (x < 0 ? 'point-violet' : 'point-orange') : (x < 0 ? 'point-green' : 'point-pink')
)

const screenPoint = ([x, y]: TastePoint, zoom: number, pan: TastePoint) => ({
  x: 500 + x * 400 * zoom + pan[0],
  y: 500 - y * 400 * zoom + pan[1],
})

const confidenceFor = (restaurant: Restaurant) => {
  if (restaurant.hidden) return 'none'
  if (restaurant.reviews < 40) return 'low'
  return 'high'
}

export function TasteMap({ taste, onTasteChange, onOpenRestaurant, recommendations, loading = false }: TasteMapProps) {
  const shellRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState<TastePoint>([0, 0])
  const [dragging, setDragging] = useState<DragMode>(null)
  const [loadStep, setLoadStep] = useState(0)
  const [coach, setCoach] = useState(0)
  const recommendationIds = new Set(recommendations.map((restaurant) => restaurant.id))
  const userPoint = screenPoint(taste, zoom, pan)

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

  const changeZoom = (nextZoom: number) => setZoom(Math.min(4, Math.max(.6, nextZoom)))
  const onWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault()
    changeZoom(zoom * (1 - event.deltaY * .0015))
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (loading) return
    setDragging('pan')
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onUserPointerDown = (event: ReactPointerEvent<SVGGElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setDragging('user')
    shellRef.current?.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging || !shellRef.current) return
    const rect = shellRef.current.getBoundingClientRect()
    const scale = 1000 / rect.width
    if (dragging === 'pan') {
      setPan(([x, y]) => [x + event.movementX * scale, y + event.movementY * scale])
      return
    }
    const pointerX = (event.clientX - rect.left) * scale
    const pointerY = (event.clientY - rect.top) * scale
    onTasteChange([
      Math.min(1.15, Math.max(-1.15, (pointerX - 500 - pan[0]) / (400 * zoom))),
      Math.min(1.15, Math.max(-1.15, -(pointerY - 500 - pan[1]) / (400 * zoom))),
    ])
  }

  const stopDragging = () => setDragging(null)
  const finishCoach = () => setCoach(0)
  const advanceCoach = () => {
    if (coach < 2) {
      setCoach(coach + 1)
      return
    }
    setCoach(3)
    onTasteChange([.5, taste[1]])
    window.setTimeout(finishCoach, 1100)
  }
  const budget = taste[0] < -.15 ? '저렴' : taste[0] > .15 ? '좀 비쌈' : '중간 가격'
  const pace = taste[1] > .15 ? '오래 머물기' : taste[1] < -.15 ? '후딱 먹기' : '적당히'
  const bubble = `${budget} · ${pace}`
  const bubbleWidth = bubble.length * 12 + 16

  return (
    <div
      ref={shellRef}
      className={`taste-map-shell ${dragging ? `is-dragging is-${dragging}` : ''}`}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      <svg className="taste-map" viewBox="0 0 1000 1000" aria-label="가격과 머무는 시간에 따른 식당 취향 지도">
        <rect width="500" height="500" className="map-wash point-violet" />
        <rect x="500" width="500" height="500" className="map-wash point-orange" />
        <rect y="500" width="500" height="500" className="map-wash point-green" />
        <rect x="500" y="500" width="500" height="500" className="map-wash point-pink" />
        <path d="M0 500H1000M500 0V1000" className="axis-line" />

        {restaurants.map((restaurant, index) => {
          const point = screenPoint(restaurant.position, zoom, pan)
          const recommended = recommendationIds.has(restaurant.id)
          const confidence = confidenceFor(restaurant)
          const showName = recommended || zoom >= 1.35
          const pointClass = getPointClass(restaurant.position)
          const opacity = recommended ? 1 : .45
          const transitionDelay = `${index * 20}ms`
          const distance = Math.hypot(restaurant.position[0] - taste[0], restaurant.position[1] - taste[1])
          const magnet = dragging === 'user' ? 1 + Math.max(0, .35 * (1 - distance / .5)) : 1
          return (
            <g
              key={restaurant.id}
              className={`prototype-node ${recommended ? 'is-recommended' : ''}`}
              transform={`translate(${point.x} ${point.y})`}
              style={{ opacity, transitionDelay }}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => { event.stopPropagation(); onOpenRestaurant(restaurant) }}
              role="button"
              tabIndex={0}
              aria-label={`${restaurant.name} 상세 보기`}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') onOpenRestaurant(restaurant)
              }}
            >
              <g transform={`scale(${magnet})`} className="node-magnet">
                {recommended && <circle r="15" className={`node-ring ${pointClass}`} />}
                {confidence === 'high' && <circle r={recommended ? 9 : 6} className={`node-shape ${pointClass}`} />}
                {confidence === 'low' && <path d={recommended ? 'M0 -9L9 0L0 9L-9 0Z' : 'M0 -7L7 0L0 7L-7 0Z'} className={`node-shape node-diamond ${pointClass}`} />}
                {confidence === 'none' && <path d="M0 -9L2.6 -2.6L9 0L2.6 2.6L0 9L-2.6 2.6L-9 0L-2.6 -2.6Z" className={`node-shape node-star ${pointClass}`} />}
              </g>
              {showName && <text y={recommended ? 28 : 24} textAnchor="middle" className="prototype-node-name">{restaurant.name}</text>}
              {zoom >= 2.3 && <text y={recommended ? 44 : 40} textAnchor="middle" className="prototype-node-category">{restaurant.category}</text>}
            </g>
          )
        })}

        <g className="taste-point" transform={`translate(${userPoint.x} ${userPoint.y})`} onPointerDown={onUserPointerDown} role="slider" tabIndex={0} aria-label="내 취향 좌표">
          <circle className="taste-halo" r="20" />
          <circle className="taste-core" r="8" />
          <circle r="15" fill="transparent" />
          <g transform="translate(0 34)">
            <rect x={-bubbleWidth / 2} y="-13" width={bubbleWidth} height="26" rx="8" className="taste-bubble" />
            <text y="4" textAnchor="middle" className="taste-bubble-label">{bubble}</text>
          </g>
        </g>
      </svg>

      <div className="map-label-layer" aria-hidden="true">
        <span className="map-axis-left">← 저렴</span><span className="map-axis-right">비쌈 →</span>
        <span className="map-axis-top">오래 머물기 ↑</span><span className="map-axis-bottom">↓ 후딱 먹기</span>
        <span className="map-quad map-quad-violet">느긋한 밥집</span><span className="map-quad map-quad-orange">카페 같은 곳</span>
        <span className="map-quad map-quad-green">가성비 혼밥</span><span className="map-quad map-quad-pink">퀄리티 혼밥</span>
      </div>

      <div className="map-confidence-legend" aria-label="노드 모양 안내">
        <span><i className="legend-circle" />후기 충분</span>
        <span><i className="legend-diamond" />후기 적음</span>
        <span><i className="legend-star">✦</i>기록 없음</span>
      </div>
      <div className="map-zoom-controls">
        <button onPointerDown={(event) => event.stopPropagation()} onClick={() => changeZoom(zoom * 1.25)} aria-label="확대">+</button>
        <button onPointerDown={(event) => event.stopPropagation()} onClick={() => changeZoom(zoom / 1.25)} aria-label="축소">−</button>
      </div>

      {loading && (
        <div className="map-loading">
          <span>{[
            '조용한 자리를 찾고 계시는군요',
            '은행동에서 23곳을 찾았어요',
            <>이 안에서도 갈리네요 —<br />후딱 먹기 ↔ 오래 머물기</>,
          ][loadStep]}</span>
          <div><i /></div>
        </div>
      )}

      {coach > 0 && !loading && (
        <div className="map-coach" onPointerDown={(event) => event.stopPropagation()}>
          <svg viewBox="0 0 1000 1000" aria-hidden="true">
            <defs><mask id="taste-coach-hole"><rect width="1000" height="1000" fill="white" /><circle cx={userPoint.x} cy={userPoint.y} r={coach === 2 ? 120 : 46} fill="black" /></mask></defs>
            <rect width="1000" height="1000" fill="var(--background)" opacity=".7" mask="url(#taste-coach-hole)" />
            <circle cx={userPoint.x} cy={userPoint.y} r={coach === 2 ? 120 : 46} fill="none" stroke="var(--accent)" strokeWidth="1" opacity=".6" />
          </svg>
          <div className="coach-caption" style={{ left: `${Math.max(18, Math.min(82, userPoint.x / 10))}%`, top: `${Math.max(18, Math.min(76, userPoint.y / 10 + (coach === 2 ? 15 : 9)))}%` }}>
            <strong>{coach === 1 ? '이게 당신이에요' : coach === 2 ? '가까울수록 취향에 맞아요' : '점을 살살 밀어보세요'}</strong>
            {coach < 3 && <button onClick={advanceCoach}>{coach === 2 ? '밀어볼게요' : '다음'}</button>}
          </div>
          {coach < 3 && <button className="coach-skip" onClick={finishCoach}>건너뛰기</button>}
        </div>
      )}
    </div>
  )
}
