import { NextResponse, type NextRequest } from 'next/server'

/**
 * Next.js 16 Proxy — strictly for routing concerns only.
 * Auth, role checks, and session validation live in Server Component layouts.
 * See: https://nextjs.org/docs/messages/middleware-to-proxy
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Cookie refresh: required so Supabase session cookies stay valid across requests.
  // This does NOT perform auth — it just forwards the request with updated cookies.
  const response = NextResponse.next({ request })

  // Add security headers to all responses
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  // Narrowed matcher: only run proxy on actual page/API routes.
  // Excludes static assets, images, and Next.js internals.
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)$).*)',
  ],
}
