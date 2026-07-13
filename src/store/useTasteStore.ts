import { create } from 'zustand'
import { defaultSearchQuery } from '../mocks/restaurants'
import type { TastePoint } from '../types/restaurant'

const initialTaste: TastePoint = [-0.48, -0.45]

export type SearchScope = {
  city: string
  district: string
  neighborhood: string
}

const initialSearchScope: SearchScope = {
  city: '',
  district: '',
  neighborhood: '',
}

type TasteStore = {
  query: string
  taste: TastePoint
  searchScope: SearchScope
  setQuery: (query: string) => void
  setTaste: (taste: TastePoint) => void
  setSearchScope: (scope: SearchScope) => void
}

export const useTasteStore = create<TasteStore>((set) => ({
  query: defaultSearchQuery,
  taste: initialTaste,
  searchScope: initialSearchScope,
  setQuery: (query) => set({ query }),
  setTaste: (taste) => set({ taste }),
  setSearchScope: (searchScope) => set({ searchScope }),
}))
