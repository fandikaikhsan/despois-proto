'use client'

import { useStore } from '@/store/useStore'
import { getAlbumById } from '@/data/albums'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Music, Share2, Check } from 'lucide-react'
import QRCode from 'qrcode'

// Mock provenance events for the demo bottle
function getProvenance(bottleId: string, serialNumber: string, claimedAt: string) {
  const claimDate = new Date(claimedAt)
  const purchaseDate = new Date(claimDate.getTime() - 4 * 60 * 60 * 1000) // 4h before claim
  const shipDate = new Date(claimDate.getTime() - 2 * 24 * 60 * 60 * 1000) // 2 days before claim
  const mintDate = new Date(claimDate.getTime() - 14 * 24 * 60 * 60 * 1000) // 14 days before

  return [
    {
      event: 'Bottle minted',
      detail: `Serial ${serialNumber} issued to inventory`,
      date: mintDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      icon: '◆',
    },
    {
      event: 'Order placed',
      detail: `Purchased via DesPois checkout — ${bottleId.includes('demo') ? 'order-001' : `order-${bottleId}`}`,
      date: purchaseDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      icon: '◆',
    },
    {
      event: 'Shipped',
      detail: 'Dispatched from DesPois fulfilment center, Pittsburgh PA',
      date: shipDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      icon: '◆',
    },
    {
      event: 'Ownership registered',
      detail: 'NFC/QR authenticated — ownership transferred to current holder',
      date: claimDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      icon: '◆',
      highlight: true,
    },
  ]
}

