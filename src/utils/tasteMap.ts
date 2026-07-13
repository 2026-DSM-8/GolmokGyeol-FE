import type { Restaurant, TastePoint } from '../types/restaurant'

const getTasteDistance = (restaurant: Restaurant, taste: TastePoint) =>
  Math.hypot(restaurant.position[0] - taste[0], restaurant.position[1] - taste[1])

export const getRecommendations = (items: Restaurant[], taste: TastePoint, count = 5) =>
  [...items]
    .sort((a, b) => getTasteDistance(a, taste) - getTasteDistance(b, taste))
    .slice(0, count)

export const getPromotionalComment = (restaurant: Restaurant) => {
  const highlights = restaurant.keywords.slice(0, 2).map((keyword) => `‘${keyword}’`).join(', ')

  if (restaurant.reviews < 40) {
    return `${highlights} 같은 매력이 돋보이는 곳이에요. 아직 많이 알려지지 않은 골목 맛집을 먼저 발견해보세요.`
  }

  return `${highlights} 같은 매력을 찾는 날 들러보세요. 오늘의 취향에 잘 맞을지도 몰라요.`
}

export const getClosingPromotionalComment = (restaurant: Restaurant) => {
  if (restaurant.reviews < 40) {
    return `아직 많이 알려지지 않은 ${restaurant.name}, 오늘 먼저 발견해보세요.`
  }

  const highlights = restaurant.keywords.slice(0, 2).map((keyword) => `‘${keyword}’`).join(', ')
  return `${highlights}의 매력이 끌린다면, 오늘 ${restaurant.name}에 들러보세요.`
}
