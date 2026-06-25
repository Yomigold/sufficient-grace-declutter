import Link from 'next/link'
import { buildWhatsAppLink } from '@/lib/sgd-listings'

export default function Hero() {
  return (
    <section
      className="relative bg-bg overflow-hidden"
      style={{ minHeight: 'min(90vh, 720px)' }}
    >
      {/* Gold L-bracket top-left */}
      <span
        className="absolute top-8 left-8 w-10 h-10 pointer-events-none"
        style={{
          borderTop: '2px solid #C9924A',
          borderLeft: '2px solid #C9924A',
        }}
      />

      {/* Gold L-bracket bottom-right */}
      <span
        className="absolute bottom-8 right-8 w-10 h-10 pointer-events-none"
        style={{
          borderBottom: '2px solid #C9924A',
          borderRight: '2px solid #C9924A',
        }}
      />

      <div className="max-w-site mx-auto px-6 h-full flex items-center">
        <div className="grid md:grid-cols-2 gap-12 items-center py-20 w-full">
          {/* Text panel */}
          <div>
            <p className="font-ui text-xs tracking-[0.3em] uppercase text-gold mb-6">
              Lagos, Nigeria — Since 2020
            </p>

            <h1
              className="font-display font-semibold text-warm leading-[1.1] mb-6"
              style={{ fontSize: 'clamp(48px, 7vw, 88px)' }}
            >
              <span className="text-gold">Verified</span>{' '}
              Secondhand.{' '}
              <br className="hidden md:block" />
              Delivered Right.
            </h1>

            {/* Gold rule line */}
            <div
              className="mb-8"
              style={{ width: '36px', height: '2px', backgroundColor: '#C9924A' }}
            />

            <p className="font-ui text-body text-lg leading-relaxed mb-10 max-w-md">
              Furniture. Appliances. Electronics. Inspected by us.
              Paid before pickup. No stories.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/listings"
                className="inline-block bg-gold text-bg font-ui text-sm font-semibold tracking-[0.15em] uppercase px-8 py-4 hover:bg-gold-light transition-colors"
                style={{ borderRadius: '2px' }}
              >
                Shop Available Items
              </Link>
              <Link
                href="/how-it-works"
                className="inline-block font-ui text-sm font-semibold tracking-[0.15em] uppercase px-8 py-4 hover:text-gold transition-colors"
                style={{
                  borderRadius: '2px',
                  border: '1px solid #C9924A',
                  color: '#C9924A',
                }}
              >
                How It Works
              </Link>
            </div>
          </div>

          {/* Image panel */}
          <div
            className="relative hidden md:flex items-center justify-center"
            style={{ minHeight: '400px' }}
          >
            <div
              className="w-full h-full absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #1A1A1A 0%, #111111 100%)',
                border: '1px solid rgba(201,146,74,0.2)',
                borderRadius: '4px',
              }}
            />
            <div className="relative z-10 text-center p-12">
              <p className="font-display text-5xl text-gold font-semibold mb-3">42,000+</p>
              <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted mb-8">Buyers Served</p>
              <div className="w-px h-12 bg-gold mx-auto opacity-30 mb-8" />
              <p className="font-display text-5xl text-gold font-semibold mb-3">8,500+</p>
              <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted mb-8">Items Delivered</p>
              <div className="w-px h-12 bg-gold mx-auto opacity-30 mb-8" />
              <p className="font-hand text-2xl text-warm">Structure First. Scale Second.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
