import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mymenu.id'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/store', '/profile', '/guide', '/admin', '/api/'],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  }
}
