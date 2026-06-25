import Link from 'next/link'
import ListingCard from '@/components/website/ListingCard'
import { MOCK_LISTINGS } from '@/lib/sgd-listings'

export default function FeaturedListings() {
  const listings = MOCK_LISTINGS.filter((l) => l.status === 'available').slice(0, 6)

  return (
    <section
      className="bg-surface py-20"
      style={{ borderTop: '1px solid rgba(201,146,74,0.2)' }}
    >
      <div className="max-w-site mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
          <div>
            <p className="font-ui text-xs tracking-[0.3em] uppercase text-gold mb-3">Fresh Drops</p>
            <h2 className="font-display text-4xl md:text-5xl text-warm font-semibold">
              Available Now
            </h2>
            <div className="w-9 h-0.5 bg-gold mt-4" />
          </div>
          <p className="font-hand text-xl text-muted">Prices are fixed. No haggling.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/listings"
            className="inline-block bg-gold text-bg font-ui text-sm font-semibold tracking-[0.15em] uppercase px-10 py-4 hover:bg-gold-light transition-colors"
            style={{ borderRadius: '2px' }}
          >
            View All Listings
          </Link>
        </div>
      </div>
    </section>
  )
}
