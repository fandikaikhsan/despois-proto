export type Order = {
  id: string
  userId: string
  albumId: string
  bottleId: string | null
  amountCents: number
  status: 'pending' | 'paid' | 'shipped' | 'completed'
  createdAt: string
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zip: string
  }
}

export const MOCK_ORDERS: Order[] = [
  {
    id: 'order-001',
    userId: 'user-demo',
    albumId: 'album-001',
    bottleId: 'bottle-demo-owned',
    amountCents: 22500,
    status: 'shipped',
    createdAt: '2026-04-16T09:15:00Z',
    shippingAddress: {
      name: 'Demo User',
      street: '5000 Forbes Ave',
      city: 'Pittsburgh',
      state: 'PA',
      zip: '15213'
    }
  }
]

export function getOrdersByUser(userId: string): Order[] {
  return MOCK_ORDERS.filter(o => o.userId === userId)
}
