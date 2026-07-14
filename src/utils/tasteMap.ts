import type { Restaurant, TastePoint } from '../types/restaurant'

const getTasteDistance = (restaurant: Restaurant, taste: TastePoint) =>
  Math.hypot(restaurant.position[0] - taste[0], restaurant.position[1] - taste[1])

export const getRecommendations = (items: Restaurant[], taste: TastePoint, count = 5) =>
  [...items]
    .sort((a, b) => getTasteDistance(a, taste) - getTasteDistance(b, taste))
    .slice(0, count)

export const getPromotionalComment = (restaurant: Restaurant) => {
  const highlights = restaurant.keywords.slice(0, 2).map((keyword) => `‘${keyword}’`).join(', ')
  const subject = highlights || '후기에서 드러난 분위기'

  if (restaurant.confidence === 'low') {
    return `${subject} 같은 특징이 후기에서 보여요. 정보가 적은 만큼 후기 내용을 함께 살펴보세요.`
  }

  return `${subject} 같은 매력을 찾는 날 들러보세요. 오늘의 취향에 잘 맞을지도 몰라요.`
}

export const getClosingPromotionalComment = (restaurant: Restaurant) => {
  if (restaurant.confidence === 'low') {
    return `후기 정보는 적지만 취향 지도에서 만난 ${restaurant.name}, 남겨진 후기를 더 살펴보세요.`
  }

  const highlights = restaurant.keywords.slice(0, 2).map((keyword) => `‘${keyword}’`).join(', ')
  return highlights
    ? `${highlights}의 매력이 끌린다면, 오늘 ${restaurant.name}에 들러보세요.`
    : `후기에서 느껴지는 분위기가 끌린다면, 오늘 ${restaurant.name}에 들러보세요.`
}
