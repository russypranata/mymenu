'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error reporting service in production
    // Only log in development or to monitoring service
    if (process.env.NODE_ENV === 'development') {
      console.error('Dashboard Error:', error)
    }
    // In production, send to error tracking service (e.g., Sentry)
  }, [error])

  // Don't show technical error details to users
  const isSchemaError = error.message?.includes('schema cache') || error.message?.includes('column')
  const userMessage = isSchemaError 
    ? 'Sistem sedang dalam pembaruan. Silakan coba lagi dalam beberapa saat.'
    : 'Sesuatu tidak berjalan dengan benar. Coba muat ulang halaman.'

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-7 h-7 text-red-400" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Terjadi kesalahan</h2>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">
        {userMessage}
      </p>
      <button
        onClick={reset}
        className="px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  )
}
