'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { MOCK_BOTTLES } from '@/data/bottles'
import { getAlbumById } from '@/data/albums'
import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, Calendar, Hash, User } from 'lucide-react'

function VerifiedContent() {
  const searchParams = useSearchParams()
  const serial = searchParams.get('serial')

  const bottle = serial ? MOCK_BOTTLES.find(b => b.serialNumber === serial) : null
  const album = bottle ? getAlbumById(bottle.albumId) : null

  // Unknown serial
  if (!serial || !bottle || !album) {
    return (
      <main className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <div className="container-custom text-center max-w-md mx-auto">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
          >
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="#ef4444">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-2xl font-medium mb-3" style={{ color: '#F5F5F5' }}>Unrecognised Bottle</h1>
          <p className="mb-8 text-sm" style={{ color: '#A0A0A0' }}>
            This serial number does not match any bottle in the DesPois registry. It may be counterfeit or incorrectly scanned.
          </p>
          <Link
            href="/verify"
            className="inline-block px-6 py-3 text-sm font-medium uppercase tracking-wide transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#FFD700', color: '#0A0A0A' }}
          >
            Try Manual Entry
          </Link>
        </div>
      </main>
    )
  }

  const editionNumber = bottle.serialNumber.split('BOTTLE')[1]
  const claimDate = bottle.claimedAt
    ? new Date(bottle.claimedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  const isClaimed = bottle.status === 'claimed'

  return (
    <main className="pt-24 pb-24 min-h-screen">
      <div className="container-custom max-w-2xl mx-auto">

        {/* Authenticated badge */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 mb-6"
            style={{ backgroundColor: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.3)' }}
          >
            <ShieldCheck className="w-4 h-4" style={{ color: '#FFD700' }} />
            <span className="text-xs uppercase tracking-widest font-medium" style={{ color: '#FFD700' }}>
              DesPois Verified Object
            </span>
          </div>
        </div>

        {/* Album image — large and centred */}
        <div
          className="relative mx-auto mb-8 overflow-hidden"
          style={{ width: 280, height: 280 }}
        >
          <Image
            src={album.coverImageUrl}
            alt={album.title}
            fill
            className="object-cover"
            priority
          />
          {/* Edition watermark */}
          <div
            className="absolute bottom-0 left-0 right-0 px-4 py-3"
            style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.95), transparent)' }}
          >
            <p className="text-xs font-medium text-center" style={{ fontFamily: 'var(--font-jetbrains)', color: '#FFD700' }}>
              EDITION #{editionNumber} / {album.totalInventory}
            </p>
          </div>
        </div>

        {/* Main ownership statement */}
        <div className="text-center mb-10">
          {isClaimed ? (
            <>
              <p className="text-sm uppercase tracking-widest mb-3" style={{ color: '#A0A0A0' }}>
                {album.artistName}
              </p>
              <h1
                className="italic mb-4"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  color: '#F5F5F5',
                  lineHeight: 1.2,
                }}
              >
                {album.title}
              </h1>
              <p className="text-base mb-1" style={{ color: '#A0A0A0' }}>
                This bottle is registered and authenticated.
              </p>
              <p className="text-lg font-medium" style={{ color: '#F5F5F5' }}>
                Bottle{' '}
                <span style={{ fontFamily: 'var(--font-jetbrains)', color: '#FFD700' }}>
                  #{editionNumber}
                </span>{' '}
                of {album.totalInventory} belongs to its rightful owner.
              </p>
            </>
          ) : (
            <>
              <h1
                className="italic mb-4"
                style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#F5F5F5' }}
              >
                This bottle is unclaimed.
              </h1>
              <p style={{ color: '#A0A0A0' }}>
                Scan completed. This serial is valid — register it to claim ownership.
              </p>
            </>
          )}
        </div>

        {/* Certificate card */}
        <div className="mb-8" style={{ border: '1px solid #2A2A2A', padding: '1.5rem' }}>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Hash className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#6B7280' }} />
              <div>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280' }}>Serial</p>
                <p className="text-xs break-all" style={{ fontFamily: 'var(--font-jetbrains)', color: '#F5F5F5' }}>
                  {bottle.serialNumber}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#6B7280' }} />
              <div>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280' }}>Status</p>
                <p className="text-sm font-medium" style={{ color: isClaimed ? '#FFD700' : '#A0A0A0' }}>
                  {isClaimed ? 'Registered ✓' : 'Unclaimed'}
                </p>
              </div>
            </div>

            {claimDate && (
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#6B7280' }} />
                <div>
                  <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280' }}>Registered</p>
                  <p className="text-sm" style={{ color: '#F5F5F5' }}>{claimDate}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <User className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#6B7280' }} />
              <div>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280' }}>Drop</p>
                <p className="text-sm" style={{ color: '#F5F5F5' }}>{album.title}</p>
              </div>
            </div>
          </div>

          {/* Fragrance notes */}
          <div className="mt-6 pt-5" style={{ borderTop: '1px solid #2A2A2A' }}>
            <p className="text-xs uppercase tracking-wide mb-3" style={{ color: '#6B7280' }}>Fragrance Profile</p>
            <div className="flex flex-wrap gap-2">
              {album.fragranceNotes.map(note => (
                <span
                  key={note}
                  className="text-xs px-3 py-1"
                  style={{ backgroundColor: '#0A0A0A', border: '1px solid #2A2A2A', color: '#A0A0A0' }}
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          {isClaimed ? (
            <Link
              href={`/dashboard/${bottle.id}`}
              className="flex-1 text-center px-6 py-4 font-medium uppercase tracking-wide transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#FFD700', color: '#0A0A0A' }}
            >
              View Ownership Certificate
            </Link>
          ) : (
            <Link
              href={`/verify?serial=${bottle.serialNumber}`}
              className="flex-1 text-center px-6 py-4 font-medium uppercase tracking-wide transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#FFD700', color: '#0A0A0A' }}
            >
              Claim This Bottle
            </Link>
          )}
          <Link
            href="/drops"
            className="flex-1 text-center px-6 py-4 text-sm font-medium uppercase tracking-wide transition-all"
            style={{ border: '1px solid #2A2A2A', color: '#A0A0A0' }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#F5F5F5'
              e.currentTarget.style.color = '#F5F5F5'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#2A2A2A'
              e.currentTarget.style.color = '#A0A0A0'
            }}
          >
            Explore All Drops
          </Link>
        </div>

        {/* Powered by footer */}
        <p className="text-center text-xs mt-10" style={{ color: '#3A3A3A' }}>
          Verified by DesPois · Tamper-evident serial authentication
        </p>
      </div>
    </main>
  )
}

export default function VerifiedPage() {
  return (
    <Suspense fallback={
      <main className="pt-32 min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: '#FFD700', borderTopColor: 'transparent' }} />
      </main>
    }>
      <VerifiedContent />
    </Suspense>
  )
}
