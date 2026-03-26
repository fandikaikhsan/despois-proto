'use client'

import { useStore } from '@/store/useStore'
import { getAlbumById } from '@/data/albums'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, getUserBottles, isAuthenticated } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  if (!user) return null

  const userBottles = getUserBottles(user.id)

  return (
    <main className="pt-32 pb-24 min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <h1
              className="italic mb-2"
              style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#F5F5F5' }}
            >
              Your Collection
            </h1>
            <p style={{ color: '#A0A0A0' }}>
              {userBottles.length} {userBottles.length === 1 ? 'bottle' : 'bottles'} owned
            </p>
          </div>
          <Link
            href="/verify"
            className="px-4 py-2 text-sm font-medium uppercase tracking-wide transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#FFD700', color: '#0A0A0A' }}
          >
            + Register Bottle
          </Link>
        </div>

        {userBottles.length === 0 ? (
          <div className="text-center py-24" style={{ border: '1px solid #2A2A2A' }}>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: '#141414' }}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#2A2A2A">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="mb-2 text-lg" style={{ color: '#F5F5F5' }}>No bottles yet</p>
            <p className="mb-8 text-sm" style={{ color: '#6B7280' }}>
              Purchase a drop to start your collection
            </p>
            <Link
              href="/drops"
              className="inline-block px-8 py-4 font-medium uppercase tracking-wide transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#FFD700', color: '#0A0A0A' }}
            >
              Explore Drops
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userBottles.map(bottle => {
              const album = getAlbumById(bottle.albumId)
              if (!album) return null

              return (
                <div key={bottle.id} className="group" style={{ border: '1px solid #2A2A2A', padding: '1.5rem' }}>
                  <div className="relative aspect-square mb-4 overflow-hidden" style={{ backgroundColor: '#141414' }}>
                    <Image
                      src={album.coverImageUrl}
                      alt={album.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    {/* Claimed overlay */}
                    <div className="absolute inset-0 flex items-end">
                      <div className="w-full p-3" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9), transparent)' }}>
                        <p className="text-xs font-medium" style={{ color: '#FFD700', fontFamily: 'var(--font-jetbrains)' }}>
                          AUTHENTICATED
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm mb-1" style={{ color: '#A0A0A0' }}>
                      {album.artistName}
                    </p>
                    <h3 className="text-xl font-medium mb-2" style={{ color: '#F5F5F5' }}>
                      {album.title}
                    </h3>
                    <p className="text-xs mb-4" style={{ fontFamily: 'var(--font-jetbrains)', color: '#FFD700' }}>
                      {bottle.serialNumber}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#FFD700">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span style={{ color: '#A0A0A0' }}>
                          Claimed {new Date(bottle.claimedAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <Link
                        href={`/drops/${album.slug}`}
                        className="text-xs transition-colors"
                        style={{ color: '#6B7280' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#FFD700')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                      >
                        View drop →
                      </Link>
                    </div>

                    {/* Unlockables count */}
                    <div
                      className="mt-4 pt-4 text-sm"
                      style={{ borderTop: '1px solid #2A2A2A', color: '#6B7280' }}
                    >
                      {album.unlockables.length} exclusive tracks unlocked
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
