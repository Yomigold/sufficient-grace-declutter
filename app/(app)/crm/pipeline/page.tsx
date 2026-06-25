'use client'
import { useState } from 'react'
import { useContacts } from '@/hooks/useContacts'
import { useStats } from '@/hooks/useStats'
import { useTasks } from '@/hooks/useTasks'
import ContactCard from '@/components/contacts/ContactCard'
import { DealStage } from '@/types'
import { fmtN, stageColor } from '@/lib/utils'

const STAGES: DealStage[] = ['New Lead', 'Contacted', 'Negotiating', 'Won', 'Lost']

export default function PipelinePage() {
  const { contacts, loading } = useContacts()
  const { tasks } = useTasks()
  const stats = useStats(contacts, tasks)
  const [activeStage, setActiveStage] = useState<DealStage>('New Lead')

  const stageContacts = stats.stageGroups[activeStage] ?? []
  const stageValue = stageContacts.reduce((sum, c) => sum + (c.value ?? 0), 0)

  return (
    <div className="p-4 space-y-4">
      <h1 className="font-display text-3xl text-warm pt-2">Pipeline</h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {STAGES.map(stage => {
          const color = stageColor(stage)
          const active = stage === activeStage
          const count = stats.stageGroups[stage]?.length ?? 0
          return (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              className="flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl border transition-all"
              style={
                active
                  ? { backgroundColor: `${color}20`, borderColor: color, color }
                  : { borderColor: '#444444', color: '#888888' }
              }
            >
              <span className="text-xs font-ui font-semibold uppercase tracking-wider whitespace-nowrap">{stage}</span>
              <span className="text-lg font-display">{count}</span>
            </button>
          )
        })}
      </div>

      {stageValue > 0 && (
        <div className="bg-surface2 border border-ghost rounded-xl p-3 flex items-center justify-between">
          <span className="text-xs font-ui text-muted uppercase tracking-widest">Stage Value</span>
          <span className="font-display text-xl text-gold">{fmtN(stageValue)}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[0,1,2].map(i => <div key={i} className="h-20 bg-surface2 rounded-xl animate-pulse" />)}
        </div>
      ) : stageContacts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted font-ui text-sm">No contacts in {activeStage}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {stageContacts.map(contact => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}
    </div>
  )
}
