import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '../../../lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { name?: string; email?: string }
    const name = body.name?.trim()
    const email = body.email?.trim()

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRe.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const supabase = createServerClient()

    const { error } = await supabase.from('waitlist').insert({ name, email })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'This email is already on the waitlist.' }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Waitlist error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
