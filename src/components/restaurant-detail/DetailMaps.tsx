import { restaurants } from '../../mocks/restaurants'
import type { Restaurant } from '../../types/restaurant'

const colors = ['#7f77dd', '#d85a30', '#1d9e75', '#d4537e']
const toPoint = ([x, y]: Restaurant['position']) => ({ x: ((x + 1) / 2) * 100, y: ((1 - y) / 2) * 100 })
const getColor = ([x, y]: Restaurant['position']) => colors[y > 0 ? (x < 0 ? 0 : 1) : (x < 0 ? 2 : 3)]

export function TastePositionMap({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="detail-map-card">
      <svg viewBox="0 0 100 100" role="img" aria-label={`${restaurant.name}의 취향 지도 위치`}>
        <rect width="100" height="100" className="detail-map-base" />
        <path d="M0 50H100M50 0V100" className="detail-map-axis" />
        {restaurants.map((item) => {
          const point = toPoint(item.position)
          const active = item.id === restaurant.id
          return (
            <circle
              key={item.id}
              cx={point.x}
              cy={point.y}
              r={active ? 1.8 : 0.75}
              fill={getColor(item.position)}
              className={active ? 'detail-map-active' : 'detail-map-dot'}
            />
          )
        })}
      </svg>
      <p>{restaurant.position[0] < 0 ? '조용한' : '활기찬'} {restaurant.position[1] < 0 ? '혼밥' : '모임'} 군집</p>
    </div>
  )
}

export function LocationMap({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="detail-map-card">
      <div className="location-map" role="img" aria-label={`${restaurant.address} 위치 지도`}>
        <span className="road road-horizontal" />
        <span className="road road-vertical" />
        <span className="road road-diagonal" />
        <span className="location-pin" />
      </div>
      <p>{restaurant.address}</p>
    </div>
  )
}
