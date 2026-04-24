// Next.js 16 Middleware
// Exports the proxy function from src/proxy.ts as middleware
export { proxy as middleware } from './src/proxy'

// Config must be defined directly in middleware.ts, cannot be re-exported
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)$).*)',
  ],
}
