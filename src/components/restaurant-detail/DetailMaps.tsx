import { restaurants } from '../../mocks/restaurants'
import type { Restaurant } from '../../types/restaurant'

const colors = ['#a99bf7', '#f5946e', '#63d5aa', '#f28fb4']
const mapWidth = 280
const mapHeight = 160
const mapPadding = 20
const toPoint = ([x, y]: Restaurant['position']) => ({
  x: mapPadding + ((x + 1) / 2) * (mapWidth - mapPadding * 2),
  y: mapPadding + ((1 - y) / 2) * (mapHeight - mapPadding * 2),
})
const getColor = ([x, y]: Restaurant['position']) => colors[y > 0 ? (x < 0 ? 0 : 1) : (x < 0 ? 2 : 3)]

export function TastePositionMap({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="detail-map-card">
      <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} role="img" aria-label={`${restaurant.name}의 취향 지도 위치`}>
        <rect width={mapWidth} height={mapHeight} className="detail-map-base" />
        <rect width={mapWidth / 2} height={mapHeight / 2} fill={colors[0]} className="detail-map-wash" />
        <rect x={mapWidth / 2} width={mapWidth / 2} height={mapHeight / 2} fill={colors[1]} className="detail-map-wash" />
        <rect y={mapHeight / 2} width={mapWidth / 2} height={mapHeight / 2} fill={colors[2]} className="detail-map-wash" />
        <rect x={mapWidth / 2} y={mapHeight / 2} width={mapWidth / 2} height={mapHeight / 2} fill={colors[3]} className="detail-map-wash" />
        <path d={`M0 ${mapHeight / 2}H${mapWidth}M${mapWidth / 2} 0V${mapHeight}`} className="detail-map-axis" />
        {restaurants.map((item) => {
          const point = toPoint(item.position)
          const active = item.id === restaurant.id
          if (active) return null
          return (
            <circle
              key={item.id}
              cx={point.x}
              cy={point.y}
              r={2.5}
              fill={getColor(item.position)}
              className="detail-map-dot"
            />
          )
        })}
        <circle cx={toPoint(restaurant.position).x} cy={toPoint(restaurant.position).y} r="12" fill="none" stroke={getColor(restaurant.position)} className="detail-map-ring" />
        {restaurant.hidden ? (
          <path
            d="M0 -6L1.7 -1.7L6 0L1.7 1.7L0 6L-1.7 1.7L-6 0L-1.7 -1.7Z"
            transform={`translate(${toPoint(restaurant.position).x} ${toPoint(restaurant.position).y})`}
            fill="none"
            stroke={getColor(restaurant.position)}
            className="detail-map-unrecorded"
          />
        ) : restaurant.reviews < 40 ? (
          <path
            d="M0 -6L6 0L0 6L-6 0Z"
            transform={`translate(${toPoint(restaurant.position).x} ${toPoint(restaurant.position).y})`}
            fill="#0d0c0b"
            stroke={getColor(restaurant.position)}
            className="detail-map-low"
          />
        ) : (
          <circle cx={toPoint(restaurant.position).x} cy={toPoint(restaurant.position).y} r="5" fill={getColor(restaurant.position)} className="detail-map-active" />
        )}
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
