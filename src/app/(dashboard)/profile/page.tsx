import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getDisplayName, getAvatarInitial } from '@/lib/profile-helpers'
import { AvatarForm } from '@/components/avatar-form'
import { ProfileForm } from '@/components/profile-form'
import { EmailForm } from '@/components/email-form'
import { PasswordForm } from '@/components/password-form'
import { DeleteAccountSection } from '@/components/delete-account-section'
import { UserCircle } from 'lucide-react'
import type { Database } from '@/types/database.types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pengaturan Akun — MyMenu',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle() as { data: Database['public']['Tables']['profiles']['Row'] | null }

  const displayName = getDisplayName(profile ?? { display_name: null, email: user.email ?? '' })
  const initial = getAvatarInitial(displayName)

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <UserCircle className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Pengaturan Akun</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola informasi profil dan keamanan akun Anda.</p>
        </div>
      </div>

      {/* Section: Profil */}
      <section className="space-y-4">
        <SectionLabel>Profil</SectionLabel>
        <AvatarForm avatarUrl={profile?.avatar_url ?? null} initial={initial} />
        <ProfileForm displayName={displayName} />
      </section>

      {/* Section: Keamanan */}
      <section className="space-y-4">
        <SectionLabel>Keamanan</SectionLabel>
        <EmailForm currentEmail={profile?.email ?? user.email ?? ''} />
        <PasswordForm />
      </section>

      {/* Section: Danger Zone */}
      <section className="space-y-4">
        <SectionLabel danger>Zona Berbahaya</SectionLabel>
        <DeleteAccountSection userEmail={profile?.email ?? user.email ?? ''} />
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
