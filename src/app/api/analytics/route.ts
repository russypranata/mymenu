import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ALLOWED_EVENTS = ['page_view', 'whatsapp_click'] as const
type AllowedEvent = (typeof ALLOWED_EVENTS)[number]

/**
 * Serverless-safe rate limiting using Supabase.
 * Checks if the same IP+store+event has been recorded in the last 60 seconds.
 * Falls back to allowing the request if the check fails (fail-open for analytics).
 */
async function isRateLimited(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ip: string,
  storeId: string,
  eventType: string
): Promise<boolean> {
  try {
    const since = new Date(Date.now() - 60_000).toISOString()
    const { count } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId)
      .eq('event_type', eventType)
      .eq('ip', ip)
      .gte('created_at', since)

    return (count ?? 0) >= 5
  } catch {
    return false // fail-open: don't block analytics on DB error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeId, eventType = 'page_view' } = body

    if (!storeId || typeof storeId !== 'string') {
      return NextResponse.json({ error: 'storeId required' }, { status: 400 })
    }

    if (!ALLOWED_EVENTS.includes(eventType as AllowedEvent)) {
      return NextResponse.json({ error: 'Invalid eventType' }, { status: 400 })
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown'

    const supabase = await createClient()

    // Verify store exists
    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('id', storeId)
      .maybeSingle()

    if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

    // Rate limit check
    if (await isRateLimited(supabase, ip, storeId, eventType)) {
      return NextResponse.json({ ok: true }) // silent ignore
    }

    await supabase.from('analytics').insert({ store_id: storeId, event_type: eventType, ip })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
