import { NextRequest, NextResponse } from 'next/server'
import { runAgent } from '../../../../lib/agent/extract'
import { createServerClient } from '../../../../lib/supabase/server'
import { sendWhatsAppAlert } from '../../../../lib/whatsapp/alert'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WEBHOOK_SECRET) {
    return new NextResponse(challenge, { status: 200 })
  }

  return new NextResponse('Forbidden', { status: 403 })
}

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-webhook-secret')
    if (secret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rawBody = await req.json() as Record<string, unknown>
    const supabase = createServerClient()

    await supabase.from('webhook_events').insert({
      source: 'WhatsApp',
      raw_payload: rawBody,
      status: 'received',
    })

    type EntryValue = {
      messages?: Array<{ from?: string; text?: { body?: string } }>
    }
    type Entry = {
      changes?: Array<{ value?: EntryValue }>
    }

    const entries = rawBody.entry as Entry[] | undefined
    const message = entries?.[0]?.changes?.[0]?.value?.messages?.[0]
    const from = message?.from ?? ''
    const text = message?.text?.body ?? ''

    if (!text) {
      return NextResponse.json({ ok: true, note: 'No text message to process' })
    }

    const thread = `Customer (${from}): ${text}`
    const extracted = await runAgent(thread, 'WhatsApp')

    if (from && !extracted.phone) {
      extracted.phone = from
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
