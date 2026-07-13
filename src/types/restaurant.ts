export type TastePoint = [number, number]

export type Restaurant = {
  id: number
  name: string
  category: string
  reviews: number
  price: string
  hidden?: boolean
  keywords: string[]
  quote: string
  source: string
  address: string
  hours: string
  position: TastePoint
}
