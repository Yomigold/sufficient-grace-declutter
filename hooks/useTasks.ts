'use client'
import { useState, useEffect } from 'react'
import { Task } from '../types'
import { getSupabaseClient } from '../lib/supabase/client'

export type TaskWithContact = Task & { contacts?: { name: string } | null }

export function useTasks() {
  const [tasks, setTasks] = useState<TaskWithContact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseClient()

    async function loadTasks() {
      const { data } = await supabase
        .from('tasks')
        .select('*, contacts(name)')
        .order('due_date', { ascending: true })
      setTasks((data as TaskWithContact[]) ?? [])
      setLoading(false)
    }

    loadTasks()

    const channel = supabase
      .channel('tasks-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        () => { loadTasks() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return { tasks, loading }
}
