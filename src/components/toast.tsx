'use client'

import { useState, useCallback } from 'react'
import { CheckCircle2, XCircle, X } from 'lucide-react'

export interface ToastItem {
  id: number
  message: string
  type: 'success' | 'error'
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((message: string, type: ToastItem['type'] = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, addToast, removeToast }
}

export function ToastContainer({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: number) => void }) {
  if (toasts.length === 0) return null
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[100] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map(toast => (
        <div
          key={toast.id}
          role={toast.type === 'error' ? 'alert' : 'status'}
          className={`flex items-center gap-2.5 pl-4 pr-3 py-3 rounded-2xl shadow-lg text-sm font-medium text-white pointer-events-auto animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          {toast.type === 'error'
            ? <XCircle className="w-4 h-4 flex-shrink-0 text-red-200" aria-hidden="true" />
            : <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-100" aria-hidden="true" />}
          <span>{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="ml-1 p-0.5 rounded-lg hover:bg-white/20 transition-colors"
            aria-label="Tutup notifikasi"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  )
}