export default function BottleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { bottles, user } = useStore()
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [shareTarget, setShareTarget] = useState<string | null>(null)

  const bottleId = params.bottleId as string
  const bottle = bottles.find(b => b.id === bottleId)
  const album = bottle ? getAlbumById(bottle.albumId) : undefined

  // Generate QR code for the serial number
  useEffect(() => {
    if (!bottle) return
    const verifyUrl = `https://despois.co/verify?serial=${bottle.serialNumber}`
    QRCode.toDataURL(verifyUrl, {
      width: 256,
      margin: 2,
      color: { dark: '#FFD700', light: '#141414' },
    }).then(setQrDataUrl)
  }, [bottle])

  // Guard: not found or not owned by current user
  if (!bottle || !album) {
    return (
      <main className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4" style={{ color: '#A0A0A0' }}>Bottle not found.</p>
          <Link href="/dashboard" style={{ color: '#FFD700' }}>← Back to dashboard</Link>
        </div>
      </main>
    )
  }

  const provenance = getProvenance(bottle.id, bottle.serialNumber, bottle.claimedAt!)

  // Simulated Spotify links (mock playlist URLs)
  const spotifyBaseUrl = 'https://open.spotify.com/playlist/'
  const mockPlaylistIds: Record<string, string> = {
    'album-001': '37i9dQZF1DXcBWIGoYBM5M',
    'album-002': '37i9dQZF1DX4dyzvuaRJ0n',
    'album-003': '37i9dQZF1DX0XUsuxWHRQd',
    'album-004': '37i9dQZF1DX4SBhb3fqCJd',
  }

  function handleShare(platform: string) {
    if (!bottle || !album) return
    setShareTarget(platform)
    const text = `I own bottle ${bottle.serialNumber} — ${album.title} by ${album.artistName}. Authenticated on DesPois. #DesPois #${album.artistName.replace(/[^a-zA-Z]/g, '')}`
    const shareUrl = `https://despois.co/verify?serial=${bottle.serialNumber}`

    setTimeout(() => {
      setShareTarget(null)
      setCopied(platform === 'copy')
      setTimeout(() => setCopied(false), 2000)
    }, 600)

    if (platform === 'copy') {
      navigator.clipboard.writeText(`${text}\n${shareUrl}`).catch(() => {})
    }
  }

  return (
    <main className="pt-28 pb-24 min-h-screen">
      <div className="container-custom">

        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm mb-10 transition-colors"
          style={{ color: '#6B7280' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#F5F5F5')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to collection
        </Link>

        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start">

          {/* LEFT — Album image + QR */}
          <div className="space-y-6">
            <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: '#141414' }}>
              <Image src={album.coverImageUrl} alt={album.title} fill className="object-cover" priority />
              {/* Auth stamp */}
              <div
                className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5"
                style={{ backgroundColor: 'rgba(10,10,10,0.85)', border: '1px solid #FFD700' }}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="#FFD700">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs font-medium" style={{ color: '#FFD700', fontFamily: 'var(--font-jetbrains)' }}>
                  AUTHENTICATED
                </span>
              </div>
            </div>

            {/* QR Code */}
            <div className="p-6 text-center" style={{ backgroundColor: '#141414', border: '1px solid #2A2A2A' }}>
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#6B7280' }}>
                Ownership QR Code
              </p>
              {qrDataUrl ? (
                <div className="flex justify-center">
                  <div className="p-3" style={{ backgroundColor: '#141414', border: '1px solid #2A2A2A' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrDataUrl} alt="Bottle QR code" width={180} height={180} />
                  </div>
                </div>
              ) : (
                <div className="w-[180px] h-[180px] mx-auto flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
                  <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#FFD700', borderTopColor: 'transparent' }} />
                </div>
              )}
              <p className="text-xs mt-4" style={{ color: '#6B7280' }}>
                Scan to verify authenticity
              </p>
            </div>
          </div>

          {/* RIGHT — Ownership details */}
          <div className="space-y-8">

            {/* Title */}
            <div>
              <p className="text-sm mb-1" style={{ color: '#A0A0A0' }}>{album.artistName}</p>
              <h1
                className="italic mb-2"
                style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: '#F5F5F5', lineHeight: 1.15 }}
              >
                {album.title}
              </h1>
              <p className="text-sm" style={{ fontFamily: 'var(--font-jetbrains)', color: '#FFD700' }}>
                {bottle.serialNumber}
              </p>
            </div>

            {/* ── SECTION 1: Proof of ownership ── */}
            <section style={{ border: '1px solid #2A2A2A', padding: '1.5rem' }}>
              <h2 className="text-xs uppercase tracking-widest mb-5" style={{ color: '#6B7280' }}>
                Proof of Ownership
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Serial Number', value: bottle.serialNumber, mono: true },
                  { label: 'Status', value: 'Authenticated ✓', accent: true },
                  { label: 'Edition', value: `#${bottle.serialNumber.split('BOTTLE')[1]} / ${album.totalInventory}`, mono: true },
                  {
                    label: 'Registered On',
                    value: new Date(bottle.claimedAt!).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                  },
                  { label: 'Owner', value: user?.email ?? 'demo@despois.co' },
                  { label: 'Drop', value: album.title },
                ].map(({ label, value, mono, accent }) => (
                  <div key={label}>
                    <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280' }}>{label}</p>
                    <p
                      className="text-sm"
                      style={{
                        color: accent ? '#FFD700' : '#F5F5F5',
                        fontFamily: mono ? 'var(--font-jetbrains)' : undefined,
                        wordBreak: 'break-all',
                      }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── SECTION 2: Exclusive content ── */}
            <section style={{ border: '1px solid #2A2A2A', padding: '1.5rem' }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xs uppercase tracking-widest" style={{ color: '#6B7280' }}>
                  Unlocked Exclusive Content
                </h2>
                <span
                  className="text-xs px-2 py-0.5"
                  style={{ backgroundColor: 'rgba(255,215,0,0.1)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)' }}
                >
                  OWNER ONLY
                </span>
              </div>
              <div className="space-y-3">
                {album.unlockables.map((track, i) => (
                  <div
                    key={track.trackName}
                    className="flex items-center justify-between gap-4 py-3"
                    style={{ borderBottom: i < album.unlockables.length - 1 ? '1px solid #2A2A2A' : 'none' }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)' }}
                      >
                        <svg className="w-3 h-3" fill="#FFD700" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm truncate" style={{ color: '#F5F5F5' }}>{track.trackName}</p>
                        <p className="text-xs" style={{ color: '#6B7280', fontFamily: 'var(--font-jetbrains)' }}>{track.duration}</p>
                      </div>
                    </div>
                    <a
                      href={`${spotifyBaseUrl}${mockPlaylistIds[album.id] ?? ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full flex-shrink-0 transition-opacity hover:opacity-80"
                      style={{ backgroundColor: '#1DB954', color: '#ffffff', fontSize: '0.7rem', fontWeight: 600 }}
                    >
                      <Music className="w-3 h-3" />
                      LISTEN
                    </a>
                  </div>
                ))}
              </div>

              {/* Full playlist link */}
              <a
                href={`${spotifyBaseUrl}${mockPlaylistIds[album.id] ?? ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-full transition-opacity hover:opacity-80"
                style={{ backgroundColor: '#1DB954', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem' }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Open Full Playlist on Spotify
              </a>
            </section>

            {/* ── SECTION 3: Provenance timeline ── */}
            <section style={{ border: '1px solid #2A2A2A', padding: '1.5rem' }}>
              <h2 className="text-xs uppercase tracking-widest mb-6" style={{ color: '#6B7280' }}>
                Bottle Provenance
              </h2>
              <div className="relative">
                {/* Vertical line */}
                <div
                  className="absolute left-[11px] top-2 bottom-2 w-px"
                  style={{ backgroundColor: '#2A2A2A' }}
                />
                <div className="space-y-6">
                  {provenance.map((event, i) => (
                    <div key={i} className="flex gap-4 relative">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                        style={{
                          backgroundColor: event.highlight ? '#FFD700' : '#2A2A2A',
                          border: `2px solid ${event.highlight ? '#FFD700' : '#3A3A3A'}`,
                        }}
                      >
                        {event.highlight && (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="#0A0A0A">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="pb-1">
                        <p
                          className="text-sm font-medium"
                          style={{ color: event.highlight ? '#FFD700' : '#F5F5F5' }}
                        >
                          {event.event}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{event.detail}</p>
                        <p className="text-xs mt-1" style={{ color: '#A0A0A0', fontFamily: 'var(--font-jetbrains)' }}>
                          {event.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── SECTION 4: Social sharing ── */}
            <section style={{ border: '1px solid #2A2A2A', padding: '1.5rem' }}>
              <h2 className="text-xs uppercase tracking-widest mb-5" style={{ color: '#6B7280' }}>
                Share Your Ownership
              </h2>
              <p className="text-sm mb-5" style={{ color: '#A0A0A0' }}>
                Let the world know you own bottle {bottle.serialNumber.split('BOTTLE')[1]} of {album.totalInventory}.
              </p>
              <div className="flex flex-wrap gap-3">
                {/* Twitter/X */}
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ backgroundColor: '#141414', border: '1px solid #2A2A2A', color: '#F5F5F5' }}
                >
                  {shareTarget === 'twitter' ? (
                    <Check className="w-4 h-4" style={{ color: '#FFD700' }} />
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.843L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  )}
                  Post on X
                </button>

                {/* Instagram */}
                <button
                  onClick={() => handleShare('instagram')}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ backgroundColor: '#141414', border: '1px solid #2A2A2A', color: '#F5F5F5' }}
                >
                  {shareTarget === 'instagram' ? (
                    <Check className="w-4 h-4" style={{ color: '#FFD700' }} />
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  )}
                  Share on Instagram
                </button>

                {/* Copy link */}
                <button
                  onClick={() => handleShare('copy')}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all"
                  style={{
                    backgroundColor: copied ? 'rgba(255,215,0,0.1)' : '#141414',
                    border: `1px solid ${copied ? '#FFD700' : '#2A2A2A'}`,
                    color: copied ? '#FFD700' : '#F5F5F5',
                  }}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>

              {/* Shareable card preview */}
              <div
                className="mt-5 p-4 text-sm"
                style={{ backgroundColor: '#0A0A0A', border: '1px solid #2A2A2A' }}
              >
                <p className="text-xs uppercase tracking-wide mb-2" style={{ color: '#6B7280' }}>Preview</p>
                <p style={{ color: '#A0A0A0', lineHeight: 1.6 }}>
                  I own bottle{' '}
                  <span style={{ color: '#FFD700', fontFamily: 'var(--font-jetbrains)' }}>
                    {bottle.serialNumber.split('BOTTLE')[1]}
                  </span>{' '}
                  — <strong style={{ color: '#F5F5F5' }}>{album.title}</strong> by {album.artistName}. Authenticated on DesPois.{' '}
                  <span style={{ color: '#6B7280' }}>#DesPois #{album.artistName.replace(/[^a-zA-Z]/g, '')}</span>
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  )
}
