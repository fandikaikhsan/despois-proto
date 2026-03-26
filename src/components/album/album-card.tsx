'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Album } from '@/data/albums'

type Props = {
  album: Album
}

export function AlbumCard({ album }: Props) {
  const percentSold = ((album.totalInventory - album.remainingInventory) / album.totalInventory) * 100

  const statusColor = {
    live: { bg: '#FFD700', text: '#0A0A0A', label: 'Live Now' },
    sold_out: { bg: '#2A2A2A', text: '#F5F5F5', label: 'Sold Out' },
    upcoming: { bg: '#141414', text: '#F5F5F5', label: 'Coming Soon' },
    archived: { bg: '#2A2A2A', text: '#A0A0A0', label: 'Archived' },
  }[album.status]

  return (
    <Link href={`/drops/${album.slug}`} className="group block">
      <div className="relative aspect-square mb-4 overflow-hidden" style={{ backgroundColor: '#141414' }}>
        <Image
          src={album.coverImageUrl}
          alt={album.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Status Badge */}
        <div
          className="absolute top-4 right-4 px-3 py-1 text-xs font-medium uppercase"
          style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
        >
          {statusColor.label}
        </div>

        {/* Hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ backgroundColor: 'rgba(10,10,10,0.4)' }}
        />
      </div>

      <div>
        <p className="text-sm mb-1" style={{ color: '#A0A0A0' }}>{album.artistName}</p>
        <h3
          className="text-xl font-medium mb-2 transition-colors"
          style={{ color: '#F5F5F5' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#FFD700')}
          onMouseLeave={e => (e.currentTarget.style.color = '#F5F5F5')}
        >
          {album.title}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm" style={{ fontFamily: 'var(--font-jetbrains)', color: '#F5F5F5' }}>
            ${(album.priceCents / 100).toFixed(0)}
          </p>
          {album.status === 'live' && (
            <p className="text-xs" style={{ color: '#A0A0A0' }}>
              {Math.round(percentSold)}% claimed
            </p>
          )}
        </div>

        {/* Progress bar for live albums */}
        {album.status === 'live' && (
          <div className="w-full h-px" style={{ backgroundColor: '#2A2A2A' }}>
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${percentSold}%`, backgroundColor: '#FFD700' }}
            />
          </div>
        )}
      </div>
    </Link>
  )
}
