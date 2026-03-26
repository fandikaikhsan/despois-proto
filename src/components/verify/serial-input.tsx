'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getBottleBySerial } from '@/data/bottles'

export function SerialInput() {
  const [serial, setSerial] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const bottle = getBottleBySerial(serial)

    if (!bottle) {
      setError('Invalid serial number. Check your bottle and try again.')
      return
    }

    if (bottle.status === 'claimed') {
      setError('This bottle has already been claimed.')
      return
    }

    // Proceed to claim flow
    router.push(`/verify?serial=${serial}`)
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-2" style={{ color: '#A0A0A0' }}>
            Serial Number
          </label>
          <input
            type="text"
            value={serial}
            onChange={(e) => {
              setSerial(e.target.value.toUpperCase())
              setError('')
            }}
            placeholder="DESPOIS-XXXXX-BOTTLEXXXX"
            className="w-full px-4 py-3 text-sm focus:outline-none"
            style={{
              backgroundColor: '#141414',
              border: `1px solid ${error ? '#ef4444' : '#2A2A2A'}`,
              color: '#F5F5F5',
              fontFamily: 'var(--font-jetbrains)',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = error ? '#ef4444' : '#FFD700')}
            onBlur={e => (e.currentTarget.style.borderColor = error ? '#ef4444' : '#2A2A2A')}
          />
          {error && (
            <p className="text-sm mt-2" style={{ color: '#ef4444' }}>{error}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 font-medium uppercase tracking-wide transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#FFD700', color: '#0A0A0A' }}
        >
          Verify Bottle
        </button>
      </form>

      <div className="mt-8 p-4" style={{ backgroundColor: '#141414', border: '1px solid #2A2A2A' }}>
        <p className="text-sm mb-3" style={{ color: '#A0A0A0' }}>Sample serials for testing:</p>
        <div className="space-y-2" style={{ fontFamily: 'var(--font-jetbrains)' }}>
          {[
            'DESPOIS-TYLER001-BOTTLE0009',
            'DESPOIS-TYLER001-BOTTLE0010',
            'DESPOIS-KENDRICK3-BOTTLE0001',
          ].map(s => (
            <p
              key={s}
              className="text-xs cursor-pointer transition-opacity hover:opacity-70"
              style={{ color: '#FFD700' }}
              onClick={() => { setSerial(s); setError('') }}
            >
              {s}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
