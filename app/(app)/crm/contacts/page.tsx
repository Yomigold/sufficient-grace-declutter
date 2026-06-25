'use client'
import { useState } from 'react'
import { useContacts } from '@/hooks/useContacts'
import ContactCard from '@/components/contacts/ContactCard'
import Modal from '@/components/ui/Modal'
import ContactForm from '@/components/contacts/ContactForm'
import { DealStage } from '@/types'

const STAGES: Array<'All' | DealStage> = ['All', 'New Lead', 'Contacted', 'Negotiating', 'Won', 'Lost']

export default function ContactsPage() {
  const { contacts, loading } = useContacts()
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState<'All' | DealStage>('All')
  const [showForm, setShowForm] = useState(false)

  const filtered = contacts.filter(c => {
    const matchesStage = stageFilter === 'All' || c.stage === stageFilter
    const q = search.toLowerCase()
    const matchesSearch = !q || c.name.toLowerCase().includes(q) || (c.phone ?? '').includes(q)
    return matchesStage && matchesSearch
  })

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between pt-2">
        <h1 className="font-display text-3xl text-warm">Contacts</h1>
        <button
          onClick={() => setShowForm(true)}
          className="w-9 h-9 bg-gold text-bg rounded-full flex items-center justify-center hover:bg-gold-light transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

      <input
        className="w-full bg-surface2 border border-ghost rounded-xl px-4 py-2.5 text-body font-ui text-sm focus:outline-none focus:border-muted"
        placeholder="Search by name or phone..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {STAGES.map(stage => (
          <button
            key={stage}
            onClick={() => setStageFilter(stage)}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-ui font-semibold uppercase tracking-wider transition-colors ${
              stageFilter === stage ? 'bg-gold text-bg' : 'bg-surface2 text-muted border border-ghost'
            }`}
          >
            {stage}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0,1,2].map(i => <div key={i} className="h-20 bg-surface2 rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted font-ui text-sm">No contacts found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(contact => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="New Contact">
        <ContactForm onSave={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
      </Modal>
    </div>
  )
}
