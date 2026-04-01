import type { Database } from '@/types/database.types'

type ProfileRow = Database['public']['Tables']['profiles']['Row']

export function getDisplayName(profile: Pick<ProfileRow, 'display_name' | 'email'>): string {
  if (profile.display_name) return profile.display_name
  return profile.email.split('@')[0]
}

export function getAvatarInitial(displayName: string): string {
  return displayName.charAt(0).toUpperCase()
}
