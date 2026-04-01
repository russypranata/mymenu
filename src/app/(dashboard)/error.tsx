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
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-7 h-7 text-red-400" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Terjadi kesalahan</h2>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">
        Sesuatu tidak berjalan dengan benar. Coba muat ulang halaman.
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
