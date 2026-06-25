import { NextRequest, NextResponse } from 'next/server'
import { runAgent } from '../../../lib/agent/extract'
import { createServerClient } from '../../../lib/supabase/server'
import { sendWhatsAppAlert } from '../../../lib/whatsapp/alert'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { thread: string; source: string }
    const { thread, source } = body

    if (!thread || !source) {
      return NextResponse.json({ error: 'thread and source are required' }, { status: 400 })
    }

    const extracted = await runAgent(thread, source)
    const supabase = createServerClient()

    const { data: contact, error: upsertError } = await supabase
      .from('contacts')
      .upsert(
        {
          name: extracted.name,
          phone: extracted.phone || null,
          email: extracted.email || null,
          source: extracted.source,
          stage: extracted.stage,
          value: extracted.value,
          tags: extracted.tags,
        },
        { onConflict: 'phone', ignoreDuplicates: false }
      )
      .select()
      .single()

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 })
    }

    for (const note of extracted.notes) {
      await supabase.from('notes').insert({
        contact_id: contact.id,
        type: note.type,
        text: note.text,
      })
    }

    for (const task of extracted.tasks) {
      const dueDate = new Date(Date.now() + task.daysFromNow * 86400000)
        .toISOString()
        .slice(0, 10)
      await supabase.from('tasks').insert({
        contact_id: contact.id,
        title: task.title,
        due_date: dueDate,
      })
    }

    if (extracted.alerts.length > 0) {
      await sendWhatsAppAlert(
        `SGD Alert\n${extracted.name} - ${extracted.stage}\n${extracted.alerts.join('\n')}`
      )
    }

    return NextResponse.json({ success: true, data: extracted, contact })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
