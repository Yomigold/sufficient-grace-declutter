import type { Metadata } from 'next'
import Link from 'next/link'
import { buildWhatsAppLink } from '@/lib/sgd-listings'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about buying and selling through Sufficient Grace Declutter.',
}

const FAQS = [
  {
    category: 'Buying',
    items: [
      {
        q: 'Why do I pay SGD and not the seller directly?',
        a: 'Payment to SGD creates a layer of accountability. The seller only gets paid once the transaction closes. This protects you from ghosting, fake listings, and bait-and-switch tactics.',
      },
      {
        q: "What if the item isn't as described?",
        a: 'We only list clean or near-new items. If we\'ve confirmed an item, it meets our standard. For Point & Kill purchases, our inspection is the guarantee.',
      },
      {
        q: 'Can I negotiate the price?',
        a: 'No. Prices are fixed and non-negotiable. The price you see is the price you pay — no back-and-forth.',
      },
      {
        q: "What's the difference between Point & Kill and Self Inspection?",
        a: 'Point & Kill: you pay SGD, we inspect the item at source and deliver to you. Self Inspection: you pay SGD, we give you the seller\'s details, you arrange your own visit and pickup.',
      },
      {
        q: 'How do I inquire about an item?',
        a: 'Send the item name or screenshot to our WhatsApp or Instagram DM. We confirm availability and next steps.',
      },
      {
        q: 'How quickly can I receive an item?',
        a: 'Depends on the item and route. Point & Kill usually moves within 24–48 hours of payment. Self Inspection is on your timeline after we release seller details.',
      },
    ],
  },
  {
    category: 'Selling',
    items: [
      {
        q: 'What condition must my item be in to list with SGD?',
        a: 'Clean or near-new only. Faulty, heavily used, or cosmetically damaged beyond acceptable range will not be listed. We maintain standards to protect buyer trust.',
      },
      {
        q: 'How is the listing price set?',
        a: 'We assess your item and set a competitive market price. You agree on a seller payout upfront before listing.',
      },
      {
        q: 'When do I get paid as a seller?',
        a: 'Once the buyer confirms receipt and the deal closes, your payout is processed.',
      },
      {
        q: 'Do I need to be present for the inspection?',
        a: "For Point & Kill purchases, yes — we come to you. For Self Inspection, the buyer arranges directly after we share your details.",
      },
    ],
  },
  {
    category: 'General',
    items: [
      {
        q: 'Where is SGD based?',
        a: 'Lagos, Nigeria. We operate across all major Lagos areas.',
      },
      {
        q: 'How do I contact SGD?',
        a: 'WhatsApp or Instagram DM @sufficientgracedeclutter. Our AI (Esther) handles first response 24/7. Human handover for complex inquiries.',
      },
      {
        q: 'How long has SGD been operating?',
        a: 'Six years. Three years of ground-level market experience, three years of structured operations on top of it.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-bg pt-20 pb-16">
        <div className="max-w-site mx-auto px-6">
          <p className="font-ui text-xs tracking-[0.3em] uppercase text-gold mb-4">Help</p>
          <h1 className="font-display text-5xl md:text-6xl text-warm font-semibold mb-4">
            Frequently Asked Questions
          </h1>
          <div className="w-9 h-0.5 bg-gold" />
        </div>
      </section>

      <section
        className="bg-surface py-16"
        style={{ borderTop: '1.5px solid #C9924A' }}
      >
        <div className="max-w-2xl mx-auto px-6 space-y-14">
          {FAQS.map((section) => (
            <div key={section.category}>
              <h2 className="font-ui text-xs tracking-[0.3em] uppercase text-gold mb-6">
                {section.category}
              </h2>
              <div className="space-y-0">
                {section.items.map((faq, i) => (
                  <div
                    key={i}
                    className="py-6"
                    style={{ borderBottom: '1px solid rgba(201,146,74,0.15)' }}
                  >
                    <h3 className="font-display text-xl text-warm font-semibold mb-3">
                      {faq.q}
                    </h3>
                    <p className="font-ui text-sm text-body leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still have questions */}
      <section className="bg-bg py-16 text-center">
        <div className="max-w-site mx-auto px-6">
          <p className="font-display text-3xl text-warm font-semibold mb-4">
            Still have a question?
          </p>
          <p className="font-ui text-body mb-8">We&apos;re one message away.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={buildWhatsAppLink('Hi SGD, I have a question.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gold text-bg font-ui text-sm font-semibold tracking-[0.15em] uppercase px-10 py-4 hover:bg-gold-light transition-colors"
              style={{ borderRadius: '2px' }}
            >
              Ask on WhatsApp
            </a>
            <Link
              href="/contact"
              className="inline-block font-ui text-sm font-semibold tracking-[0.15em] uppercase px-10 py-4 hover:text-gold transition-colors"
              style={{ border: '1px solid #C9924A', color: '#C9924A', borderRadius: '2px' }}
            >
              Contact Page
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
