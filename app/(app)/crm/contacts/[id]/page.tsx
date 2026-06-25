'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Contact, Note, Task, DealStage } from '@/types'
import Avatar from '@/components/ui/Avatar'
import StageBadge from '@/components/ui/StageBadge'
import StageChanger from '@/components/contacts/StageChanger'
import NoteForm from '@/components/notes/NoteForm'
import TaskItem from '@/components/tasks/TaskItem'
import TaskForm from '@/components/tasks/TaskForm'
import Modal from '@/components/ui/Modal'
import { fmtN, fmtAgo } from '@/lib/utils'

type ContactDetail = Contact & { notes: Note[]; tasks: Task[] }

export default function ContactDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [contact, setContact] = useState<ContactDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [stageLoading, setStageLoading] = useState(false)
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch(`/api/contacts/${id}`)
    if (!res.ok) { router.push('/crm/contacts'); return }
    const data = await res.json() as ContactDetail
    setContact(data)
    setLoading(false)
  }, [id, router])

  useEffect(() => { load() }, [load])

  async function handleStageChange(stage: DealStage) {
    if (!contact) return
    setStageLoading(true)
    await fetch(`/api/contacts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    })
    await load()
    setStageLoading(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this contact?')) return
    await fetch(`/api/contacts/${id}`, { method: 'DELETE' })
    router.push('/crm/contacts')
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-14 w-14 bg-surface2 rounded-full animate-pulse" />
        <div className="h-8 w-48 bg-surface2 rounded animate-pulse" />
      </div>
    )
  }

  if (!contact) return null

  const notes = [...(contact.notes ?? [])].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  const tasks = contact.tasks ?? []

  return (
    <div className="p-4 pb-8 space-y-5">
      <div className="flex items-center gap-2 pt-2">
        <button onClick={() => router.back()} className="text-muted hover:text-body transition-colors p-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <span className="text-xs font-ui text-muted">Back</span>
      </div>

      <div className="flex items-center gap-4">
        <Avatar name={contact.name} size="lg" />
        <div>
          <h1 className="font-display text-3xl text-warm">{contact.name}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <StageBadge stage={contact.stage} />
            <span className="text-xs font-ui text-muted">{contact.source}</span>
            {contact.value > 0 && <span className="text-xs font-ui text-gold">{fmtN(contact.value)}</span>}
          </div>
        </div>
      </div>

      {(contact.phone || contact.email) && (
        <div className="flex gap-3">
          {contact.phone && (
            <a href={`tel:${contact.phone}`} className="flex-1 bg-surface2 border border-ghost rounded-xl p-3 text-center">
              <p className="text-xs font-ui text-muted uppercase tracking-wider">Phone</p>
              <p className="text-sm font-ui text-gold mt-0.5">{contact.phone}</p>
            </a>
          )}
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="flex-1 bg-surface2 border border-ghost rounded-xl p-3 text-center">
              <p className="text-xs font-ui text-muted uppercase tracking-wider">Email</p>
              <p className="text-sm font-ui text-gold mt-0.5 truncate">{contact.email}</p>
            </a>
          )}
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-ui uppercase tracking-widest text-muted">Stage</p>
        <StageChanger current={contact.stage} onChange={handleStageChange} loading={stageLoading} />
      </div>

      {contact.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {contact.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-surface3 rounded text-xs font-ui text-muted uppercase tracking-wider">{tag}</span>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-ui uppercase tracking-widest text-muted">Tasks</p>
          <button onClick={() => setShowTaskForm(true)} className="text-xs font-ui text-gold hover:text-gold-light transition-colors">+ Task</button>
        </div>
        {tasks.length === 0 ? (
          <p className="text-xs font-ui text-muted">No tasks yet</p>
        ) : (
          <div className="space-y-2">
            {tasks.map(task => <TaskItem key={task.id} task={task} onToggle={load} />)}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-ui uppercase tracking-widest text-muted">Activity Log</p>
          <button onClick={() => setShowNoteForm(true)} className="text-xs font-ui text-gold hover:text-gold-light transition-colors">+ Note</button>
        </div>
        {notes.length === 0 ? (
          <p className="text-xs font-ui text-muted">No activity yet</p>
        ) : (
          <div className="space-y-2">
            {notes.map(note => (
              <div key={note.id} className="bg-surface2 rounded-xl border border-ghost p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-ui text-gold uppercase tracking-wider">{note.type}</span>
                  <span className="text-xs font-ui text-muted">{fmtAgo(note.created_at)}</span>
                </div>
                <p className="text-sm font-ui text-body">{note.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleDelete}
        className="w-full py-2 border border-danger rounded-xl text-danger font-ui text-sm hover:bg-danger/10 transition-colors"
      >
        Delete Contact
      </button>

      <Modal open={showNoteForm} onClose={() => setShowNoteForm(false)} title="Log Activity">
        <NoteForm contactId={contact.id} onSaved={() => { setShowNoteForm(false); load() }} />
      </Modal>

      <Modal open={showTaskForm} onClose={() => setShowTaskForm(false)} title="Add Task">
        <TaskForm contactId={contact.id} onSaved={() => { setShowTaskForm(false); load() }} onCancel={() => setShowTaskForm(false)} />
      </Modal>
    </div>
  )
}
