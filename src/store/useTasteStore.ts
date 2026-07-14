import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { MapResponse, Region, TastePoint } from '../types/restaurant'

const initialTaste: TastePoint = [0, 0]

export type SearchScope = Pick<Region, 'city' | 'district' | 'neighborhood' | 'storeCount'>

const initialSearchScope: SearchScope = {
  city: '',
  district: null,
  neighborhood: '',
  storeCount: 0,
}

type TasteStore = {
  query: string
  taste: TastePoint
  searchScope: SearchScope
  regions: Region[]
  mapResult: MapResponse | null
  recommendationIds: number[] | null
  setQuery: (query: string) => void
  setTaste: (taste: TastePoint) => void
  setSearchScope: (scope: SearchScope) => void
  setRegions: (regions: Region[]) => void
  setMapResult: (result: MapResponse) => void
  setRecommendationIds: (ids: number[] | null) => void
}

export const useTasteStore = create<TasteStore>()(
  persist(
    (set) => ({
      query: '',
      taste: initialTaste,
      searchScope: initialSearchScope,
      regions: [],
      mapResult: null,
      recommendationIds: null,
      setQuery: (query) => set({ query }),
      setTaste: (taste) => set({ taste }),
      setSearchScope: (searchScope) => set({
        searchScope,
        query: '',
        mapResult: null,
        recommendationIds: null,
      }),
      setRegions: (regions) => set({ regions }),
      setMapResult: (mapResult) => set({
        mapResult,
        taste: [mapResult.origin.x, mapResult.origin.y],
        recommendationIds: null,
      }),
      setRecommendationIds: (recommendationIds) => set({ recommendationIds }),
    }),
    {
      name: 'golmokgyeol-search-session',
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ searchScope, query, mapResult }) => ({ searchScope, query, mapResult }),
    },
  ),
)
