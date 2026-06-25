'use client'
import { useState, useEffect } from 'react'
import { Contact } from '../types'
import { getSupabaseClient } from '../lib/supabase/client'

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseClient()

    async function loadContacts() {
      const { data } = await supabase
        .from('contacts')
        .select('*')
        .order('updated_at', { ascending: false })
      setContacts((data as Contact[]) ?? [])
      setLoading(false)
    }

    loadContacts()

    const channel = supabase
      .channel('contacts-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contacts' },
        () => { loadContacts() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return { contacts, loading }
}
