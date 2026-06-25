import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About SGD',
  description:
    'Six years. One standard. The story of Sufficient Grace Declutter — Lagos\' structured secondhand marketplace.',
}

const VALUES = [
  {
    title: 'Verification',
    body: 'Every item is confirmed before listing. Every buyer pays before getting seller details. Nothing ships without our nod.',
  },
  {
    title: 'Structure',
    body: "The process doesn't bend for anyone. Consistency is how trust is built — not reputation, not reviews, not charisma.",
  },
  {
    title: 'Transparency',
    body: 'Fixed prices. Clear routes. No hidden steps. What you see is what happens. Always.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-bg pt-20 pb-16">
        <div className="max-w-site mx-auto px-6">
          <p className="font-ui text-xs tracking-[0.3em] uppercase text-gold mb-4">Our Story</p>
          <h1 className="font-display text-5xl md:text-6xl text-warm font-semibold mb-4">
            Six Years. One Standard.
          </h1>
          <div className="w-9 h-0.5 bg-gold" />
        </div>
      </section>

      {/* Origin story */}
      <section
        className="bg-surface py-20"
        style={{ borderTop: '1.5px solid #C9924A' }}
      >
        <div className="max-w-2xl mx-auto px-6">
          <div className="space-y-6 font-ui text-body text-base leading-relaxed">
            <p>
              SGD wasn&apos;t built in a boardroom. It was built in the street — learning how trust is earned one deal at a time.
            </p>
            <p>
              Three years of ground-level orientation. Three years of building structure on top of it. Over 42,000 buyers served. Over 8,500 items moved. One rule that never changed: structure first.
            </p>
            <p>
              The Lagos secondhand market was full of potential and full of chaos. Ghost sellers. Bait-and-switch listings. Buyers scammed. Sellers stranded. There was no platform anyone could trust end-to-end.
            </p>
            <p>
              SGD built that platform. Not by being the biggest, the cheapest, or the loudest — but by being the most consistent. Every deal, every time, same process.
            </p>
          </div>

          {/* Pull quote */}
          <blockquote
            className="my-14 px-8 py-6"
            style={{ borderLeft: '2px solid #C9924A' }}
          >
            <p className="font-display text-2xl md:text-3xl text-warm font-semibold leading-snug italic">
              &ldquo;We didn&apos;t become trusted because we were big. We became big because we were structured.&rdquo;
            </p>
          </blockquote>

          <div className="space-y-6 font-ui text-body text-base leading-relaxed">
            <p>
              Today, SGD operates one of Lagos&apos; most trusted secondhand channels. Buyers come back. Sellers refer. The process doesn&apos;t change.
            </p>
            <p>
              We move furniture. Appliances. Electronics. All verified. All fixed-price. All structured.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-bg py-16">
        <div className="max-w-site mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { stat: '42,000+', label: 'Buyers Served' },
            { stat: '8,500+', label: 'Items Delivered' },
            { stat: '6 Years', label: 'In Business' },
            { stat: '2,000%+', label: 'Peak ROAS' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-mono text-3xl md:text-4xl text-gold font-bold mb-2">{s.stat}</p>
              <p className="font-ui text-xs tracking-[0.15em] uppercase text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section
        className="bg-surface py-20"
        style={{ borderTop: '1px solid rgba(201,146,74,0.3)' }}
      >
        <div className="max-w-site mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl text-warm font-semibold">What We Stand On</h2>
            <div className="w-9 h-0.5 bg-gold mx-auto mt-4" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="p-8"
                style={{
                  background: '#1A1A1A',
                  border: '1px solid rgba(201,146,74,0.2)',
                  borderRadius: '4px',
                }}
              >
                <h3 className="font-display text-2xl text-warm font-semibold mb-4">{v.title}</h3>
                <p className="font-ui text-sm text-muted leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bg py-16 text-center">
        <div className="max-w-site mx-auto px-6">
          <p className="font-hand text-2xl text-gold mb-6">Sufficient Grace | Structure First. Scale Second.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/listings"
              className="inline-block bg-gold text-bg font-ui text-sm font-semibold tracking-[0.15em] uppercase px-10 py-4 hover:bg-gold-light transition-colors"
              style={{ borderRadius: '2px' }}
            >
              Browse Listings
            </Link>
            <Link
              href="/how-it-works"
              className="inline-block font-ui text-sm font-semibold tracking-[0.15em] uppercase px-10 py-4 hover:text-gold transition-colors"
              style={{ border: '1px solid #C9924A', color: '#C9924A', borderRadius: '2px' }}
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
