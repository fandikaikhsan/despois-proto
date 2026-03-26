'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import QRCode from 'qrcode'
import Image from 'next/image'
import Link from 'next/link'
import { MOCK_ALBUMS } from '@/data/albums'
import { RotateCcw } from 'lucide-react'

const BASE_URL = 'https://despois-proto.fandika.space'
const ALBUM = MOCK_ALBUMS.find(a => a.status === 'live')!

export default function OrderUsecasePage() {
  const [rotateY, setRotateY] = useState(-20)
  const [rotateX, setRotateX] = useState(10)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [hint, setHint] = useState<'front' | 'back'>('front')

  const rotateYRef = useRef(-20)
  const rotateXRef = useRef(10)
  const dragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const rafRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null)
  const autoSpinRef = useRef(true)

  // QR code → /verify
  useEffect(() => {
    QRCode.toDataURL(`${BASE_URL}/verify`, {
      width: 220,
      margin: 2,
      color: { dark: '#111111', light: '#F5F5F5' },
    }).then(setQrDataUrl)
  }, [])

  // Auto-spin slowly when idle
  useEffect(() => {
    let active = true
    let lastTime = 0

    function tick(time: number) {
      if (!active) return
      const delta = time - lastTime
      lastTime = time

      if (autoSpinRef.current && !dragging.current) {
        rotateYRef.current -= delta * 0.025 // ~1.5 deg/s
        setRotateY(rotateYRef.current)
        updateHint()
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    // Small delay before auto-spin kicks in
    const timer = setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick)
    }, 1200)

    return () => {
      active = false
      clearTimeout(timer)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  function updateHint() {
    const norm = ((rotateYRef.current % 360) + 360) % 360
    setHint(norm > 90 && norm < 270 ? 'back' : 'front')
  }

  // ── Pointer events (mouse + pen) ──
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragging.current = true
    autoSpinRef.current = false
    setIsDragging(true)
    lastPos.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }

    rotateYRef.current -= dx * 0.4
    rotateXRef.current = Math.max(-35, Math.min(35, rotateXRef.current + dy * 0.25))

    setRotateY(rotateYRef.current)
    setRotateX(rotateXRef.current)
    updateHint()
  }, [])

  const onPointerUp = useCallback(() => {
    dragging.current = false
    setIsDragging(false)
    // Resume auto-spin after 3s idle
    setTimeout(() => {
      if (!dragging.current) autoSpinRef.current = true
    }, 3000)
  }, [])

  function resetView() {
    rotateYRef.current = -20
    rotateXRef.current = 10
    setRotateY(-20)
    setRotateX(10)
    autoSpinRef.current = true
    setHint('front')
  }

  const isBackVisible = hint === 'back'

  return (
    <main
      className="min-h-screen pt-16 pb-24 flex flex-col"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, #1a1400 0%, #0A0A0A 70%)' }}
    >
      {/* Page header */}
      <div className="container-custom text-center mt-16 mb-12">
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#6B7280' }}>
          Order Experience
        </p>
        <h1
          className="italic mb-4"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            color: '#F5F5F5',
          }}
        >
          Hold The Era.
        </h1>
        <p className="text-sm" style={{ color: '#6B7280' }}>
          Drag to rotate · Scan the QR on the back to register
        </p>
      </div>

      {/* ── 3D Scene ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div
          className="relative select-none"
          style={{ perspective: '900px', perspectiveOrigin: '50% 50%' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* Vinyl disc */}
          <div
            style={{
              width: 'clamp(260px, 52vmin, 380px)',
              height: 'clamp(260px, 52vmin, 380px)',
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transition: isDragging ? 'none' : 'transform 0.08s linear',
              cursor: isDragging ? 'grabbing' : 'grab',
              position: 'relative',
              borderRadius: '50%',
            }}
          >
            {/* ── FRONT FACE — Album art ── */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                overflow: 'hidden',
                boxShadow: '0 40px 80px rgba(0,0,0,0.8), 0 0 0 2px rgba(255,215,0,0.15)',
              }}
            >
              {/* Album photo */}
              <Image
                src={ALBUM.coverImageUrl}
                alt={ALBUM.title}
                fill
                className="object-cover"
                draggable={false}
                priority
              />

              {/* Vinyl groove rings */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: `
                    repeating-radial-gradient(
                      circle at center,
                      transparent 0px,
                      transparent 6px,
                      rgba(0,0,0,0.12) 6.5px,
                      transparent 7px
                    )
                  `,
                  mixBlendMode: 'multiply',
                }}
              />

              {/* Sheen overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: 'radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.12) 0%, transparent 55%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Centre label */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '26%',
                  height: '26%',
                  borderRadius: '50%',
                  backgroundColor: '#0D0D0D',
                  border: '1px solid #2A2A2A',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  boxShadow: 'inset 0 0 12px rgba(0,0,0,0.8)',
                }}
              >
                <p style={{ color: '#FFD700', fontSize: '0.42rem', fontFamily: 'var(--font-jetbrains)', letterSpacing: '0.18em', textAlign: 'center', lineHeight: 1.2 }}>
                  DESPOIS
                </p>
                <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#FFD700' }} />
                <p style={{ color: '#4A4A4A', fontSize: '0.35rem', fontFamily: 'var(--font-jetbrains)', letterSpacing: '0.1em' }}>
                  45 RPM
                </p>
              </div>
            </div>

            {/* ── BACK FACE — QR code ── */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                backgroundColor: '#111111',
                border: '2px solid #2A2A2A',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                overflow: 'hidden',
                boxShadow: '0 40px 80px rgba(0,0,0,0.8)',
              }}
            >
              {/* Subtle grooves on back */}
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: 'repeating-radial-gradient(circle, transparent, transparent 10px, rgba(40,40,40,0.4) 11px)',
              }} />

              {/* Gold ring accent */}
              <div style={{
                position: 'absolute', inset: 12, borderRadius: '50%',
                border: '1px solid rgba(255,215,0,0.15)',
                pointerEvents: 'none',
              }} />

              {/* QR code */}
              {qrDataUrl ? (
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    padding: 10,
                    backgroundColor: '#F5F5F5',
                    borderRadius: 4,
                    boxShadow: '0 0 20px rgba(255,215,0,0.15)',
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrDataUrl} alt="Scan to verify" width={110} height={110} />
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    width: 110,
                    height: 110,
                    backgroundColor: '#1A1A1A',
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: '#FFD700', borderTopColor: 'transparent' }}
                  />
                </div>
              )}

              {/* Label */}
              <p style={{
                position: 'relative',
                zIndex: 1,
                color: '#6B7280',
                fontSize: '0.5rem',
                fontFamily: 'var(--font-jetbrains)',
                letterSpacing: '0.2em',
                textAlign: 'center',
                lineHeight: 1.8,
              }}>
                SCAN TO REGISTER<br />OWNERSHIP
              </p>

              {/* Centre hole */}
              <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 14, height: 14,
                borderRadius: '50%',
                backgroundColor: '#000',
                border: '1px solid #3A3A3A',
                zIndex: 2,
              }} />
            </div>
          </div>

          {/* Ground shadow */}
          <div style={{
            position: 'absolute',
            bottom: -32,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '70%',
            height: 24,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%)',
            filter: 'blur(8px)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Status label below disc */}
        <div className="mt-12 text-center" style={{ minHeight: 40 }}>
          <p
            className="text-sm transition-all duration-300"
            style={{ color: isBackVisible ? '#FFD700' : '#6B7280' }}
          >
            {isBackVisible
              ? 'QR visible — point your camera to register'
              : 'Drag to flip and reveal the QR code'}
          </p>
        </div>

        {/* Reset button */}
        <button
          onClick={resetView}
          className="mt-4 flex items-center gap-2 text-xs uppercase tracking-wide transition-colors"
          style={{ color: '#3A3A3A' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#6B7280')}
          onMouseLeave={e => (e.currentTarget.style.color = '#3A3A3A')}
        >
          <RotateCcw className="w-3 h-3" />
          Reset view
        </button>
      </div>

      {/* ── Album info strip ── */}
      <div className="container-custom mt-16">
        <div
          className="grid md:grid-cols-[1fr_auto] gap-8 items-center p-8"
          style={{ border: '1px solid #2A2A2A', backgroundColor: '#0D0D0D' }}
        >
          <div>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#6B7280' }}>
              Inside the box
            </p>
            <h2
              className="italic mb-1"
              style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.5rem', color: '#F5F5F5' }}
            >
              {ALBUM.title}
            </h2>
            <p className="text-sm mb-4" style={{ color: '#A0A0A0' }}>{ALBUM.artistName}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {ALBUM.fragranceNotes.map(note => (
                <span
                  key={note}
                  className="text-xs px-3 py-1"
                  style={{ border: '1px solid #2A2A2A', color: '#6B7280' }}
                >
                  {note}
                </span>
              ))}
            </div>
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280' }}>Edition</p>
                <p style={{ color: '#F5F5F5', fontFamily: 'var(--font-jetbrains)' }}>
                  {ALBUM.totalInventory - ALBUM.remainingInventory} / {ALBUM.totalInventory} claimed
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280' }}>Price</p>
                <p style={{ color: '#F5F5F5', fontFamily: 'var(--font-jetbrains)' }}>
                  ${(ALBUM.priceCents / 100).toFixed(0)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280' }}>Unlocks</p>
                <p style={{ color: '#F5F5F5' }}>{ALBUM.unlockables.length} exclusive tracks</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <Link
              href={`/drops/${ALBUM.slug}`}
              className="px-6 py-3 text-sm font-medium uppercase tracking-wide text-center transition-opacity hover:opacity-90 whitespace-nowrap"
              style={{ backgroundColor: '#FFD700', color: '#0A0A0A' }}
            >
              Claim Your Bottle
            </Link>
            <Link
              href="/verify"
              className="px-6 py-3 text-sm font-medium uppercase tracking-wide text-center transition-all whitespace-nowrap"
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
              Register a Bottle
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
