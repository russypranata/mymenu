'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

interface OnboardingInput {
  name: string
  phone: string
}

export async function updateOnboarding(input: OnboardingInput): Promise<{ error: string | null }> {
  const { name, phone } = input

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: name, phone })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { error: null }
}
