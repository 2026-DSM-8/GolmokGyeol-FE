import { useMemo } from 'react'
import { restaurants } from '../mocks/restaurants'
import type { TastePoint } from '../types/restaurant'
import { getRecommendations } from '../utils/tasteMap'

export const useTasteRecommendations = (taste: TastePoint) =>
  useMemo(() => getRecommendations(restaurants, taste), [taste])
