import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Called by a cron job (e.g. Supabase pg_cron, GitHub Actions, or external cron).
 * Returns subscriptions expiring in 1–3 days so admin can act on them.
 *
 * Secure with: Authorization: Bearer <CRON_SECRET>
 * Set CRON_SECRET in your hosting environment variables.
 */
export async function POST(request: NextRequest) {
  // Always require secret — fail closed
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 })
  }

  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const now = new Date()
  const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

  const { data: expiring, error } = await supabase
    .from('subscriptions')
    .select('user_id, expires_at, status')
    .in('status', ['active', 'trial'])
    .gte('expires_at', now.toISOString())
    .lte('expires_at', in3Days.toISOString())

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const results = (expiring ?? []).map(s => ({
    user_id: s.user_id,
    expires_at: s.expires_at,
    status: s.status,
    days_left: Math.ceil(
      (new Date(s.expires_at!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    ),
  }))

  return NextResponse.json({ ok: true, count: results.length, expiring: results })
}
