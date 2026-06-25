import Link from 'next/link'

const CATEGORIES = [
  {
    name: 'Furniture',
    description: 'Sofas, beds, wardrobes, dining sets',
    href: '/listings?category=Furniture',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 10V8a1 1 0 011-1h16a1 1 0 011 1v2M3 10v8a1 1 0 001 1h16a1 1 0 001-1v-8M7 14h10M5 10v4M19 10v4" />
        <rect x="5" y="17" width="2" height="2" rx="0.5" />
        <rect x="17" y="17" width="2" height="2" rx="0.5" />
      </svg>
    ),
  },
  {
    name: 'Appliances',
    description: 'Fridges, washing machines, ACs, TVs',
    href: '/listings?category=Appliances',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10">
        <rect x="5" y="3" width="14" height="18" rx="1" />
        <path strokeLinecap="round" d="M8 7h1M8 10h1" />
        <circle cx="12" cy="14" r="3" />
      </svg>
    ),
  },
  {
    name: 'Electronics',
    description: 'Laptops, phones, sound systems, gadgets',
    href: '/listings?category=Electronics',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10">
        <rect x="2" y="4" width="20" height="14" rx="1" />
        <path strokeLinecap="round" d="M8 22h8M12 18v4" />
      </svg>
    ),
  },
]

export default function Categories() {
  return (
    <section className="bg-surface py-20">
      <div className="max-w-site mx-auto px-6">
        {/* Headline */}
        <div className="text-center mb-14">
          <p className="font-ui text-xs tracking-[0.3em] uppercase text-gold mb-3">What We Move</p>
          <h2 className="font-display text-4xl md:text-5xl text-warm font-semibold">
            What We Move
          </h2>
          <div className="w-9 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group block p-8 transition-all"
              style={{
                background: '#1A1A1A',
                border: '1px solid rgba(201,146,74,0.2)',
                borderRadius: '4px',
              }}
            >
              <div
                className="text-gold mb-6 transition-transform group-hover:scale-110"
                style={{ color: '#C9924A' }}
              >
                {cat.icon}
              </div>
              <h3 className="font-display text-2xl text-warm font-semibold mb-3">
                {cat.name}
              </h3>
              <p className="font-ui text-sm text-muted leading-relaxed">
                {cat.description}
              </p>
              <p className="font-ui text-xs text-gold mt-5 tracking-[0.1em] uppercase group-hover:translate-x-1 transition-transform inline-block">
                Browse {cat.name} →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
