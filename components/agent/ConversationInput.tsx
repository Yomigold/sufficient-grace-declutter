'use client'
import { useState } from 'react'
import { ExtractionResult } from '../../types'

const DEMO_THREADS = {
  whatsapp: `Customer: Hello do you have washing machine? Budget 60k\nSGD: Yes! We have a Haier Thermocool 7kg, near-new, 58000. Interested?\nCustomer: Yes please how do I pay`,
  instagram: `Customer: I saw the dining table. Still available?\nSGD: Yes! 6-seater, good condition, 95000. Interested?\nCustomer: Yes I want it. Can I come tomorrow?\nSGD: Absolutely! Let us know when you're ready to pay and we'll confirm.`,
}

interface ConversationInputProps {
  onExtracted: (result: ExtractionResult) => void
  onTabChange: (tab: 'paste' | 'extracted' | 'setup') => void
}

export default function ConversationInput({ onExtracted, onTabChange }: ConversationInputProps) {
  const [source, setSource] = useState('WhatsApp')
  const [thread, setThread] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleExtract() {
    if (!thread.trim()) { setError('Paste a conversation thread first'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread: thread.trim(), source }),
      })
      const data = await res.json() as { success?: boolean; data?: ExtractionResult; error?: string }
      if (!res.ok || !data.data) throw new Error(data.error ?? 'Extraction failed')
      onExtracted(data.data)
      onTabChange('extracted')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-ui uppercase tracking-widest text-muted mb-1">Source</label>
        <select
          className="w-full bg-surface3 border border-ghost rounded-lg px-3 py-2 text-body font-ui text-sm focus:outline-none focus:border-muted"
          value={source}
          onChange={e => setSource(e.target.value)}
        >
          <option>WhatsApp</option>
          <option>Instagram DM</option>
          <option>Other</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setThread(DEMO_THREADS.whatsapp)}
          className="text-xs font-ui text-gold border border-gold/30 rounded px-2 py-1 hover:bg-gold/10 transition-colors"
        >
          Load WA Demo
        </button>
        <button
          onClick={() => setThread(DEMO_THREADS.instagram)}
          className="text-xs font-ui text-gold border border-gold/30 rounded px-2 py-1 hover:bg-gold/10 transition-colors"
        >
          Load IG Demo
        </button>
      </div>
      <textarea
        className="w-full bg-surface3 border border-ghost rounded-lg px-3 py-2 text-body font-ui text-sm focus:outline-none focus:border-muted resize-none"
        rows={10}
        value={thread}
        onChange={e => setThread(e.target.value)}
        placeholder="Paste Instagram DM or WhatsApp thread here..."
      />
      {error && <p className="text-danger text-sm font-ui">{error}</p>}
      <button
        onClick={handleExtract}
        disabled={loading}
        className="w-full py-3 bg-gold text-bg rounded-xl font-ui font-semibold hover:bg-gold-light transition-colors disabled:opacity-50"
      >
        {loading ? 'Extracting with AI...' : 'Extract CRM Data'}
      </button>
    </div>
  )
}
