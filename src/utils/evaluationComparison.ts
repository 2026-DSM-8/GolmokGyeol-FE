import type { MapResponse, PopularityTopItem, Restaurant } from '../types/restaurant'

const itemId = (item: PopularityTopItem) => typeof item === 'number' ? item : item.id

const resolvePopularityRestaurants = (items: PopularityTopItem[], restaurants: Restaurant[]) => items
  .slice(0, 5)
  .map((item) => typeof item === 'number'
    ? restaurants.find((restaurant) => restaurant.id === item)
    : item)
  .filter((restaurant): restaurant is Restaurant => Boolean(restaurant))

export const getEvaluationComparison = (mapResult: MapResponse) => {
  const popularityItems = mapResult.popularityTop ?? []
  const golmokTop = mapResult.restaurants.slice(0, 5)
  const popularityTop = resolvePopularityRestaurants(popularityItems, mapResult.restaurants)
  const popularityIds = new Set(popularityItems.map(itemId))

  return {
    golmokTop,
    popularityTop,
    popularityIds,
    newlyRecommendedCount: golmokTop.filter((restaurant) => !popularityIds.has(restaurant.id)).length,
  }
}
