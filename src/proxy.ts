import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Next.js 16 Proxy — routing concerns + session refresh.
 * Auth redirects and role checks live in Server Component layouts.
 * See: https://nextjs.org/docs/messages/middleware-to-proxy
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  // ── Supabase session refresh ──
  // Required so session cookies stay valid across requests without user re-login.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )
  // Must call getUser() to trigger session refresh — do not remove
  await supabase.auth.getUser()

  // ── Security headers ──
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  )
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      // Next.js needs inline scripts for hydration
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Tailwind inline styles + Supabase storage images
      "style-src 'self' 'unsafe-inline'",
      // Allow images from Supabase storage and data URIs (for image crop preview)
      "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in",
      // Supabase API calls
      "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co",
      // Fonts from self
      "font-src 'self'",
      // No iframes
      "frame-src 'none'",
      // No plugins
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  )

  return response
}

export const config = {
  // Narrowed matcher: only run proxy on actual page/API routes.
  // Excludes static assets, images, and Next.js internals.
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)$).*)',
  ],
}
