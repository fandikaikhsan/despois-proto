import { getAlbumBySlug, MOCK_ALBUMS } from '@/data/albums'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { PurchaseButton } from '@/components/album/purchase-button'
import Link from 'next/link'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return MOCK_ALBUMS.map(album => ({ slug: album.slug }))
}

export default async function AlbumDetailPage({ params }: Props) {
  const { slug } = await params
  const album = getAlbumBySlug(slug)

  if (!album) {
    notFound()
  }

  const percentSold = ((album.totalInventory - album.remainingInventory) / album.totalInventory) * 100

  return (
    <main className="pt-32 pb-24">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-12" style={{ color: '#6B7280' }}>
          <Link href="/drops" className="hover:text-accent transition-colors" style={{ color: '#A0A0A0' }}>
            Drops
          </Link>
          <span>/</span>
          <span style={{ color: '#F5F5F5' }}>{album.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Image */}
          <div className="relative aspect-square" style={{ backgroundColor: '#141414' }}>
            <Image
              src={album.coverImageUrl}
              alt={album.title}
              fill
              className="object-cover"
              priority
            />
            {/* Status badge */}
            <div
              className="absolute top-4 left-4 px-3 py-1 text-xs font-medium uppercase"
              style={{
                backgroundColor: album.status === 'live' ? '#FFD700' : album.status === 'sold_out' ? '#2A2A2A' : '#141414',
                color: album.status === 'live' ? '#0A0A0A' : '#F5F5F5',
              }}
            >
              {album.status === 'live' ? 'Live Now' : album.status === 'sold_out' ? 'Sold Out' : 'Coming Soon'}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <p className="text-sm mb-2" style={{ color: '#A0A0A0' }}>
              {album.artistName}
            </p>
            <h1
              className="italic mb-6"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                color: '#F5F5F5',
              }}
            >
              {album.title}
            </h1>
            <p className="leading-relaxed mb-8" style={{ color: '#A0A0A0' }}>
              {album.description}
            </p>

            {/* Fragrance Notes */}
            <div className="mb-8">
              <h3 className="text-sm uppercase tracking-wide mb-3" style={{ color: '#F5F5F5' }}>
                Fragrance Notes
              </h3>
              <div className="flex flex-wrap gap-2">
                {album.fragranceNotes.map(note => (
                  <span
                    key={note}
                    className="px-3 py-1 text-sm"
                    style={{ backgroundColor: '#141414', border: '1px solid #2A2A2A', color: '#F5F5F5' }}
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Unlockables */}
            <div className="mb-8">
              <h3 className="text-sm uppercase tracking-wide mb-3" style={{ color: '#F5F5F5' }}>
                Exclusive Unlockables
              </h3>
              <div className="space-y-3">
                {album.unlockables.map((track, i) => (
                  <div
                    key={track.trackName}
                    className="flex justify-between items-center text-sm py-2"
                    style={{ borderBottom: i < album.unlockables.length - 1 ? '1px solid #2A2A2A' : 'none' }}
                  >
                    <span style={{ color: '#F5F5F5' }}>{track.trackName}</span>
                    <span style={{ color: '#A0A0A0', fontFamily: 'var(--font-jetbrains)' }}>{track.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price & Inventory */}
            <div className="mb-8">
              <div className="flex items-baseline gap-4 mb-3">
                <span className="text-3xl font-medium" style={{ color: '#F5F5F5' }}>
                  ${(album.priceCents / 100).toFixed(0)}
                </span>
                <span className="text-sm" style={{ color: '#A0A0A0' }}>
                  {album.remainingInventory} / {album.totalInventory} remaining
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-px" style={{ backgroundColor: '#2A2A2A' }}>
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${percentSold}%`, backgroundColor: '#FFD700' }}
                />
              </div>
            </div>

            {/* CTA */}
            <PurchaseButton album={album} />

            {/* Verify CTA */}
            <div className="mt-6 pt-6" style={{ borderTop: '1px solid #2A2A2A' }}>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                Already own a bottle?{' '}
                <Link href="/verify" className="transition-colors" style={{ color: '#FFD700' }}>
                  Register & unlock
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
