import Link from 'next/link'

export default function SellCTABanner() {
  return (
    <section
      className="bg-surface2 py-16"
      style={{ borderTop: '1.5px solid #C9924A' }}
    >
      <div className="max-w-site mx-auto px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl text-warm font-semibold mb-4">
          Have an Item to Sell?
        </h2>
        <div className="w-9 h-0.5 bg-gold mx-auto mb-6" />
        <p className="font-ui text-body text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          We list, market, and move it for you. Structured. No stress.
        </p>
        <Link
          href="/sell-with-us"
          className="inline-block bg-gold text-bg font-ui text-sm font-semibold tracking-[0.15em] uppercase px-10 py-4 hover:bg-gold-light transition-colors"
          style={{ borderRadius: '2px' }}
        >
          List Your Item With SGD
        </Link>
      </div>
    </section>
  )
}
