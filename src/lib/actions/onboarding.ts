'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendWhatsApp, msgTrialActive } from '@/lib/whatsapp'

interface OnboardingInput {
  name: string
  phone: string
}

export async function updateOnboarding(input: OnboardingInput): Promise<{ error: string | null }> {
  const { name, phone } = input

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  // Update profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ display_name: name, phone })
    .eq('id', user.id)

  if (profileError) return { error: profileError.message }

  // Check if user already has a subscription (idempotent — don't create duplicate)
  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  if (!existingSub) {
    // Auto-create 3-day trial on first onboarding
    const today = new Date()
    const expiresAt = new Date(today)
    expiresAt.setDate(expiresAt.getDate() + 3)

    await supabase.from('subscriptions').insert({
      user_id: user.id,
      status: 'trial',
      started_at: today.toISOString(),
      expires_at: expiresAt.toISOString(),
    })

    // Send WA welcome notification (fire and forget — non-blocking)
    const expiresAtStr = expiresAt.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    const normalized = phone.replace(/^0/, '62').replace(/\D/g, '')
    sendWhatsApp(normalized, msgTrialActive(name, expiresAtStr)).catch(() => {})
  }

  revalidatePath('/dashboard')
  return { error: null }
}
