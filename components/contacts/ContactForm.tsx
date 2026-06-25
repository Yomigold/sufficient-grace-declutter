'use client'
import { useState } from 'react'
import { DealStage, LeadSource } from '../../types'

const STAGES: DealStage[] = ['New Lead', 'Contacted', 'Negotiating', 'Won', 'Lost']
const SOURCES: LeadSource[] = ['Instagram DM', 'WhatsApp', 'Referral', 'Walk-in', 'Facebook', 'Website', 'Other']

interface ContactFormProps {
  onSave: () => void
  onCancel: () => void
}

export default function ContactForm({ onSave, onCancel }: ContactFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [source, setSource] = useState<LeadSource>('WhatsApp')
  const [stage, setStage] = useState<DealStage>('New Lead')
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('Name is required'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || null,
          email: email.trim() || null,
          source,
          stage,
          value: value ? parseInt(value, 10) : 0,
          tags: [],
        }),
      })
      if (!res.ok) {
        const data = await res.json() as { error: string }
        throw new Error(data.error)
      }
      onSave()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full bg-surface3 border border-ghost rounded-lg px-3 py-2 text-body font-ui text-sm focus:outline-none focus:border-muted'
  const labelClass = 'block text-xs font-ui uppercase tracking-widest text-muted mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-danger text-sm font-ui">{error}</p>}
      <div>
        <label className={labelClass}>Name *</label>
        <input className={inputClass} value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />
      </div>
      <div>
        <label className={labelClass}>Phone</label>
        <input className={inputClass} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+234..." />
      </div>
      <div>
        <label className={labelClass}>Email</label>
        <input className={inputClass} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" />
      </div>
      <div>
        <label className={labelClass}>Source</label>
        <select className={inputClass} value={source} onChange={e => setSource(e.target.value as LeadSource)}>
          {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className={labelClass}>Stage</label>
        <select className={inputClass} value={stage} onChange={e => setStage(e.target.value as DealStage)}>
          {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className={labelClass}>Deal Value (₦)</label>
        <input className={inputClass} type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="0" />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2 border border-ghost rounded-lg text-muted font-ui text-sm hover:border-muted transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="flex-1 py-2 bg-gold text-bg rounded-lg font-ui text-sm font-semibold hover:bg-gold-light transition-colors disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Contact'}
        </button>
      </div>
    </form>
  )
}
