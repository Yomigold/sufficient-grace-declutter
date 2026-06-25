'use client'

import { useState } from 'react'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function LaunchPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setState('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong.')
        setState('error')
      } else {
        setState('success')
        setName('')
        setEmail('')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setState('error')
    }
  }

  return (
    <div className="min-h-screen bg-bg text-body font-ui">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <span className="font-display text-xl text-gold tracking-widest uppercase">
          Aether AI
        </span>
        <a
          href="#waitlist"
          className="text-xs text-gold border border-gold px-4 py-2 tracking-widest uppercase hover:bg-gold hover:text-bg transition-colors"
        >
          Join Waitlist
        </a>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-28 text-center">
        <p className="text-xs tracking-[0.3em] text-gold uppercase mb-6">
          AI Automation Studio
        </p>
        <h1 className="font-display text-5xl md:text-7xl text-warm leading-tight mb-8">
          Automate the Ordinary.<br />
          <span className="text-gold italic">Amplify the Extraordinary.</span>
        </h1>
        <p className="text-body text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
          Aether AI builds intelligent automation systems for ambitious businesses — eliminating
          repetitive work, surfacing real-time insights, and freeing your team to focus on
          what actually drives growth.
        </p>
        <a
          href="#waitlist"
          className="inline-block bg-gold text-bg text-sm tracking-widest uppercase px-10 py-4 hover:bg-gold-light transition-colors font-semibold"
        >
          Get Early Access
        </a>
      </section>

      {/* Divider */}
      <div className="border-t border-surface3 max-w-5xl mx-auto" />

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-10">
        {[
          {
            icon: '⚡',
            title: 'Workflow Automation',
            desc: 'We map and automate your most time-consuming business processes — from client intake to follow-up sequences — so nothing falls through the cracks.',
          },
          {
            icon: '🧠',
            title: 'AI-Powered Insights',
            desc: 'Real-time dashboards and intelligent agents that surface what matters: pipeline health, task velocity, revenue signals, and more.',
          },
          {
            icon: '🔗',
            title: 'Seamless Integration',
            desc: 'We connect your existing tools — CRMs, messaging platforms, spreadsheets, and custom systems — into a single, unified intelligence layer.',
          },
          {
            icon: '🛠',
            title: 'Done-For-You Build',
            desc: 'No prompting, no tinkering. Our team handles everything from strategy and design to deployment and ongoing optimisation.',
          },
        ].map((f) => (
          <div key={f.title} className="bg-surface border border-surface3 p-8">
            <div className="text-3xl mb-4">{f.icon}</div>
            <h3 className="font-display text-2xl text-warm mb-3">{f.title}</h3>
            <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Divider */}
      <div className="border-t border-surface3 max-w-5xl mx-auto" />

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4 text-center">How It Works</p>
        <h2 className="font-display text-4xl text-warm text-center mb-16">
          From Consultation to Running System
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Discovery Call', desc: 'We learn your business, your bottlenecks, and your goals in a focused 45-minute session.' },
            { step: '02', title: 'Custom Build', desc: 'Our team architects and builds your automation suite — tailored to your workflow, not a template.' },
            { step: '03', title: 'Launch & Optimise', desc: 'We deploy, train your team, and monitor performance — continuously improving over time.' },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <p className="font-display text-5xl text-gold opacity-40 mb-4">{s.step}</p>
              <h3 className="font-display text-xl text-warm mb-3">{s.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-surface3 max-w-5xl mx-auto" />

      {/* Waitlist */}
      <section id="waitlist" className="max-w-2xl mx-auto px-6 py-28 text-center">
        <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">Early Access</p>
        <h2 className="font-display text-4xl text-warm mb-6">
          Be First in Line
        </h2>
        <p className="text-muted text-sm mb-12 leading-relaxed max-w-lg mx-auto">
          We&apos;re onboarding a limited number of founding clients at exclusive early-access pricing.
          Join the waitlist to secure your spot and get updates as we launch.
        </p>

        {state === 'success' ? (
          <div className="bg-surface border border-gold p-10">
            <p className="font-display text-3xl text-gold mb-3">You&apos;re on the list.</p>
            <p className="text-muted text-sm">
              We&apos;ll be in touch soon with your early access details. Watch your inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-surface border border-surface3 text-body placeholder:text-ghost px-5 py-4 text-sm focus:outline-none focus:border-gold transition-colors"
            />
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-surface border border-surface3 text-body placeholder:text-ghost px-5 py-4 text-sm focus:outline-none focus:border-gold transition-colors"
            />
            {state === 'error' && (
              <p className="text-danger text-xs text-left">{errorMsg}</p>
            )}
            <button
              type="submit"
              disabled={state === 'loading'}
              className="bg-gold text-bg text-sm tracking-widest uppercase py-4 font-semibold hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              {state === 'loading' ? 'Submitting...' : 'Join the Waitlist'}
            </button>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-surface3 py-10 px-6 text-center">
        <p className="font-display text-lg text-gold tracking-widest uppercase mb-2">Aether AI</p>
        <p className="text-ghost text-xs tracking-wide">
          Intelligent Automation for the Modern Business
        </p>
      </footer>
    </div>
  )
}
