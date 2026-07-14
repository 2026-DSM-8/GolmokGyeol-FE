export type TastePoint = [number, number]

export type Confidence = 'high' | 'low'

export type Region = {
  city: string
  district: string | null
  neighborhood: string
  code: string
  storeCount: number
  available: boolean
}

export type Reask = {
  query: string
  headline: string
  subline: string
  placeholder: string
  options: string[]
  showAll?: boolean
}

export type Snippet = {
  text: string
  source: string
}

export type Mention = {
  text: string
  count: number
}

export type Restaurant = {
  id: number
  name: string
  category: string
  reviews: number
  confidence: Confidence
  position: TastePoint
  address: string
  locationDesc: string
  matchedSnippet: Snippet
  snippets: Snippet[]
  mentions: Mention[]
  quote: string
  source: string
  keywords: string[]
}

export type Axes = {
  x: { neg: string; pos: string }
  y: { neg: string; pos: string }
}

export type Banner = {
  count: number
  label: string
  axisText: string
}

export type MapResponse = {
  type: 'map'
  sessionId: string
  banner: Banner
  axes: Axes
  quadrants: [string, string, string, string]
  quadrantCounts: [number, number, number, number]
  origin: { x: number; y: number }
  restaurants: Restaurant[]
}

export type ReaskResponse = {
  type: 'reask'
  reask: Reask
}

export type SearchResponse = MapResponse | ReaskResponse

export type DragResponse = {
  top3: number[]
}

export type SimilarResponse = {
  origin: { x: number; y: number }
  top3: number[]
}
