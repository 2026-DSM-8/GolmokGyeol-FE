import { curveCatmullRomClosed, line } from 'd3'
import type { Restaurant, TastePoint } from '../types/restaurant'

const mapLine = line<[number, number]>().curve(curveCatmullRomClosed.alpha(0.72))

export const clusterPaths = [
  mapLine([[70, 90], [290, 58], [430, 145], [390, 275], [235, 310], [82, 238]]) ?? '',
  mapLine([[535, 72], [865, 60], [945, 160], [825, 292], [590, 267], [505, 178]]) ?? '',
  mapLine([[42, 415], [182, 350], [438, 405], [426, 575], [208, 610], [65, 545]]) ?? '',
  mapLine([[590, 382], [825, 345], [960, 455], [890, 610], [675, 590], [552, 500]]) ?? '',
]

export const toMapPoint = ([x, y]: TastePoint) => ({
  x: ((x + 1) / 2) * 1000,
  y: ((1 - y) / 2) * 640,
})

export const getTasteDistance = (restaurant: Restaurant, taste: TastePoint) =>
  Math.hypot(restaurant.position[0] - taste[0], restaurant.position[1] - taste[1])

export const getRecommendations = (items: Restaurant[], taste: TastePoint, count = 5) =>
  [...items]
    .sort((a, b) => getTasteDistance(a, taste) - getTasteDistance(b, taste))
    .slice(0, count)

export const getMatchRate = (restaurant: Restaurant, taste: TastePoint) =>
  Math.round(Math.max(72, 98 - getTasteDistance(restaurant, taste) * 25))
