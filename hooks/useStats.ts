'use client'
import { useMemo } from 'react'
import { Contact, Task } from '../types'
import { todayStr } from '../lib/utils'

export function useStats(contacts: Contact[], tasks: Task[]) {
  return useMemo(() => {
    const total = contacts.length
    const active = contacts.filter(c => !['Won', 'Lost'].includes(c.stage)).length
    const won = contacts.filter(c => c.stage === 'Won').length
    const revenue = contacts.filter(c => c.stage === 'Won').reduce((sum, c) => sum + (c.value ?? 0), 0)
    const today = todayStr()
    const openTasks = tasks.filter(t => !t.done).length
    const overdue = tasks.filter(t => !t.done && t.due_date && t.due_date < today).length
    const dueToday = tasks.filter(t => !t.done && t.due_date === today).length
    const stageGroups = {
      'New Lead': contacts.filter(c => c.stage === 'New Lead'),
      'Contacted': contacts.filter(c => c.stage === 'Contacted'),
      'Negotiating': contacts.filter(c => c.stage === 'Negotiating'),
      'Won': contacts.filter(c => c.stage === 'Won'),
      'Lost': contacts.filter(c => c.stage === 'Lost'),
    }
    return { total, active, won, revenue, openTasks, overdue, dueToday, stageGroups }
  }, [contacts, tasks])
}
