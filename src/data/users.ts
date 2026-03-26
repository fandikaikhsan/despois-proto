export type User = {
  id: string
  email: string
  fullName: string
  avatarUrl: string
  spotifyConnected: boolean
  spotifyUserId?: string
}

export const MOCK_CURRENT_USER: User = {
  id: 'user-demo',
  email: 'demo@despois.co',
  fullName: 'Demo User',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  spotifyConnected: false,
}

export const MOCK_USERS: User[] = [
  MOCK_CURRENT_USER,
  {
    id: 'user-1',
    email: 'collector@example.com',
    fullName: 'Jane Collector',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    spotifyConnected: true,
    spotifyUserId: 'spotify-jane-123'
  },
]
