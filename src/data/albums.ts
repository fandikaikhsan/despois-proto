export type Album = {
  id: string
  slug: string
  title: string
  artistName: string
  description: string
  coverImageUrl: string
  fragranceNotes: string[]
  priceCents: number
  totalInventory: number
  remainingInventory: number
  dropDate: string // ISO date
  status: 'upcoming' | 'live' | 'sold_out' | 'archived'
  spotifyPlaylistId: string
  unlockables: {
    trackName: string
    duration: string
    exclusive: boolean
  }[]
}

export const MOCK_ALBUMS: Album[] = [
  {
    id: 'album-001',
    slug: 'tyler-chromakopia',
    title: 'CHROMAKOPIA',
    artistName: 'Tyler, The Creator',
    description: 'A bold exploration of color, identity, and sonic experimentation. CHROMAKOPIA captures the electric energy of Tyler\'s evolution—raw, unfiltered, and unapologetically vibrant.',
    coverImageUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80',
    fragranceNotes: ['Bergamot', 'Pink Pepper', 'Cedarwood', 'Vanilla', 'Amber'],
    priceCents: 22500,
    totalInventory: 500,
    remainingInventory: 127,
    dropDate: '2026-04-15T09:00:00Z',
    status: 'live',
    spotifyPlaylistId: 'spotify:playlist:37i9dQZF1DXcBWIGoYBM5M',
    unlockables: [
      { trackName: 'St. Chroma (Extended)', duration: '5:42', exclusive: true },
      { trackName: 'Noid (Alternate Mix)', duration: '4:28', exclusive: true },
      { trackName: 'Darling, I (Demo)', duration: '3:51', exclusive: true },
    ]
  },
  {
    id: 'album-002',
    slug: 'sza-lana',
    title: 'LANA',
    artistName: 'SZA',
    description: 'An intimate journey through heartbreak, healing, and self-discovery. LANA is SZA at her most vulnerable—a fragrance as layered and complex as the emotions within.',
    coverImageUrl: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80',
    fragranceNotes: ['Jasmine', 'Sandalwood', 'Musk', 'Fig', 'Sea Salt'],
    priceCents: 22500,
    totalInventory: 750,
    remainingInventory: 0,
    dropDate: '2026-03-20T09:00:00Z',
    status: 'sold_out',
    spotifyPlaylistId: 'spotify:playlist:37i9dQZF1DX4dyzvuaRJ0n',
    unlockables: [
      { trackName: 'Kill Bill (Orchestral)', duration: '6:12', exclusive: true },
      { trackName: 'Blind (Acoustic)', duration: '4:05', exclusive: true },
    ]
  },
  {
    id: 'album-003',
    slug: 'kendrick-heartpart6',
    title: 'The Heart Part 6',
    artistName: 'Kendrick Lamar',
    description: 'A meditation on legacy, consciousness, and the weight of greatness. The Heart Part 6 is Kendrick\'s most introspective work—a scent that lingers long after the music fades.',
    coverImageUrl: 'https://images.unsplash.com/photo-1611329857570-f02f340e7378?w=800&q=80',
    fragranceNotes: ['Oud', 'Leather', 'Tobacco', 'Dark Chocolate', 'Incense'],
    priceCents: 22500,
    totalInventory: 1000,
    remainingInventory: 1000,
    dropDate: '2026-05-10T09:00:00Z',
    status: 'upcoming',
    spotifyPlaylistId: 'spotify:playlist:37i9dQZF1DX0XUsuxWHRQd',
    unlockables: [
      { trackName: 'The Heart Part 6', duration: '7:34', exclusive: true },
      { trackName: 'Mirror (Interlude)', duration: '2:18', exclusive: true },
      { trackName: 'Crown (feat. Baby Keem)', duration: '5:02', exclusive: true },
    ]
  },
  {
    id: 'album-004',
    slug: 'frank-ocean-endless',
    title: 'Endless (Remastered)',
    artistName: 'Frank Ocean',
    description: 'A visual album reimagined. The scent of infinite creative possibility—mysterious, elusive, and endlessly captivating.',
    coverImageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80',
    fragranceNotes: ['Sea Moss', 'White Tea', 'Vetiver', 'Ocean Breeze'],
    priceCents: 22500,
    totalInventory: 300,
    remainingInventory: 300,
    dropDate: '2026-06-01T09:00:00Z',
    status: 'upcoming',
    spotifyPlaylistId: 'spotify:playlist:37i9dQZF1DX4SBhb3fqCJd',
    unlockables: [
      { trackName: 'Higgs (Extended)', duration: '6:22', exclusive: true },
      { trackName: 'Comme des Garçons (Alternate)', duration: '4:15', exclusive: true },
    ]
  },
]

export function getAlbumBySlug(slug: string): Album | undefined {
  return MOCK_ALBUMS.find(a => a.slug === slug)
}

export function getAlbumById(id: string): Album | undefined {
  return MOCK_ALBUMS.find(a => a.id === id)
}

export function getLiveAlbums(): Album[] {
  return MOCK_ALBUMS.filter(a => a.status === 'live')
}

export function getUpcomingAlbums(): Album[] {
  return MOCK_ALBUMS.filter(a => a.status === 'upcoming')
}
