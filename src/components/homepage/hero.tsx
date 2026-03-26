'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center section-padding">
      <div className="container-custom text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm uppercase tracking-widest mb-8"
          style={{ color: '#A0A0A0' }}
        >
          A New Category in Music & Culture
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="italic mb-4"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(3rem, 8vw, 4.5rem)',
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
            color: '#F5F5F5',
          }}
        >
          The Album Era.
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            lineHeight: '1.2',
            letterSpacing: '-0.01em',
            color: '#F5F5F5',
          }}
        >
          In Your Hands.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg max-w-3xl mx-auto mb-12"
          style={{ color: '#A0A0A0' }}
        >
          DesPois is the premium physical album format for music — artist-led
          collectible fragrance drops tied to album worlds, authenticated ownership,
          and digital access only you can unlock.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/drops"
            className="px-8 py-4 font-medium uppercase tracking-wide transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#FFD700', color: '#0A0A0A' }}
          >
            Explore The Drop
          </Link>
          <Link
            href="#waitlist-section"
            className="px-8 py-4 font-medium uppercase tracking-wide transition-all hover:bg-primary hover:text-background"
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
            Join The Waitlist
          </Link>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-12 mx-auto" style={{ background: 'linear-gradient(to bottom, #FFD700, transparent)' }} />
        </motion.div>
      </div>
    </section>
  )
}
