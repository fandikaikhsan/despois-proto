'use client'

import Link from 'next/link'
import { useStore } from '@/store/useStore'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const { user, isAuthenticated } = useStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50" style={{ backgroundColor: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #2A2A2A' }}>
      <div className="container-custom">
        <div className="relative flex h-16 items-center">
          {/* Logo */}
          <div className="flex min-w-0 flex-1 items-center">
            <Link href="/" className="text-2xl italic" style={{ fontFamily: 'var(--font-playfair)', color: '#F5F5F5' }}>
              DESPOIS
            </Link>
          </div>

          {/* Desktop Navigation — true center of bar */}
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:flex items-center gap-8">
            <Link href="/drops" className="text-sm tracking-wide transition-colors" style={{ color: '#A0A0A0' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#FFD700')}
              onMouseLeave={e => (e.currentTarget.style.color = '#A0A0A0')}
            >
              DROPS
            </Link>
            <Link href="/#waitlist-section" className="text-sm tracking-wide transition-colors" style={{ color: '#A0A0A0' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#FFD700')}
              onMouseLeave={e => (e.currentTarget.style.color = '#A0A0A0')}
            >
              WAITLIST
            </Link>
            <Link href="/order-usecase" className="text-sm tracking-wide transition-colors" style={{ color: '#A0A0A0' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#FFD700')}
              onMouseLeave={e => (e.currentTarget.style.color = '#A0A0A0')}
            >
              EXPERIENCE
            </Link>
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex flex-1 items-center justify-end gap-3">
            <div className="hidden md:block">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm" style={{ color: '#A0A0A0' }}>{user?.email}</span>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-sm font-medium uppercase tracking-wide transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#FFD700', color: '#0A0A0A' }}
                  >
                    MY DASHBOARD
                  </Link>
                </div>
              ) : (
                <button
                  className="px-4 py-2 text-sm font-medium uppercase"
                  style={{ backgroundColor: '#FFD700', color: '#0A0A0A' }}
                >
                  SIGN IN
                </button>
              )}
            </div>

            <button
              className="md:hidden"
              style={{ color: '#F5F5F5' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden" style={{ borderTop: '1px solid #2A2A2A' }}>
          <div className="container-custom py-4 space-y-4">
            <Link href="/drops" className="block text-sm" style={{ color: '#F5F5F5' }} onClick={() => setMobileMenuOpen(false)}>DROPS</Link>
            <Link href="/#waitlist-section" className="block text-sm" style={{ color: '#F5F5F5' }} onClick={() => setMobileMenuOpen(false)}>WAITLIST</Link>
            <Link href="/order-usecase" className="block text-sm" style={{ color: '#F5F5F5' }} onClick={() => setMobileMenuOpen(false)}>EXPERIENCE</Link>
            {isAuthenticated && (
              <Link href="/dashboard" className="block text-sm" style={{ color: '#FFD700' }} onClick={() => setMobileMenuOpen(false)}>MY DASHBOARD</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
