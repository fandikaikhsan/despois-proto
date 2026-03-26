import { MOCK_ALBUMS } from '@/data/albums'
import { AlbumCard } from '@/components/album/album-card'

export default function DropsPage() {
  const liveAlbums = MOCK_ALBUMS.filter(a => a.status === 'live')
  const upcomingAlbums = MOCK_ALBUMS.filter(a => a.status === 'upcoming')
  const soldOutAlbums = MOCK_ALBUMS.filter(a => a.status === 'sold_out')

  return (
    <main className="pt-32 pb-24">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h1
            className="italic mb-4"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.5rem, 6vw, 3rem)',
              color: '#F5F5F5',
            }}
          >
            Drops
          </h1>
          <p style={{ color: '#A0A0A0' }}>
            Limited-edition physical album experiences
          </p>
        </div>

        {/* Live Drops */}
        {liveAlbums.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-medium" style={{ color: '#F5F5F5' }}>Live Now</h2>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#FFD700' }} />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {liveAlbums.map(album => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming */}
        {upcomingAlbums.length > 0 && (
          <section className="mb-20">
            <h2 className="text-2xl font-medium mb-8" style={{ color: '#F5F5F5' }}>Coming Soon</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingAlbums.map(album => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </section>
        )}

        {/* Sold Out */}
        {soldOutAlbums.length > 0 && (
          <section>
            <h2 className="text-2xl font-medium mb-8" style={{ color: '#A0A0A0' }}>Sold Out</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-60">
              {soldOutAlbums.map(album => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
