'use client'

import { motion } from 'framer-motion'

const layers = [
  {
    number: '01',
    title: 'THE COLLECTIBLE OBJECT',
    subtitle: 'A premium serialized bottle designed around the album era.',
    description: 'Uniquely numbered, designed around the visual world of the album era. Built to be displayed, collected, and kept. Not a product that ages into irrelevance — an object that gains meaning over time.'
  },
  {
    number: '02',
    title: 'THE ALBUM-ERA FRAGRANCE',
    subtitle: 'A scent built to hold the emotional atmosphere of the release.',
    description: 'Not a promotional tie-in. Not a celebrity collaboration. A fragrance designed as the physical translation of the music\'s world — something that can return you to the feeling of an era, years after it passed.'
  },
  {
    number: '03',
    title: 'THE DIGITAL ALBUM WORLD',
    subtitle: 'Authenticated by your bottle. An owner-only digital environment.',
    description: 'Register ownership via NFC tap and unlock an immersive, release-specific digital experience. Not available to the public. Not accessible without the object. Your era, yours alone.'
  }
]

export function ProductLayers() {
  return (
    <section className="section-padding" style={{ backgroundColor: '#141414' }}>
      <div className="container-custom">
        <div className="text-center mb-20">
          <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#A0A0A0' }}>
            The Product
          </p>
          <h2
            className="italic"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              lineHeight: '1.2',
              color: '#F5F5F5',
            }}
          >
            One object. <br />
            Three layers of ownership.
          </h2>
        </div>

        <div className="space-y-24">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <p className="text-sm mb-4" style={{ fontFamily: 'var(--font-jetbrains)', color: '#A0A0A0' }}>
                  {layer.number}
                </p>
                <h3 className="text-2xl font-medium mb-2" style={{ color: '#F5F5F5' }}>
                  {layer.title}
                </h3>
                <p className="text-lg mb-6" style={{ color: '#FFD700' }}>
                  {layer.subtitle}
                </p>
                <p className="leading-relaxed" style={{ color: '#A0A0A0' }}>
                  {layer.description}
                </p>
              </div>
              <div
                className={`aspect-square rounded flex items-center justify-center ${i % 2 === 1 ? 'lg:order-1' : ''}`}
                style={{ backgroundColor: 'rgba(42,42,42,0.3)' }}
              >
                <div className="text-center">
                  <p className="text-6xl font-light" style={{ color: '#2A2A2A', fontFamily: 'var(--font-playfair)' }}>
                    {layer.number}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
