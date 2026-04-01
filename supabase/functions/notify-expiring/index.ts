// Supabase Edge Function — jalankan setiap hari via cron
// Setup di Supabase Dashboard > Edge Functions > Schedule
// Cron: 0 8 * * * (setiap hari jam 08:00 WIB)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const FONNTE_TOKEN = Deno.env.get('FONNTE_TOKEN') ?? ''
const APP_URL = Deno.env.get('NEXT_PUBLIC_APP_URL') ?? ''
const ADMIN_WA = Deno.env.get('NEXT_PUBLIC_ADMIN_WHATSAPP') ?? ''

async function sendWA(phone: string, message: string) {
  if (!FONNTE_TOKEN || !phone) return
  const normalized = phone.replace(/^0/, '62').replace(/\D/g, '')
  await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: { Authorization: FONNTE_TOKEN, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ target: normalized, message, countryCode: '62' }),
  })
}

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )

  const today = new Date()
  const in3Days = new Date(today)
  in3Days.setDate(today.getDate() + 3)
  const dateStr = in3Days.toISOString().split('T')[0]

  // Find subscriptions expiring in exactly 3 days
  const { data: expiring } = await supabase
    .from('subscriptions')
    .select('user_id, expires_at, status')
    .in('status', ['trial', 'active'])
    .gte('expires_at', dateStr)
    .lt('expires_at', dateStr + 'T23:59:59')

  if (!expiring?.length) {
    return new Response(JSON.stringify({ sent: 0 }), { headers: { 'Content-Type': 'application/json' } })
  }

  let sent = 0
  for (const sub of expiring) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, email')
      .eq('id', sub.user_id)
      .maybeSingle()

    const { data: store } = await supabase
      .from('stores')
      .select('whatsapp')
      .eq('user_id', sub.user_id)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (!store?.whatsapp) continue

    const name = profile?.display_name || profile?.email?.split('@')[0] || 'Pengguna'
    const expiresAt = new Date(sub.expires_at).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    })

    const message = `Halo ${name}! ⏰

Masa langganan MyMenu Anda akan berakhir dalam *3 hari* (${expiresAt}).

Untuk melanjutkan, silakan hubungi admin:
💬 ${ADMIN_WA ? `https://wa.me/${ADMIN_WA}` : 'hubungi admin'}

Jangan sampai toko digital Anda tidak aktif! 🙏`

    await sendWA(store.whatsapp, message)
    sent++
  }

  return new Response(JSON.stringify({ sent }), { headers: { 'Content-Type': 'application/json' } })
})
