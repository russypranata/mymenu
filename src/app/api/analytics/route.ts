import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { storeId, eventType = 'page_view' } = await request.json()
    if (!storeId) return NextResponse.json({ error: 'storeId required' }, { status: 400 })

    // Validate eventType to prevent arbitrary data injection
    const allowedEvents = ['page_view']
    if (!allowedEvents.includes(eventType)) {
      return NextResponse.json({ error: 'Invalid eventType' }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify the store actually exists before recording analytics
    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('id', storeId)
      .maybeSingle()

    if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

    await supabase.from('analytics').insert({
      store_id: storeId,
      event_type: eventType,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
