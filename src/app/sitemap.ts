import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 3600 // regenerate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mymenu.id'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: appUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${appUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${appUrl}/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${appUrl}/bantuan`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${appUrl}/privasi`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${appUrl}/syarat`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ]

  // Dynamic store pages
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: stores } = await supabase
      .from('stores')
      .select('slug, created_at')

    const storePages: MetadataRoute.Sitemap = (stores ?? []).map(store => ({
      url: `${appUrl}/${store.slug}`,
      lastModified: new Date(store.created_at),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))

    return [...staticPages, ...storePages]
  } catch {
    return staticPages
  }
}
