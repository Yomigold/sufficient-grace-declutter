import Link from 'next/link'
import { Listing, formatPrice, buildListingWhatsAppLink } from '@/lib/sgd-listings'

interface Props {
  listing: Listing
}

export default function ListingCard({ listing }: Props) {
  return (
    <div
      className="flex flex-col group"
      style={{
        background: '#1A1A1A',
        border: '1px solid rgba(201,146,74,0.2)',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      {/* Image */}
      <Link href={`/listings/${listing.id}`}>
        <div
          className="relative w-full bg-surface2 flex items-center justify-center"
          style={{ aspectRatio: '4/3' }}
        >
          {listing.photos.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.photos[0]}
              alt={listing.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-ghost-text">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-12 h-12 mb-2 opacity-30">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
              </svg>
              <p className="font-ui text-xs opacity-30">No photo</p>
            </div>
          )}
          {/* Condition badge */}
          <span
            className="absolute top-3 left-3 font-ui text-[10px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1"
            style={{
              background: listing.condition === 'Near-New' ? '#C9924A' : '#1A1A1A',
              color: listing.condition === 'Near-New' ? '#0C0C0C' : '#C9924A',
              border: listing.condition === 'Near-New' ? 'none' : '1px solid #C9924A',
              borderRadius: '2px',
            }}
          >
            {listing.condition}
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5">
        <p className="font-mono text-[10px] text-ghost-text mb-2 tracking-wider">
          {listing.ref_code}
        </p>
        <Link href={`/listings/${listing.id}`}>
          <h3 className="font-display text-lg text-warm font-semibold mb-3 leading-snug group-hover:text-gold transition-colors">
            {listing.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5 text-muted flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <p className="font-ui text-xs text-muted">{listing.location}</p>
        </div>

        <p
          className="font-mono text-xl font-bold text-gold mt-auto mb-4"
        >
          ₦{formatPrice(listing.price)}
        </p>

        <a
          href={buildListingWhatsAppLink(listing)}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center bg-gold text-bg font-ui text-xs font-semibold tracking-[0.15em] uppercase py-3 hover:bg-gold-light transition-colors"
          style={{ borderRadius: '2px' }}
        >
          Inquire on WhatsApp
        </a>
      </div>
    </div>
  )
}
