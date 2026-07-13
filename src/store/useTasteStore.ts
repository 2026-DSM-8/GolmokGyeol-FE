import { create } from 'zustand'
import { searchSuggestions } from '../mocks/restaurants'
import type { TastePoint } from '../types/restaurant'

export const initialTaste: TastePoint = [-0.48, -0.45]

type TasteStore = {
  query: string
  taste: TastePoint
  setQuery: (query: string) => void
  setTaste: (taste: TastePoint) => void
  resetTaste: () => void
}

export const useTasteStore = create<TasteStore>((set) => ({
  query: searchSuggestions[0],
  taste: initialTaste,
  setQuery: (query) => set({ query }),
  setTaste: (taste) => set({ taste }),
  resetTaste: () => set({ taste: initialTaste }),
}))
