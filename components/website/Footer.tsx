import Link from 'next/link'
import { buildWhatsAppLink } from '@/lib/sgd-listings'

export default function Footer() {
  return (
    <footer
      className="bg-bg"
      style={{ borderTop: '1.5px solid #C9924A' }}
    >
      <div className="max-w-site mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <p className="font-display text-2xl text-gold font-semibold tracking-widest mb-1">SGD</p>
          <p className="font-ui text-xs text-muted tracking-widest uppercase mb-4">Sufficient Grace Declutter</p>
          <p className="font-ui text-sm text-body leading-relaxed mb-4">
            Lagos-based structured secondhand marketplace. Verified furniture, appliances & electronics.
          </p>
          <p className="font-hand text-lg text-gold">Structure First. Scale Second.</p>
        </div>

        {/* Navigate */}
        <div>
          <p className="font-ui text-xs tracking-[0.2em] uppercase text-gold mb-5">Navigate</p>
          <ul className="space-y-3">
            {[
              { label: 'Home', href: '/' },
              { label: 'Listings', href: '/listings' },
              { label: 'How It Works', href: '/how-it-works' },
              { label: 'Sell With Us', href: '/sell-with-us' },
              { label: 'About', href: '/about' },
              { label: 'FAQ', href: '/faq' },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="font-ui text-sm text-muted hover:text-gold transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <p className="font-ui text-xs tracking-[0.2em] uppercase text-gold mb-5">Categories</p>
          <ul className="space-y-3">
            {['Furniture', 'Appliances', 'Electronics'].map((cat) => (
              <li key={cat}>
                <Link
                  href={`/listings?category=${cat}`}
                  className="font-ui text-sm text-muted hover:text-gold transition-colors"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <p className="font-ui text-xs tracking-[0.2em] uppercase text-gold mb-5">Connect</p>
          <ul className="space-y-3">
            <li>
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-ui text-sm text-muted hover:text-gold transition-colors"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/sufficientgracedeclutter"
                target="_blank"
                rel="noopener noreferrer"
                className="font-ui text-sm text-muted hover:text-gold transition-colors"
              >
                @sufficientgracedeclutter
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        className="border-t py-6 px-6"
        style={{ borderColor: 'rgba(201,146,74,0.15)' }}
      >
        <p className="font-ui text-xs text-ghost-text text-center">
          © Sufficient Grace Declutter. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
