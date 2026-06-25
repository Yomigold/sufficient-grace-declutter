'use client'
import { useState } from 'react'
import { NoteType } from '../../types'

const NOTE_TYPES: NoteType[] = ['Note', 'Call', 'Message', 'Meeting']

interface NoteFormProps {
  contactId: string
  onSaved: () => void
}

export default function NoteForm({ contactId, onSaved }: NoteFormProps) {
  const [type, setType] = useState<NoteType>('Note')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) { setError('Note text is required'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact_id: contactId, type, text: text.trim() }),
      })
      if (!res.ok) {
        const data = await res.json() as { error: string }
        throw new Error(data.error)
      }
      setText('')
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p className="text-danger text-sm font-ui">{error}</p>}
      <div className="flex gap-2 flex-wrap">
        {NOTE_TYPES.map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`px-3 py-1 rounded text-xs font-ui font-semibold uppercase tracking-widest border transition-colors ${
              type === t ? 'bg-gold text-bg border-gold' : 'border-ghost text-muted hover:border-muted'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <textarea
        className="w-full bg-surface3 border border-ghost rounded-lg px-3 py-2 text-body font-ui text-sm focus:outline-none focus:border-muted resize-none"
        rows={3}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add a note..."
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-gold text-bg rounded-lg font-ui text-sm font-semibold hover:bg-gold-light transition-colors disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Add Note'}
      </button>
    </form>
  )
}
