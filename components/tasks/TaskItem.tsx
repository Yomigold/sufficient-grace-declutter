'use client'
import { Task } from '../../types'
import { fmtDue } from '../../lib/utils'
import { getSupabaseClient } from '../../lib/supabase/client'

interface TaskItemProps {
  task: Task & { contacts?: { name: string } | null }
  onToggle?: () => void
}

export default function TaskItem({ task, onToggle }: TaskItemProps) {
  async function handleToggle() {
    const supabase = getSupabaseClient()
    await supabase.from('tasks').update({ done: !task.done }).eq('id', task.id)
    onToggle?.()
  }

  const isOverdue = task.due_date && !task.done && new Date(task.due_date) < new Date()

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${isOverdue ? 'border-danger bg-danger/5' : 'border-ghost bg-surface2'}`}>
      <button
        onClick={handleToggle}
        className={`mt-0.5 w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
          task.done ? 'bg-success border-success' : 'border-ghost hover:border-muted'
        }`}
      >
        {task.done && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0C0C0C" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-ui ${task.done ? 'text-muted line-through' : 'text-body'}`}>{task.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-xs font-ui ${isOverdue ? 'text-danger' : 'text-muted'}`}>
            {fmtDue(task.due_date)}
          </span>
          {task.contacts?.name && (
            <>
              <span className="text-ghost">·</span>
              <span className="text-xs font-ui text-muted">{task.contacts.name}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
