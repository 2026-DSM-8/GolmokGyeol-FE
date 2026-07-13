export type TastePoint = [number, number]

export type Restaurant = {
  id: number
  name: string
  category: string
  reviews: number
  keywords: string[]
  quote: string
  source: string
  address: string
  position: TastePoint
}
