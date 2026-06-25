import Link from 'next/link'

const STEPS = [
  {
    number: '01',
    title: 'You Spot the Item',
    body: 'See something on our page or Instagram. Send us a screenshot on DM or WhatsApp.',
  },
  {
    number: '02',
    title: 'You Pay Upfront',
    body: 'We confirm availability. You pay SGD first. No negotiations. No exceptions.',
  },
  {
    number: '03',
    title: 'Choose Your Route',
    body: 'Point & Kill — we inspect and deliver. Self Inspection — we send you the seller\'s location.',
  },
  {
    number: '04',
    title: 'Item Confirmed & Moved',
    body: 'Clean or near-new condition only. What you see is what you get.',
  },
]

export default function HowItWorksPreview() {
  return (
    <section className="bg-bg py-20">
      {/* Gold hairline divider */}
      <div
        className="max-w-site mx-auto px-6"
        style={{ borderTop: '1px solid rgba(201,146,74,0.3)', marginBottom: '5rem' }}
      />

      <div className="max-w-site mx-auto px-6">
        <div className="text-center mb-14">
          <p className="font-ui text-xs tracking-[0.3em] uppercase text-gold mb-3">The Process</p>
          <h2 className="font-display text-4xl md:text-5xl text-warm font-semibold">
            How SGD Works
          </h2>
          <div className="w-9 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {STEPS.map((step) => (
            <div key={step.number} className="relative">
              {/* Large ghost number */}
              <p
                className="font-mono font-bold mb-4 select-none"
                style={{ fontSize: '48px', color: '#C9924A', opacity: 0.3, lineHeight: 1 }}
              >
                {step.number}
              </p>
              <h3 className="font-display text-xl text-warm font-semibold mb-3">
                {step.title}
              </h3>
              <p className="font-ui text-sm text-muted leading-relaxed">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/how-it-works"
            className="inline-block font-ui text-sm font-semibold tracking-[0.15em] uppercase px-8 py-4 hover:text-gold transition-colors"
            style={{
              border: '1px solid #C9924A',
              color: '#C9924A',
              borderRadius: '2px',
            }}
          >
            Full Process Details
          </Link>
        </div>
      </div>
    </section>
  )
}
