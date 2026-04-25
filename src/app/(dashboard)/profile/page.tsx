import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getDisplayName, getAvatarInitial } from '@/lib/profile-helpers'
import { AvatarForm } from '@/components/avatar-form'
import { ProfileForm } from '@/components/profile-form'
import { PhoneForm } from '@/components/phone-form'
import { EmailForm } from '@/components/email-form'
import { PasswordForm } from '@/components/password-form'
import { DeleteAccountSection } from '@/components/delete-account-section'
import { SubscriptionSection } from '@/components/subscription-section'
import { UserCircle } from 'lucide-react'
import type { Database } from '@/types/database.types'
import type { Metadata } from 'next'
import { getSubscription } from '@/lib/queries/dashboard'

export const metadata: Metadata = {
  title: 'Pengaturan Akun — MyMenu',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileResult, subscription] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    getSubscription(user.id),
  ])

  const profile = profileResult.data as Database['public']['Tables']['profiles']['Row'] | null
  const displayName = getDisplayName(profile ?? { display_name: null, email: user.email ?? '' })
  const initial = getAvatarInitial(displayName)
  const userEmail = profile?.email ?? user.email ?? ''

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Pengaturan Akun</h1>
            <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <UserCircle className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">Kelola informasi profil dan keamanan akun Anda.</p>
        </div>
      </div>

      {/* Section: Profil */}
      <section className="space-y-4">
        <SectionLabel>Profil</SectionLabel>
        <AvatarForm avatarUrl={profile?.avatar_url ?? null} initial={initial} />
        <ProfileForm displayName={displayName} />
        <PhoneForm phone={profile?.phone ?? null} />
      </section>

      {/* Section: Langganan */}
      <section className="space-y-4">
        <SectionLabel>Langganan</SectionLabel>
        <SubscriptionSection subscription={subscription} userEmail={userEmail} />
      </section>

      {/* Section: Keamanan */}
      <section className="space-y-4">
        <SectionLabel>Keamanan</SectionLabel>
        <EmailForm currentEmail={userEmail} />
        <PasswordForm />
      </section>

      {/* Section: Danger Zone */}
      <section className="space-y-4">
        <SectionLabel danger>Zona Berbahaya</SectionLabel>
        <DeleteAccountSection userEmail={userEmail} />
      </section>
    </div>
  )
}

function SectionLabel({ children, danger }: { children: React.ReactNode; danger?: boolean }) {
  return (
    <div className={`flex items-center gap-3 pb-2 border-b ${danger ? 'border-red-100' : 'border-gray-100'}`}>
      <p className={`text-xs font-bold uppercase tracking-wider ${danger ? 'text-red-400' : 'text-gray-400'}`}>
        {children}
      </p>
    </div>
  )
}
