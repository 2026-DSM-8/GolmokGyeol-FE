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
    <MapCard>
      <MapSvg viewBox={`0 0 ${mapWidth} ${mapHeight}`} role="img" aria-label={`${restaurant.name}의 취향 지도 위치`}>
        <MapBase width={mapWidth} height={mapHeight} />
        <MapWash width={mapWidth / 2} height={mapHeight / 2} fill={colors[0]} />
        <MapWash x={mapWidth / 2} width={mapWidth / 2} height={mapHeight / 2} fill={colors[1]} />
        <MapWash y={mapHeight / 2} width={mapWidth / 2} height={mapHeight / 2} fill={colors[2]} />
        <MapWash x={mapWidth / 2} y={mapHeight / 2} width={mapWidth / 2} height={mapHeight / 2} fill={colors[3]} />
        <MapAxis d={`M0 ${mapHeight / 2}H${mapWidth}M${mapWidth / 2} 0V${mapHeight}`} />
        {restaurants.map((item) => {
          const point = toPoint(item.position)
          const active = item.id === restaurant.id
          if (active) return null
          return (
            <MapDot
              key={item.id}
              cx={point.x}
              cy={point.y}
              r={2.5}
              fill={getColor(item.position)}
            />
          )
        })}
        <MapRing cx={toPoint(restaurant.position).x} cy={toPoint(restaurant.position).y} r="12" fill="none" stroke={getColor(restaurant.position)} />
        {restaurant.reviews < 40 ? (
          <LowReviewMarker
            d="M0 -6L6 0L0 6L-6 0Z"
            transform={`translate(${toPoint(restaurant.position).x} ${toPoint(restaurant.position).y})`}
            fill="#0d0c0b"
            stroke={getColor(restaurant.position)}
          />
        ) : (
          <ActiveDot cx={toPoint(restaurant.position).x} cy={toPoint(restaurant.position).y} r="5" fill={getColor(restaurant.position)} />
        )}
      </MapSvg>
      <p>{restaurant.position[0] < 0 ? '조용한' : '활기찬'} {restaurant.position[1] < 0 ? '혼밥' : '모임'} 군집</p>
    </MapCard>
  )
}

export function LocationMap({ restaurant }: { restaurant: Restaurant }) {
  return (
    <MapCard>
      <LocationGraphic role="img" aria-label={`${restaurant.address} 위치 지도`}>
        <Road $direction="horizontal" />
        <Road $direction="vertical" />
        <Road $direction="diagonal" />
        <LocationPin />
      </LocationGraphic>
      <p>{restaurant.address}</p>
    </MapCard>
  )
}

const MapCard = styled.div`
  p { margin: 8px 0 0; color: var(--sub); font-size: 12px; text-align: center; }
  @media (max-width: 640px) { p { min-height: 38px; } }
`
const MapSvg = styled.svg`display: block; width: 100%; aspect-ratio: 1; overflow: hidden; border-radius: 12px;`
const MapBase = styled.rect`fill: var(--quote);`
const MapWash = styled.rect`opacity: .05;`
const MapAxis = styled.path`fill: none; stroke: var(--line); stroke-width: .28; stroke-dasharray: 1 1;`
const MapDot = styled.circle`opacity: .25;`
const MapRing = styled.circle`opacity: .35; stroke-width: 1;`
const LowReviewMarker = styled.path`stroke-width: 1.5;`
const ActiveDot = styled.circle`filter: drop-shadow(0 0 1.4px var(--accent));`
const LocationGraphic = styled.div`position: relative; display: block; width: 100%; aspect-ratio: 1; overflow: hidden; border-radius: 12px; background: var(--quote);`
const Road = styled.span<{ $direction: 'horizontal'|'vertical'|'diagonal' }>`
  position: absolute; display: block; background: var(--card);
  ${({ $direction }) => $direction === 'horizontal' ? 'top:42%;right:0;left:0;height:11%;opacity:.8;' : $direction === 'vertical' ? 'top:0;bottom:0;left:28%;width:9%;opacity:.8;' : 'top:-10%;bottom:-10%;left:64%;width:7%;opacity:.6;transform:rotate(14deg);'}
`
const LocationPin = styled.span`position: absolute; top: 38%; left: 22%; width: 12px; height: 12px; margin: -6px 0 0 -6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 6px var(--halo);`
import styled from '@emotion/styled'
