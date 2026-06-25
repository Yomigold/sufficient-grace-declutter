'use client'
import { useContacts } from '@/hooks/useContacts'
import { useTasks } from '@/hooks/useTasks'
import { useStats } from '@/hooks/useStats'
import StatCard from '@/components/ui/StatCard'
import TaskItem from '@/components/tasks/TaskItem'
import ContactCard from '@/components/contacts/ContactCard'
import { fmtN, todayStr } from '@/lib/utils'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function CRMHomePage() {
  const { contacts, loading: cLoading } = useContacts()
  const { tasks, loading: tLoading } = useTasks()
  const stats = useStats(contacts, tasks)

  const urgentTasks = tasks.filter(t => !t.done && (
    (t.due_date && t.due_date < todayStr()) || t.due_date === todayStr()
  )).slice(0, 5)

  const recent = contacts.slice(0, 3)

  if (cLoading || tLoading) {
    return (
      <div className="p-6">
        <div className="h-8 w-48 bg-surface2 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-2 gap-3">
          {[0,1,2,3].map(i => <div key={i} className="h-24 bg-surface2 rounded-xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <p className="text-muted text-sm font-ui">{greeting()},</p>
        <h1 className="font-display text-4xl text-warm">Mayowa</h1>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total Leads" value={stats.total} />
        <StatCard label="Active Deals" value={stats.active} />
        <StatCard label="Deals Won" value={stats.won} />
        <StatCard label="Open Tasks" value={stats.openTasks} />
      </div>

      <div className="bg-surface2 rounded-xl border border-ghost p-4">
        <p className="text-xs font-ui uppercase tracking-widest text-muted mb-1">Revenue Won</p>
        <p className="font-display text-4xl text-gold">{fmtN(stats.revenue)}</p>
      </div>

      {urgentTasks.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-ui uppercase tracking-widest text-muted">Urgent Tasks</p>
          {urgentTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}

      {recent.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-ui uppercase tracking-widest text-muted">Recent Activity</p>
          {recent.map(contact => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}
    </div>
  )
}
