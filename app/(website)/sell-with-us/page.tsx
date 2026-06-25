'use client'

import { useState } from 'react'
import type { Metadata } from 'next'

// Note: metadata export only works in server components. This page uses client state for the form.
// SEO is handled via the parent layout metadata.

type FormState = 'idle' | 'loading' | 'success' | 'error'

const BENEFITS = [
  {
    title: 'We Vet Buyers',
    body: 'Buyers pay us first. No tyre-kickers. No time-wasters. Your item moves to serious buyers only.',
  },
  {
    title: 'We Handle Inquiries',
    body: 'Our AI (Esther) handles all first-contact messages. You focus on your life.',
  },
  {
    title: 'Fair Pricing',
    body: 'We set a competitive market price. You get the agreed seller payout when the item moves.',
  },
]

export default function SellWithUsPage() {
  const [form, setForm] = useState({
    seller_name: '',
    whatsapp_number: '',
    item_name: '',
    item_category: '',
    item_condition: '',
    asking_price: '',
    location: '',
    description: '',
  })
  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function buildWhatsAppMessage() {
    return encodeURIComponent(
      `Hi SGD — I'd like to list an item.\n\n` +
      `Name: ${form.seller_name}\n` +
      `WhatsApp: ${form.whatsapp_number}\n` +
      `Item: ${form.item_name}\n` +
      `Category: ${form.item_category}\n` +
      `Condition: ${form.item_condition}\n` +
      `Asking Price: ₦${form.asking_price}\n` +
      `Location: ${form.location}\n` +
      `Notes: ${form.description || 'None'}`
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const required = ['seller_name', 'whatsapp_number', 'item_name', 'item_category', 'item_condition', 'asking_price', 'location'] as const
    for (const field of required) {
      if (!form[field].trim()) {
        setError('Please fill in all required fields.')
        setState('error')
        return
      }
    }
    setState('loading')
    const url = `https://wa.me/2348000000000?text=${buildWhatsAppMessage()}`
    setTimeout(() => {
      window.open(url, '_blank')
      setState('success')
    }, 400)
  }

  const inputClass = "w-full bg-surface border font-ui text-sm text-body placeholder:text-ghost px-4 py-3.5 focus:outline-none focus:border-gold transition-colors"
  const inputStyle = { border: '1px solid rgba(201,146,74,0.2)', borderRadius: '2px' }
  const focusStyle = { borderColor: '#C9924A' }

  return (
    <>
      {/* Hero */}
      <section className="bg-bg pt-20 pb-16">
        <div className="max-w-site mx-auto px-6 text-center">
          <p className="font-ui text-xs tracking-[0.3em] uppercase text-gold mb-4">For Sellers</p>
          <h1 className="font-display text-5xl md:text-6xl text-warm font-semibold mb-4">
            Sell Through SGD
          </h1>
          <div className="w-9 h-0.5 bg-gold mx-auto mb-6" />
          <p className="font-ui text-body text-lg max-w-xl mx-auto leading-relaxed">
            We handle the listing, the marketing, and the buyer.
            You get your money when the deal closes.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section
        className="bg-surface py-16"
        style={{ borderTop: '1.5px solid #C9924A' }}
      >
        <div className="max-w-site mx-auto px-6 grid md:grid-cols-3 gap-6">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="p-8"
              style={{
                background: '#1A1A1A',
                border: '1px solid rgba(201,146,74,0.2)',
                borderRadius: '4px',
              }}
            >
              <h3 className="font-display text-2xl text-warm font-semibold mb-4">{b.title}</h3>
              <p className="font-ui text-sm text-muted leading-relaxed">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How seller process works */}
      <section className="bg-bg py-16">
        <div className="max-w-site mx-auto px-6">
          <h2 className="font-display text-3xl text-warm font-semibold mb-10 text-center">
            How It Works for Sellers
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { n: '01', t: 'Submit Your Item', d: 'Fill the form below. Send photos via WhatsApp.' },
              { n: '02', t: 'We Review', d: 'We assess condition and set a competitive price.' },
              { n: '03', t: 'We List & Market', d: 'Your item goes on our page. We drive buyers to it.' },
              { n: '04', t: 'You Get Paid', d: "Item sells, buyer confirms, you receive your payout." },
            ].map((s) => (
              <div key={s.n} className="text-center">
                <p className="font-mono text-4xl text-gold mb-3" style={{ opacity: 0.3 }}>{s.n}</p>
                <h3 className="font-display text-xl text-warm font-semibold mb-2">{s.t}</h3>
                <p className="font-ui text-xs text-muted leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intake form */}
      <section
        className="bg-surface py-20"
        style={{ borderTop: '1px solid rgba(201,146,74,0.3)' }}
      >
        <div className="max-w-xl mx-auto px-6">
          <h2 className="font-display text-3xl text-warm font-semibold mb-3">Submit Your Item</h2>
          <div className="w-9 h-0.5 bg-gold mb-8" />

          {state === 'success' ? (
            <div
              className="text-center py-12 px-8"
              style={{
                background: '#1A1A1A',
                border: '1px solid #C9924A',
                borderRadius: '4px',
              }}
            >
              <p className="font-display text-3xl text-gold mb-3">Submitted.</p>
              <p className="font-ui text-sm text-body leading-relaxed">
                Your WhatsApp has opened with your item details. We&apos;ll review and reach out within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="font-ui text-xs tracking-[0.1em] uppercase text-muted block mb-2">
                    Your Name <span className="text-gold">*</span>
                  </label>
                  <input
                    type="text"
                    name="seller_name"
                    value={form.seller_name}
                    onChange={handleChange}
                    placeholder="Full name"
                    className={inputClass}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label className="font-ui text-xs tracking-[0.1em] uppercase text-muted block mb-2">
                    WhatsApp Number <span className="text-gold">*</span>
                  </label>
                  <input
                    type="tel"
                    name="whatsapp_number"
                    value={form.whatsapp_number}
                    onChange={handleChange}
                    placeholder="+234..."
                    className={inputClass}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-ui text-xs tracking-[0.1em] uppercase text-muted block mb-2">
                  Item Name <span className="text-gold">*</span>
                </label>
                <input
                  type="text"
                  name="item_name"
                  value={form.item_name}
                  onChange={handleChange}
                  placeholder="e.g. LG Double-Door Refrigerator 570L"
                  className={inputClass}
                  style={inputStyle}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="font-ui text-xs tracking-[0.1em] uppercase text-muted block mb-2">
                    Category <span className="text-gold">*</span>
                  </label>
                  <select
                    name="item_category"
                    value={form.item_category}
                    onChange={handleChange}
                    className={inputClass}
                    style={inputStyle}
                    required
                  >
                    <option value="">Select category</option>
                    <option>Furniture</option>
                    <option>Appliances</option>
                    <option>Electronics</option>
                  </select>
                </div>
                <div>
                  <label className="font-ui text-xs tracking-[0.1em] uppercase text-muted block mb-2">
                    Condition <span className="text-gold">*</span>
                  </label>
                  <select
                    name="item_condition"
                    value={form.item_condition}
                    onChange={handleChange}
                    className={inputClass}
                    style={inputStyle}
                    required
                  >
                    <option value="">Select condition</option>
                    <option>Clean</option>
                    <option>Near-New</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="font-ui text-xs tracking-[0.1em] uppercase text-muted block mb-2">
                    Asking Price (NGN) <span className="text-gold">*</span>
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-gold"
                    >
                      ₦
                    </span>
                    <input
                      type="number"
                      name="asking_price"
                      value={form.asking_price}
                      onChange={handleChange}
                      placeholder="0"
                      className={inputClass}
                      style={{ ...inputStyle, paddingLeft: '2rem' }}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="font-ui text-xs tracking-[0.1em] uppercase text-muted block mb-2">
                    Location (Lagos Area) <span className="text-gold">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Lekki Phase 1"
                    className={inputClass}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-ui text-xs tracking-[0.1em] uppercase text-muted block mb-2">
                  Description (optional)
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Any extra details about the item's condition, age, or accessories..."
                  rows={4}
                  maxLength={300}
                  className={inputClass}
                  style={inputStyle}
                />
                <p className="font-ui text-xs text-ghost-text mt-1 text-right">
                  {form.description.length}/300
                </p>
              </div>

              {state === 'error' && (
                <p className="font-ui text-xs text-danger">{error}</p>
              )}

              <div
                className="px-4 py-3 text-sm font-ui text-muted leading-relaxed"
                style={{ background: 'rgba(201,146,74,0.05)', border: '1px solid rgba(201,146,74,0.2)', borderRadius: '2px' }}
              >
                SGD only accepts clean or near-new items. Faulty or heavily used items will not be listed.
              </div>

              <button
                type="submit"
                disabled={state === 'loading'}
                className="w-full bg-gold text-bg font-ui text-sm font-semibold tracking-[0.15em] uppercase py-4 hover:bg-gold-light transition-colors disabled:opacity-50"
                style={{ borderRadius: '2px' }}
              >
                {state === 'loading' ? 'Opening WhatsApp...' : 'Submit Your Item'}
              </button>

              <p className="font-ui text-xs text-muted text-center">
                Submitting opens WhatsApp with your details pre-filled. We review within 24 hours.
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
