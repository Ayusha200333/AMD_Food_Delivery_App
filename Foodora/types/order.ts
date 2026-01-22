export interface Order {
  id: string
  items: string[]
  total: number
  isDelivered: boolean
  placedAt: string
  userId?: string
}