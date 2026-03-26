export type Bottle = {
  id: string
  serialNumber: string
  albumId: string
  claimedBy: string | null // user ID
  claimedAt: string | null // ISO date
  status: 'unclaimed' | 'claimed' | 'voided'
}

// Generate sample bottles across albums
export const MOCK_BOTTLES: Bottle[] = [
  // Tyler album (15 bottles, 8 claimed)
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `bottle-tyler-${i + 1}`,
    serialNumber: `DESPOIS-TYLER001-BOTTLE${String(i + 1).padStart(4, '0')}`,
    albumId: 'album-001',
    claimedBy: i < 8 ? `user-${i + 1}` : null,
    claimedAt: i < 8 ? '2026-04-16T12:00:00Z' : null,
    status: (i < 8 ? 'claimed' : 'unclaimed') as 'claimed' | 'unclaimed'
  })),

  // SZA album (10 bottles, all claimed - sold out)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `bottle-sza-${i + 1}`,
    serialNumber: `DESPOIS-SZA0002-BOTTLE${String(i + 1).padStart(4, '0')}`,
    albumId: 'album-002',
    claimedBy: `user-${i + 10}`,
    claimedAt: '2026-03-21T10:30:00Z',
    status: 'claimed' as const
  })),

  // Kendrick album (25 bottles, none claimed - upcoming)
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `bottle-kendrick-${i + 1}`,
    serialNumber: `DESPOIS-KENDRICK3-BOTTLE${String(i + 1).padStart(4, '0')}`,
    albumId: 'album-003',
    claimedBy: null,
    claimedAt: null,
    status: 'unclaimed' as const
  })),

  // Demo user's bottle (Tyler album, already claimed)
  {
    id: 'bottle-demo-owned',
    serialNumber: 'DESPOIS-TYLER001-BOTTLE0099',
    albumId: 'album-001',
    claimedBy: 'user-demo',
    claimedAt: '2026-04-16T09:30:00Z',
    status: 'claimed' as const
  }
]

export function getBottleBySerial(serial: string): Bottle | undefined {
  return MOCK_BOTTLES.find(b => b.serialNumber === serial)
}

export function getBottlesByAlbum(albumId: string): Bottle[] {
  return MOCK_BOTTLES.filter(b => b.albumId === albumId)
}

export function getBottlesByUser(userId: string): Bottle[] {
  return MOCK_BOTTLES.filter(b => b.claimedBy === userId)
}

// Sample unclaimed serials for testing verification flow
export const SAMPLE_UNCLAIMED_SERIALS = [
  'DESPOIS-TYLER001-BOTTLE0009',
  'DESPOIS-TYLER001-BOTTLE0010',
  'DESPOIS-KENDRICK3-BOTTLE0001',
]
