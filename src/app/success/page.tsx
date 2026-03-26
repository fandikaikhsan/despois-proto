'use client'

import { useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <main className="pt-32 pb-24 min-h-screen flex items-center">
      <div className="container-custom text-center">
        <div className="max-w-2xl mx-auto">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ backgroundColor: 'rgba(255,215,0,0.15)' }}
          >
            <CheckCircle className="w-12 h-12" style={{ color: '#FFD700' }} />
          </div>

          <h1
            className="italic mb-4"
            style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#F5F5F5' }}
          >
            Order Confirmed
          </h1>

          <p className="mb-8" style={{ color: '#A0A0A0' }}>
            Your bottle is reserved. You&apos;ll receive an email with tracking information when your order ships.
          </p>

          <div className="p-6 mb-8" style={{ backgroundColor: '#141414', border: '1px solid #2A2A2A' }}>
            <p className="text-sm mb-2" style={{ color: '#A0A0A0' }}>Order Number</p>
            <p style={{ fontFamily: 'var(--font-jetbrains)', color: '#FFD700' }}>{orderId}</p>
          </div>

          {/* Steps */}
          <div className="text-left p-6 mb-8" style={{ backgroundColor: '#141414', border: '1px solid #2A2A2A' }}>
            <h3 className="text-sm uppercase tracking-wide mb-4" style={{ color: '#A0A0A0' }}>What happens next</h3>
            <div className="space-y-4">
              {[
                { step: '01', text: 'Your bottle is packaged and shipped within 3-5 business days' },
                { step: '02', text: 'You receive tracking information via email' },
                { step: '03', text: 'When your bottle arrives, scan the QR code or enter the serial number to register ownership' },
                { step: '04', text: 'Connect Spotify and unlock exclusive tracks permanently' },
              ].map(({ step, text }) => (
                <div key={step} className="flex gap-4">
                  <span className="text-sm flex-shrink-0" style={{ fontFamily: 'var(--font-jetbrains)', color: '#FFD700' }}>{step}</span>
                  <p className="text-sm" style={{ color: '#A0A0A0' }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/verify"
              className="px-8 py-4 font-medium uppercase tracking-wide transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#FFD700', color: '#0A0A0A' }}
            >
              Register a Bottle
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 font-medium uppercase tracking-wide transition-all"
              style={{ border: '1px solid #F5F5F5', color: '#F5F5F5' }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#F5F5F5'
                e.currentTarget.style.color = '#0A0A0A'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#F5F5F5'
              }}
            >
              View My Collection
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#FFD700', borderTopColor: 'transparent' }} />
      </main>
    }>
      <SuccessContent />
    </Suspense>
  )
}
