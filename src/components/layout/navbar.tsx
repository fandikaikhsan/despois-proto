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
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl italic" style={{ fontFamily: 'var(--font-playfair)', color: '#F5F5F5' }}>
            DESPOIS
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
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
            {isAuthenticated && (
              <Link href="/dashboard" className="text-sm tracking-wide transition-colors" style={{ color: '#A0A0A0' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FFD700')}
                onMouseLeave={e => (e.currentTarget.style.color = '#A0A0A0')}
              >
                DASHBOARD
              </Link>
            )}
            <Link href="/verify" className="text-sm tracking-wide transition-colors" style={{ color: '#A0A0A0' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#FFD700')}
              onMouseLeave={e => (e.currentTarget.style.color = '#A0A0A0')}
            >
              VERIFY
            </Link>
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: '#A0A0A0' }}>{user?.email}</span>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium uppercase tracking-wide transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#FFD700', color: '#0A0A0A' }}
                >
                  MY COLLECTION
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

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            style={{ color: '#F5F5F5' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden" style={{ borderTop: '1px solid #2A2A2A' }}>
          <div className="container-custom py-4 space-y-4">
            <Link href="/drops" className="block text-sm" style={{ color: '#F5F5F5' }} onClick={() => setMobileMenuOpen(false)}>DROPS</Link>
            <Link href="/#waitlist-section" className="block text-sm" style={{ color: '#F5F5F5' }} onClick={() => setMobileMenuOpen(false)}>WAITLIST</Link>
            <Link href="/verify" className="block text-sm" style={{ color: '#F5F5F5' }} onClick={() => setMobileMenuOpen(false)}>VERIFY</Link>
            {isAuthenticated && (
              <Link href="/dashboard" className="block text-sm" style={{ color: '#F5F5F5' }} onClick={() => setMobileMenuOpen(false)}>DASHBOARD</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
