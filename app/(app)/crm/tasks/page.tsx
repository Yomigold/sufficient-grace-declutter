'use client'
import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import TaskItem from '@/components/tasks/TaskItem'
import Modal from '@/components/ui/Modal'
import TaskForm from '@/components/tasks/TaskForm'
import { todayStr } from '@/lib/utils'

export default function TasksPage() {
  const { tasks, loading } = useTasks()
  const [showForm, setShowForm] = useState(false)
  const today = todayStr()

  const overdue = tasks.filter(t => !t.done && t.due_date && t.due_date < today)
  const dueToday = tasks.filter(t => !t.done && t.due_date === today)
  const upcoming = tasks.filter(t => !t.done && t.due_date && t.due_date > today)
  const done = tasks.filter(t => t.done).slice(0, 20)

  function Section({ title, items, color }: { title: string; items: typeof tasks; color?: string }) {
    if (items.length === 0) return null
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <p className="text-xs font-ui uppercase tracking-widest" style={{ color: color ?? '#888888' }}>{title}</p>
          <span className="text-xs font-ui text-muted">({items.length})</span>
        </div>
        {items.map(task => <TaskItem key={task.id} task={task} />)}
      </div>
    )
  }

  return (
    <div className="p-4 pb-8 space-y-5">
      <div className="flex items-center justify-between pt-2">
        <h1 className="font-display text-3xl text-warm">Tasks</h1>
        <button
          onClick={() => setShowForm(true)}
          className="w-9 h-9 bg-gold text-bg rounded-full flex items-center justify-center hover:bg-gold-light transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0,1,2].map(i => <div key={i} className="h-16 bg-surface2 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <>
          <Section title="Overdue" items={overdue} color="#C94A4A" />
          <Section title="Today" items={dueToday} color="#E8B87A" />
          <Section title="Upcoming" items={upcoming} color="#C9924A" />
          <Section title="Done" items={done} color="#5CBF6A" />
          {tasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted font-ui text-sm">No tasks yet</p>
            </div>
          )}
        </>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="New Task">
        <TaskForm onSaved={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
      </Modal>
    </div>
  )
}
