const TESTIMONIALS = [
  {
    quote: 'Paid, picked up same day, condition was exactly as shown. No wahala.',
    name: 'Buyer — Lagos Island',
    item: 'LG Double-Door Fridge',
  },
  {
    quote: 'SGD is the only secondhand platform I trust. Structure is real.',
    name: 'Buyer — Lekki',
    item: '4-Seater Sofa Set',
  },
  {
    quote: 'Point & Kill mode saved me stress. They delivered and set it up.',
    name: 'Buyer — Ajah',
    item: 'Samsung Washing Machine',
  },
]

export default function Testimonials() {
  return (
    <section className="bg-bg py-20">
      <div
        className="max-w-site mx-auto px-6"
        style={{ borderTop: '1px solid rgba(201,146,74,0.3)', paddingTop: '5rem' }}
      >
        <div className="text-center mb-14">
          <p className="font-ui text-xs tracking-[0.3em] uppercase text-gold mb-3">Social Proof</p>
          <h2 className="font-display text-4xl md:text-5xl text-warm font-semibold">
            What Buyers Say
          </h2>
          <div className="w-9 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="p-8 flex flex-col"
              style={{
                background: '#111111',
                border: '1px solid rgba(201,146,74,0.15)',
                borderRadius: '4px',
              }}
            >
              {/* Gold opening quotation */}
              <p
                className="font-display text-5xl text-gold leading-none mb-4 select-none"
                style={{ opacity: 0.6 }}
                aria-hidden
              >
                &ldquo;
              </p>
              <p className="font-display text-xl text-warm leading-relaxed flex-1 mb-6">
                {t.quote}
              </p>
              <div
                className="pt-4"
                style={{ borderTop: '1px solid rgba(201,146,74,0.15)' }}
              >
                <p className="font-ui text-xs font-semibold text-body">{t.name}</p>
                <p className="font-ui text-xs text-gold mt-1">{t.item}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
