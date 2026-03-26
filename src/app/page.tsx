import { Hero } from '@/components/homepage/hero'
import { ProductLayers } from '@/components/homepage/product-layers'
import { WaitlistForm } from '@/components/homepage/waitlist-form'

export default function HomePage() {
  return (
    <main>
      <Hero />

      {/* Problem Statement */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#A0A0A0' }}>
            Discover
          </p>
          <h2
            className="max-w-4xl mx-auto leading-tight"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(1.875rem, 5vw, 3rem)',
              fontStyle: 'italic',
              color: '#F5F5F5',
            }}
          >
            Music has always created{' '}
            <em style={{ color: '#FFD700' }}>extraordinary emotional value.</em>{' '}
            The products built around it rarely have.
          </h2>
        </div>
      </section>

      <ProductLayers />
      <WaitlistForm />

      {/* Footer */}
      <footer className="py-12" style={{ borderTop: '1px solid #2A2A2A' }}>
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-xl italic"
            style={{ fontFamily: 'var(--font-playfair)', color: '#F5F5F5' }}
          >
            DESPOIS
          </p>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            © 2026 DesPois. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
