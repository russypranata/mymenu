'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { Plus_Jakarta_Sans } from 'next/font/google'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'],
})

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Only log in development or send to monitoring service in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Global Error:', error)
    }
    // In production, send to error tracking service (e.g., Sentry)
  }, [error])

  // Don't expose technical details to users
  const isSchemaError = error.message?.includes('schema cache') || error.message?.includes('column')
  const userMessage = isSchemaError 
    ? 'Sistem sedang dalam pembaruan. Silakan coba lagi dalam beberapa saat.'
    : 'Sesuatu tidak berjalan dengan benar. Coba muat ulang halaman.'

  return (
    <html lang="id">
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
            <AlertTriangle className="w-7 h-7 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Terjadi kesalahan</h1>
          <p className="text-sm text-gray-500 mb-8 max-w-xs">
            {userMessage}
          </p>
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Coba Lagi
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Beranda
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
