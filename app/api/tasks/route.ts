import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '../../../lib/supabase/server'

export async function GET() {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('tasks')
      .select('*, contacts(name)')
      .order('due_date', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('tasks')
      .insert(body)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
