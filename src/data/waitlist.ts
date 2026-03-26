export type WaitlistEntry = {
  id: string
  email: string
  albumId: string | null // null = general waitlist
  createdAt: string
  notified: boolean
}

export const MOCK_WAITLIST: WaitlistEntry[] = [
  {
    id: 'wait-001',
    email: 'early@fan.com',
    albumId: 'album-003',
    createdAt: '2026-04-01T12:00:00Z',
    notified: false
  },
  {
    id: 'wait-002',
    email: 'superfan@music.com',
    albumId: null,
    createdAt: '2026-03-15T08:00:00Z',
    notified: false
  }
]
