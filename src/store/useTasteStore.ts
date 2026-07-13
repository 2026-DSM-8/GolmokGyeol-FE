import { create } from 'zustand'
import { searchSuggestions } from '../mocks/restaurants'
import type { TastePoint } from '../types/restaurant'

export const initialTaste: TastePoint = [-0.48, -0.45]

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
  resetTaste: () => void
}

export const useTasteStore = create<TasteStore>((set) => ({
  query: searchSuggestions[0],
  taste: initialTaste,
  searchScope: initialSearchScope,
  setQuery: (query) => set({ query }),
  setTaste: (taste) => set({ taste }),
  setSearchScope: (searchScope) => set({ searchScope }),
  resetTaste: () => set({ taste: initialTaste }),
}))
