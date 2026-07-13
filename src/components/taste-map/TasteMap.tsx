import { useRef } from 'react'
import { useTasteDrag } from '../../hooks/useTasteDrag'
import { restaurants } from '../../mocks/restaurants'
import type { Restaurant, TastePoint } from '../../types/restaurant'

type TasteMapProps = {
  taste: TastePoint
  onTasteChange: (point: TastePoint) => void
  onOpenRestaurant: (restaurant: Restaurant) => void
  recommendations: Restaurant[]
}

const toPoint = ([x, y]: TastePoint) => ({ x: ((x + 1) / 2) * 1000, y: ((1 - y) / 2) * 1000 })
const getPointClass = ([x, y]: TastePoint) => (
  y > 0 ? (x < 0 ? 'point-violet' : 'point-orange') : (x < 0 ? 'point-green' : 'point-pink')
)

export function TasteMap({ taste, onTasteChange, onOpenRestaurant, recommendations }: TasteMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const drag = useTasteDrag(svgRef, taste, onTasteChange)
  const recommendationIds = new Set(recommendations.map((restaurant) => restaurant.id))
  const userPoint = toPoint(taste)

  return (
    <div className={`taste-map-shell ${drag.isDragging ? 'is-dragging' : ''}`}>
      <svg
        ref={svgRef}
        className="taste-map"
        viewBox="0 0 1000 1000"
        onPointerMove={drag.onPointerMove}
        onPointerUp={drag.onPointerEnd}
        onPointerCancel={drag.onPointerEnd}
        aria-label="식당 취향 지도. 내 취향 점을 끌어 추천을 바꿀 수 있습니다."
      >
        <rect width="1000" height="1000" className="map-base" />
        <path d="M0 500H1000M500 0V1000" className="axis-line" />
        <text x="20" y="468" className="axis-label">← 조용함</text>
        <text x="980" y="468" textAnchor="end" className="axis-label">활기참 →</text>
        <text x="514" y="38" className="axis-label">여럿이 ↑</text>
        <text x="514" y="970" className="axis-label">혼자 ↓</text>
        <text x="22" y="38" className="quadrant-label point-violet">조용한 모임</text>
        <text x="978" y="38" textAnchor="end" className="quadrant-label point-orange">왁자지껄</text>
        <text x="22" y="972" className="quadrant-label point-green">조용한 혼밥</text>
        <text x="978" y="972" textAnchor="end" className="quadrant-label point-pink">혼자의 활기</text>
        {restaurants.map((restaurant) => {
          const point = toPoint(restaurant.position)
          const recommended = recommendationIds.has(restaurant.id)
          return (
            <circle
              key={restaurant.id}
              cx={point.x}
              cy={point.y}
              r={recommended ? 12 : 8}
              className={`restaurant-point ${getPointClass(restaurant.position)} ${recommended ? 'recommended' : ''}`}
              onClick={() => onOpenRestaurant(restaurant)}
              role="button"
              tabIndex={0}
              aria-label={`${restaurant.name} 상세 보기`}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') onOpenRestaurant(restaurant)
              }}
            />
          )
        })}
        <g
          className="taste-point"
          transform={`translate(${userPoint.x} ${userPoint.y})`}
          onPointerDown={drag.onPointerDown}
          onKeyDown={drag.onKeyDown}
          role="slider"
          tabIndex={0}
          aria-label="내 취향 좌표"
          aria-valuetext={`${taste[0].toFixed(2)}, ${taste[1].toFixed(2)}`}
        >
          <circle className="taste-halo" r="34" />
          <circle className="taste-core" r="16" />
        </g>
      </svg>
    </div>
  )
}
