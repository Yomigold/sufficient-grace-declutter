'use client'

import Link from 'next/link'
import { useState } from 'react'
import { buildWhatsAppLink } from '@/lib/sgd-listings'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Listings', href: '/listings' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Sell With Us', href: '/sell-with-us' },
  { label: 'About', href: '/about' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 bg-bg"
      style={{ borderBottom: '1.5px solid #C9924A' }}
    >
      <nav className="max-w-site mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display text-2xl text-gold font-semibold tracking-widest">
            SGD
          </span>
          <span className="font-ui text-[10px] text-muted tracking-[0.2em] uppercase">
            Sufficient Grace Declutter
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="font-ui text-xs tracking-[0.15em] uppercase text-body hover:text-gold transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href={buildWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-block bg-gold text-bg font-ui text-xs font-semibold tracking-[0.15em] uppercase px-5 py-2.5 hover:bg-gold-light transition-colors"
          style={{ borderRadius: '2px' }}
        >
          WhatsApp Us
        </a>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-gold transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gold transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gold transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-surface border-t border-surface3 px-6 py-6 flex flex-col gap-4">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-ui text-sm tracking-[0.15em] uppercase text-body hover:text-gold transition-colors py-2"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 bg-gold text-bg font-ui text-xs font-semibold tracking-[0.15em] uppercase px-5 py-3 text-center hover:bg-gold-light transition-colors"
            style={{ borderRadius: '2px' }}
          >
            WhatsApp Us
          </a>
        </div>
      )}
    </header>
  )
}
