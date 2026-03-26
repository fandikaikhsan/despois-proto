'use client'

import { useSearchParams } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { getBottleBySerial } from '@/data/bottles'
import { getAlbumById } from '@/data/albums'
import { useState, useEffect, Suspense } from 'react'
import { SerialInput } from '@/components/verify/serial-input'
import Image from 'next/image'
import Link from 'next/link'

function VerifyContent() {
  const searchParams = useSearchParams()
  const serial = searchParams.get('serial')

  const { user, spotifyConnected, connectSpotify, spotifyLoading, claimBottle } = useStore()
  const [bottle, setBottle] = useState<ReturnType<typeof getBottleBySerial>>(undefined)
  const [album, setAlbum] = useState<ReturnType<typeof getAlbumById>>(undefined)
  const [claimed, setClaimed] = useState(false)

  useEffect(() => {
    if (serial) {
      const foundBottle = getBottleBySerial(serial)
      if (foundBottle) {
        setBottle(foundBottle)
        const foundAlbum = getAlbumById(foundBottle.albumId)
        setAlbum(foundAlbum)
      }
    }
  }, [serial])

  function handleClaim() {
    if (user && bottle) {
      const success = claimBottle(bottle.serialNumber, user.id)
      if (success) {
        setClaimed(true)
      }
    }
  }

  // No serial provided - show input
  if (!serial || !bottle || !album) {
    return (
      <main className="pt-32 pb-24 min-h-screen">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1
              className="italic mb-4"
              style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#F5F5F5' }}
            >
              Register Your Bottle
            </h1>
            <p style={{ color: '#A0A0A0' }}>
              Enter your bottle&apos;s serial number to unlock exclusive content
            </p>
          </div>
          <SerialInput />
        </div>
      </main>
    )
  }

  // Claimed successfully
  if (claimed) {
    return (
      <main className="pt-32 pb-24 min-h-screen flex items-center">
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: 'rgba(255,215,0,0.15)' }}
              >
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="#FFD700">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1
                className="italic mb-4"
                style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#F5F5F5' }}
              >
                Unlocked!
              </h1>
              <p className="mb-6" style={{ color: '#A0A0A0' }}>
                {album.unlockables.length} exclusive tracks have been added to your Spotify library.
              </p>
            </div>

            <div className="p-6 mb-8" style={{ backgroundColor: '#141414', border: '1px solid #FFD700' }}>
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={album.coverImageUrl}
                  alt={album.title}
                  width={80}
                  height={80}
                  className="object-cover"
                />
                <div className="text-left">
                  <p className="text-sm" style={{ color: '#A0A0A0' }}>{album.artistName}</p>
                  <p className="font-medium" style={{ color: '#F5F5F5' }}>{album.title}</p>
                  <p className="text-sm mt-1" style={{ fontFamily: 'var(--font-jetbrains)', color: '#FFD700' }}>
                    {bottle.serialNumber}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-left text-sm" style={{ borderTop: '1px solid #2A2A2A', paddingTop: '1rem' }}>
                {album.unlockables.map(track => (
                  <div key={track.trackName} className="flex justify-between">
                    <span style={{ color: '#F5F5F5' }}>✓ {track.trackName}</span>
                    <span style={{ color: '#A0A0A0', fontFamily: 'var(--font-jetbrains)' }}>{track.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/dashboard"
              className="inline-block px-8 py-4 font-medium uppercase tracking-wide transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#FFD700', color: '#0A0A0A' }}
            >
              View My Collection
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // Verification flow
  return (
    <main className="pt-32 pb-24 min-h-screen">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1
              className="italic mb-4"
              style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#F5F5F5' }}
            >
              Register Your Bottle
            </h1>
            <p style={{ color: '#A0A0A0' }}>
              Connect your Spotify account to unlock exclusive content
            </p>
          </div>

          {/* Album Preview */}
          <div className="p-6 mb-8" style={{ backgroundColor: '#141414', border: '1px solid #2A2A2A' }}>
            <div className="flex items-center gap-4 mb-6">
              <Image
                src={album.coverImageUrl}
                alt={album.title}
                width={100}
                height={100}
                className="object-cover"
              />
              <div>
                <p className="text-sm" style={{ color: '#A0A0A0' }}>{album.artistName}</p>
                <p className="text-xl font-medium" style={{ color: '#F5F5F5' }}>{album.title}</p>
                <p className="text-sm mt-1" style={{ fontFamily: 'var(--font-jetbrains)', color: '#FFD700' }}>
                  {bottle.serialNumber}
                </p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #2A2A2A', paddingTop: '1rem' }}>
              <p className="text-sm mb-3" style={{ color: '#A0A0A0' }}>This bottle unlocks:</p>
              <div className="space-y-2">
                {album.unlockables.map(track => (
                  <div key={track.trackName} className="flex justify-between text-sm">
                    <span style={{ color: '#F5F5F5' }}>{track.trackName}</span>
                    <span style={{ color: '#A0A0A0', fontFamily: 'var(--font-jetbrains)' }}>{track.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {/* Step 1: Auth (always completed in demo) */}
            <div className="p-4 flex items-center gap-4" style={{ backgroundColor: '#141414', border: '1px solid #FFD700' }}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#FFD700' }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#0A0A0A">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium" style={{ color: '#F5F5F5' }}>Signed in as {user?.email}</p>
              </div>
            </div>

            {/* Step 2: Spotify */}
            {!spotifyConnected ? (
              <div className="p-4" style={{ backgroundColor: '#141414', border: '1px solid #2A2A2A' }}>
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium"
                    style={{ backgroundColor: '#2A2A2A', color: '#F5F5F5' }}
                  >
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: '#F5F5F5' }}>Connect Spotify</p>
                    <p className="text-sm" style={{ color: '#A0A0A0' }}>Required to unlock tracks</p>
                  </div>
                </div>
                <button
                  onClick={connectSpotify}
                  disabled={spotifyLoading}
                  className="w-full px-6 py-3 font-medium rounded-full transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#1DB954', color: '#ffffff' }}
                >
                  {spotifyLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                      Connect with Spotify
                    </>
                  )}
                </button>
              </div>
            ) : (
              <>
                <div className="p-4 flex items-center gap-4" style={{ backgroundColor: '#141414', border: '1px solid #FFD700' }}>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#FFD700' }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#0A0A0A">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: '#F5F5F5' }}>Spotify Connected</p>
                  </div>
                </div>

                {/* Step 3: Claim */}
                <div className="p-4" style={{ backgroundColor: '#141414', border: '1px solid #2A2A2A' }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium"
                      style={{ backgroundColor: '#2A2A2A', color: '#F5F5F5' }}
                    >
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: '#F5F5F5' }}>Claim Bottle</p>
                      <p className="text-sm" style={{ color: '#A0A0A0' }}>
                        This will unlock {album.unlockables.length} exclusive tracks
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClaim}
                    className="w-full px-8 py-4 font-medium uppercase tracking-wide transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#FFD700', color: '#0A0A0A' }}
                  >
                    Claim & Unlock
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <main className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" style={{ borderColor: '#FFD700', borderTopColor: 'transparent' }} />
      </main>
    }>
      <VerifyContent />
    </Suspense>
  )
}
