import { notFound } from 'next/navigation'
import Link from 'next/link'
import ListingCard from '@/components/website/ListingCard'
import { MOCK_LISTINGS, formatPrice, buildListingWhatsAppLink, buildWhatsAppLink } from '@/lib/sgd-listings'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return MOCK_LISTINGS.map((l) => ({ id: l.id }))
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const listing = MOCK_LISTINGS.find((l) => l.id === id)
  if (!listing) return {}
  return {
    title: listing.name,
    description: listing.description,
  }
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params
  const listing = MOCK_LISTINGS.find((l) => l.id === id)
  if (!listing) notFound()

  const similar = MOCK_LISTINGS.filter(
    (l) => l.id !== listing.id && l.category === listing.category && l.status === 'available'
  ).slice(0, 3)

  return (
    <>
      <section className="bg-bg pt-16 pb-20">
        <div className="max-w-site mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-10 font-ui text-xs text-muted">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link href="/listings" className="hover:text-gold transition-colors">Listings</Link>
            <span>/</span>
            <span className="text-body truncate max-w-xs">{listing.name}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Photo gallery */}
            <div>
              <div
                className="w-full flex items-center justify-center bg-surface2"
                style={{
                  aspectRatio: '4/3',
                  border: '1px solid rgba(201,146,74,0.2)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                {listing.photos.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={listing.photos[0]}
                    alt={listing.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-ghost-text opacity-30">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-16 h-16 mb-3">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
                    </svg>
                    <p className="font-ui text-sm">Photos available on request</p>
                  </div>
                )}
              </div>
            </div>

            {/* Item info */}
            <div className="flex flex-col">
              <div className="flex items-start gap-3 mb-4">
                <span
                  className="font-ui text-[10px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1"
                  style={{
                    background: listing.condition === 'Near-New' ? '#C9924A' : 'transparent',
                    color: listing.condition === 'Near-New' ? '#0C0C0C' : '#C9924A',
                    border: listing.condition === 'Near-New' ? 'none' : '1px solid #C9924A',
                    borderRadius: '2px',
                  }}
                >
                  {listing.condition}
                </span>
                <span className="font-ui text-[10px] tracking-[0.1em] uppercase text-muted px-2.5 py-1"
                  style={{ border: '1px solid rgba(201,146,74,0.2)', borderRadius: '2px' }}
                >
                  {listing.category}
                </span>
              </div>

              <h1 className="font-display text-3xl md:text-4xl text-warm font-semibold mb-4 leading-snug">
                {listing.name}
              </h1>

              <p className="font-mono text-xs text-ghost-text mb-4 tracking-wider">
                Ref: {listing.ref_code}
              </p>

              {/* Price */}
              <div className="mb-6">
                <p className="font-ui text-xs tracking-[0.15em] uppercase text-muted mb-1">Fixed Price</p>
                <p className="font-mono text-4xl text-gold font-bold">
                  ₦{formatPrice(listing.price)}
                </p>
                <p className="font-hand text-sm text-muted mt-1">Non-Negotiable.</p>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-gold flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <p className="font-ui text-sm text-body">{listing.location}</p>
              </div>

              {/* Routes */}
              <div
                className="mb-6 px-5 py-4"
                style={{
                  background: '#1A1A1A',
                  border: '1px solid rgba(201,146,74,0.2)',
                  borderRadius: '4px',
                }}
              >
                <p className="font-ui text-xs tracking-[0.15em] uppercase text-muted mb-3">
                  Available Routes
                </p>
                <div className="flex gap-3 flex-wrap">
                  {(listing.available_routes === 'Both'
                    ? ['Point & Kill', 'Self Inspection']
                    : [listing.available_routes]
                  ).map((r) => (
                    <span
                      key={r}
                      className="font-ui text-xs font-semibold tracking-[0.1em] uppercase px-3 py-1.5 text-gold"
                      style={{ border: '1px solid rgba(201,146,74,0.4)', borderRadius: '2px' }}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              {listing.description && (
                <p className="font-ui text-sm text-body leading-relaxed mb-8">
                  {listing.description}
                </p>
              )}

              {/* CTA */}
              <a
                href={buildListingWhatsAppLink(listing)}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-gold text-bg font-ui text-sm font-semibold tracking-[0.15em] uppercase py-4 hover:bg-gold-light transition-colors"
                style={{ borderRadius: '2px' }}
              >
                Inquire on WhatsApp
              </a>

              <p className="font-ui text-xs text-muted text-center mt-3">
                Payment to SGD first. Always.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to buy inline */}
      <section
        className="bg-surface py-14"
        style={{ borderTop: '1px solid rgba(201,146,74,0.2)' }}
      >
        <div className="max-w-site mx-auto px-6">
          <h2 className="font-display text-2xl text-warm font-semibold mb-8">How to Buy This Item</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { n: '01', t: 'Message SGD', d: 'Send us this listing on WhatsApp with your preferred route.' },
              { n: '02', t: 'We Confirm', d: 'We verify availability and give you the final price.' },
              { n: '03', t: 'Pay SGD', d: 'Transfer to SGD. Not the seller.' },
              { n: '04', t: 'Item Moves', d: 'Via Point & Kill (we deliver) or Self Inspection (you collect).' },
            ].map((s) => (
              <div key={s.n}>
                <p className="font-mono text-3xl text-gold mb-3" style={{ opacity: 0.35 }}>{s.n}</p>
                <h3 className="font-display text-lg text-warm font-semibold mb-2">{s.t}</h3>
                <p className="font-ui text-xs text-muted leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Similar items */}
      {similar.length > 0 && (
        <section className="bg-bg py-16">
          <div className="max-w-site mx-auto px-6">
            <h2 className="font-display text-3xl text-warm font-semibold mb-10">
              More {listing.category}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {similar.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
