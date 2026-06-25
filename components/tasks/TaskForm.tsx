'use client'
import { useState } from 'react'
import { todayStr } from '../../lib/utils'

interface TaskFormProps {
  contactId?: string
  onSaved: () => void
  onCancel: () => void
}

export default function TaskForm({ contactId, onSaved, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState(todayStr())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          due_date: dueDate || null,
          contact_id: contactId ?? null,
          done: false,
        }),
      })
      if (!res.ok) {
        const data = await res.json() as { error: string }
        throw new Error(data.error)
      }
      onSaved()
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
        <label className={labelClass}>Task</label>
        <input className={inputClass} value={title} onChange={e => setTitle(e.target.value)} placeholder="Follow up on..." />
      </div>
      <div>
        <label className={labelClass}>Due Date</label>
        <input className={inputClass} type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="flex-1 py-2 border border-ghost rounded-lg text-muted font-ui text-sm hover:border-muted transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="flex-1 py-2 bg-gold text-bg rounded-lg font-ui text-sm font-semibold hover:bg-gold-light transition-colors disabled:opacity-50">
          {loading ? 'Saving...' : 'Add Task'}
        </button>
      </div>
    </form>
  )
}
