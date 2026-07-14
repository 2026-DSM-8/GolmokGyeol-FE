import { useEffect, useState } from 'react'
import type { Restaurant, TastePoint } from '../../types/restaurant'
import { naverMapSearchUrl } from '../../utils/restaurantDisplay'

type Coordinates = { lat: number; lon: number }
type MapTile = { x: number; y: number; url: string }

const DEFAULT_MAP_ZOOM = 17
const MIN_MAP_ZOOM = 14
const MAX_MAP_ZOOM = 19
const TILE_SIZE = 256

const coordinateRequests = new Map<string, Promise<Coordinates | null>>()

const locateAddress = (address: string) => {
  const cached = coordinateRequests.get(address)
  if (cached) return cached

  const request = fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=kr&accept-language=ko&q=${encodeURIComponent(address)}`, {
    headers: { Accept: 'application/json' },
  })
    .then(async (response) => {
      if (!response.ok) return null
      const [result] = await response.json() as Array<{ lat: string; lon: string }>
      if (!result) return null
      return { lat: Number(result.lat), lon: Number(result.lon) }
    })
    .catch(() => null)

  coordinateRequests.set(address, request)
  return request
}

const getMapTiles = ({ lat, lon }: Coordinates, zoom: number) => {
  const tileCount = 2 ** zoom
  const latitude = Math.max(-85.0511, Math.min(85.0511, lat))
  const latitudeRadians = latitude * Math.PI / 180
  const tileX = (lon + 180) / 360 * tileCount
  const tileY = (1 - Math.asinh(Math.tan(latitudeRadians)) / Math.PI) / 2 * tileCount
  const centerX = Math.floor(tileX)
  const centerY = Math.floor(tileY)
  const tiles: MapTile[] = []

  for (let y = centerY - 1; y <= centerY + 1; y += 1) {
    for (let x = centerX - 1; x <= centerX + 1; x += 1) {
      tiles.push({ x, y, url: `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png` })
    }
  }

  return {
    tiles,
    offsetX: (1 + tileX - centerX) * TILE_SIZE,
    offsetY: (1 + tileY - centerY) * TILE_SIZE,
  }
}

const colors = ['#a99bf7', '#f5946e', '#63d5aa', '#f28fb4']
const mapWidth = 280
const mapHeight = 160
const mapPadding = 20
const toPoint = ([x, y]: Restaurant['position']) => ({
  x: mapPadding + ((x + 1) / 2) * (mapWidth - mapPadding * 2),
  y: mapPadding + ((1 - y) / 2) * (mapHeight - mapPadding * 2),
})
const getColor = ([x, y]: Restaurant['position']) => colors[y >= 0 ? (x < 0 ? 0 : 1) : (x < 0 ? 2 : 3)]

type TastePositionMapProps = {
  restaurant: Restaurant
  restaurants?: Restaurant[]
  taste?: TastePoint
  highlightedRestaurantIds?: number[]
}

export function TastePositionMap({
  restaurant,
  restaurants = [restaurant],
  taste,
  highlightedRestaurantIds = [],
}: TastePositionMapProps) {
  const highlightedIds = new Set(highlightedRestaurantIds)

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
            <g key={item.id}>
              {highlightedIds.has(item.id) && <SimilarRing cx={point.x} cy={point.y} r="7" />}
              <MapDot
                cx={point.x}
                cy={point.y}
                r={highlightedIds.has(item.id) ? 4 : 2.5}
                fill={getColor(item.position)}
              />
            </g>
          )
        })}
        <MapRing cx={toPoint(restaurant.position).x} cy={toPoint(restaurant.position).y} r="12" fill="none" stroke={getColor(restaurant.position)} />
        {restaurant.confidence === 'low' ? (
          <LowReviewMarker
            d="M0 -6L6 0L0 6L-6 0Z"
            transform={`translate(${toPoint(restaurant.position).x} ${toPoint(restaurant.position).y})`}
            fill="#0d0c0b"
            stroke={getColor(restaurant.position)}
          />
        ) : (
          <ActiveDot cx={toPoint(restaurant.position).x} cy={toPoint(restaurant.position).y} r="5" fill={getColor(restaurant.position)} />
        )}
        {taste && (
          <g transform={`translate(${toPoint(taste).x} ${toPoint(taste).y})`}>
            <TasteHalo r="10" />
            <TasteDot r="4" />
          </g>
        )}
      </MapSvg>
      <p>{taste ? '이 식당과 비슷한 취향의 위치' : '취향 지도에서의 위치'}</p>
    </MapCard>
  )
}

export function LocationMap({ restaurant }: { restaurant: Restaurant }) {
  const naverMapUrl = naverMapSearchUrl(restaurant)
  const [coordinates, setCoordinates] = useState<Coordinates | null>()
  const [mapZoom, setMapZoom] = useState(DEFAULT_MAP_ZOOM)

  useEffect(() => {
    let active = true
    setCoordinates(undefined)
    setMapZoom(DEFAULT_MAP_ZOOM)
    void locateAddress(restaurant.address).then((result) => {
      if (active) setCoordinates(result)
    })
    return () => { active = false }
  }, [restaurant.address])

  const mapTiles = coordinates ? getMapTiles(coordinates, mapZoom) : null

  return (
    <MapCard>
      <LocationMapPreview>
        {mapTiles ? (
          <>
            <LocationTileGrid $offsetX={mapTiles.offsetX} $offsetY={mapTiles.offsetY} aria-hidden="true">
              {mapTiles.tiles.map((tile) => (
                <img key={`${tile.x}-${tile.y}`} src={tile.url} alt="" draggable={false} />
              ))}
            </LocationTileGrid>
            <LocationMarker aria-hidden="true" />
            <MapAttribution href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
              © OpenStreetMap
            </MapAttribution>
          </>
        ) : (
          <LocationMapStatus>
            {coordinates === undefined ? '실제 위치 지도를 불러오는 중…' : '네이버 지도에서 위치를 확인해주세요.'}
          </LocationMapStatus>
        )}
        <LocationMapLink
          href={naverMapUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`${restaurant.name} 위치를 네이버 지도에서 열기`}
        >
          <span>네이버 지도에서 보기 ↗</span>
        </LocationMapLink>
        {mapTiles && (
          <ZoomControls aria-label="지도 확대 축소">
            <button
              type="button"
              aria-label="지도 확대"
              disabled={mapZoom >= MAX_MAP_ZOOM}
              onClick={() => setMapZoom((current) => Math.min(MAX_MAP_ZOOM, current + 1))}
            >+</button>
            <button
              type="button"
              aria-label="지도 축소"
              disabled={mapZoom <= MIN_MAP_ZOOM}
              onClick={() => setMapZoom((current) => Math.max(MIN_MAP_ZOOM, current - 1))}
            >−</button>
          </ZoomControls>
        )}
      </LocationMapPreview>
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
const SimilarRing = styled.circle`fill: none; stroke: var(--accent); stroke-width: 1; opacity: .55;`
const MapRing = styled.circle`opacity: .35; stroke-width: 1;`
const LowReviewMarker = styled.path`stroke-width: 1.5;`
const ActiveDot = styled.circle`filter: drop-shadow(0 0 1.4px var(--accent));`
const TasteHalo = styled.circle`fill: var(--accent); opacity: .2;`
const TasteDot = styled.circle`fill: var(--accent);`
const LocationMapPreview = styled.div`
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 12px;
  background: var(--quote);
`
const LocationTileGrid = styled.div<{ $offsetX: number; $offsetY: number }>`
  position: absolute;
  top: calc(50% - ${({ $offsetY }) => $offsetY}px);
  left: calc(50% - ${({ $offsetX }) => $offsetX}px);
  display: grid;
  grid-template-columns: repeat(3, ${TILE_SIZE}px);
  width: ${TILE_SIZE * 3}px;
  height: ${TILE_SIZE * 3}px;

  img { display: block; width: ${TILE_SIZE}px; height: ${TILE_SIZE}px; user-select: none; }
`
const LocationMarker = styled.span`
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  border: 3px solid #fff;
  border-radius: 50% 50% 50% 0;
  background: var(--accent);
  box-shadow: 0 2px 8px rgba(0,0,0,.35);
  transform: translate(-50%, -100%) rotate(-45deg);
`
const LocationMapStatus = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 20px;
  color: var(--muted);
  font-size: 12px;
  text-align: center;
`
const MapAttribution = styled.a`
  position: absolute;
  z-index: 3;
  right: 4px;
  bottom: 3px;
  padding: 2px 4px;
  color: #444;
  background: rgba(255,255,255,.8);
  font-size: 9px;
  line-height: 1;
  text-decoration: none;
`
const LocationMapLink = styled.a`
  position: absolute;
  z-index: 2;
  inset: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 10px;
  color: var(--ink);
  text-decoration: none;
  cursor: pointer;

  span { padding: 7px 11px; border: 1px solid rgba(255,255,255,.2); border-radius: 8px; background: rgba(13,12,11,.82); color: #f2eee7; font-size: 12px; backdrop-filter: blur(6px); }
  &:focus-visible { outline: 2px solid var(--accent); outline-offset: -3px; }
`
const ZoomControls = styled.div`
  position:absolute;
  z-index:4;
  top:10px;
  left:10px;
  display:flex;
  flex-direction:column;
  overflow:hidden;
  border:1px solid rgba(0,0,0,.18);
  border-radius:8px;
  box-shadow:0 2px 8px rgba(0,0,0,.18);

  button{
    display:flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border:0;
    color:#222;background:rgba(255,255,255,.94);cursor:pointer;font-size:21px;line-height:1;
  }
  button+button{border-top:1px solid #ddd}
  button:hover:not(:disabled){background:#fff}
  button:disabled{color:#aaa;cursor:default}
`
import styled from '@emotion/styled'
