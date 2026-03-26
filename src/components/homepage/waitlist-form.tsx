'use client'

import { useState, FormEvent } from 'react'
import { useStore } from '@/store/useStore'

export function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { addToWaitlist } = useStore()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    const success = await addToWaitlist(email)

    setLoading(false)
    if (success) {
      setSubmitted(true)
      setEmail('')
    }
  }

  return (
    <section id="waitlist-section" className="section-padding">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#A0A0A0' }}>
            Early Access
          </p>
          <h2
            className="italic mb-6"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: '#F5F5F5',
            }}
          >
            Be first.
          </h2>
          <p className="mb-8" style={{ color: '#A0A0A0' }}>
            Join the DesPois waitlist for priority access to upcoming drops, artist
            announcements, and owner-priority release windows before they open to
            the public.
          </p>

          {submitted ? (
            <div className="p-6" style={{ backgroundColor: '#141414', border: '1px solid #FFD700' }}>
              <p className="font-medium mb-2" style={{ color: '#FFD700' }}>You&apos;re in.</p>
              <p className="text-sm" style={{ color: '#A0A0A0' }}>
                Watch for a message from us when the drop opens.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="flex-1 px-6 py-4 text-sm focus:outline-none"
                style={{
                  backgroundColor: '#141414',
                  border: '1px solid #2A2A2A',
                  color: '#F5F5F5',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#FFD700')}
                onBlur={e => (e.currentTarget.style.borderColor = '#2A2A2A')}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 font-medium uppercase tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#FFD700', color: '#0A0A0A' }}
              >
                {loading ? 'JOINING...' : 'JOIN'}
              </button>
            </form>
          )}

          <p className="text-sm mt-4" style={{ color: '#6B7280' }}>
            No spam. Early access only. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
