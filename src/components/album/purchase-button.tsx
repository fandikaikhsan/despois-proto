'use client'

import { Album } from '@/data/albums'
import { useStore } from '@/store/useStore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  album: Album
}

export function PurchaseButton({ album }: Props) {
  const { addToCart, checkout } = useStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handlePurchase() {
    setLoading(true)
    addToCart(album.id)

    // Simulate Stripe checkout
    const result = await checkout()

    setLoading(false)

    if (result.success) {
      router.push(`/success?orderId=${result.orderId}`)
    }
  }

  if (album.status === 'sold_out') {
    return (
      <button
        disabled
        className="w-full px-8 py-4 font-medium uppercase tracking-wide cursor-not-allowed"
        style={{ backgroundColor: '#2A2A2A', color: '#A0A0A0' }}
      >
        Sold Out
      </button>
    )
  }

  if (album.status === 'upcoming') {
    return (
      <div>
        <p className="text-sm mb-4" style={{ color: '#A0A0A0' }}>
          Drop opens {new Date(album.dropDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <button
          onClick={() => router.push('/#waitlist-section')}
          className="w-full px-8 py-4 font-medium uppercase tracking-wide transition-all"
          style={{ border: '1px solid #F5F5F5', color: '#F5F5F5', backgroundColor: 'transparent' }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#F5F5F5'
            e.currentTarget.style.color = '#0A0A0A'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#F5F5F5'
          }}
        >
          Join Waitlist
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handlePurchase}
      disabled={loading}
      className="w-full px-8 py-4 font-medium uppercase tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50"
      style={{ backgroundColor: '#FFD700', color: '#0A0A0A' }}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          PROCESSING...
        </span>
      ) : (
        'CLAIM YOUR BOTTLE'
      )}
    </button>
  )
}
