import { NextRequest, NextResponse } from 'next/server'
import { runAgent } from '../../../../lib/agent/extract'
import { createServerClient } from '../../../../lib/supabase/server'
import { sendWhatsAppAlert } from '../../../../lib/whatsapp/alert'

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-webhook-secret')
    if (secret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rawBody = await req.json() as {
      conversation_history: string
      user_phone?: string
      user_username?: string
    }

    const supabase = createServerClient()

    await supabase.from('webhook_events').insert({
      source: 'Instagram DM',
      raw_payload: rawBody as Record<string, unknown>,
      status: 'received',
    })

    const thread = rawBody.conversation_history
    if (!thread) {
      return NextResponse.json({ error: 'No conversation_history in payload' }, { status: 400 })
    }

    const extracted = await runAgent(thread, 'Instagram DM')

    if (rawBody.user_phone && !extracted.phone) {
      extracted.phone = rawBody.user_phone
    }

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

    if (upsertError) throw new Error(upsertError.message)

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

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
