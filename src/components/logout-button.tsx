'use client'

import { useState } from 'react'
import { LogOut, X, AlertCircle } from 'lucide-react'
import { logout } from '@/lib/auth/actions'

export function LogoutButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    await logout()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
      >
        <LogOut className="w-4 h-4 group-hover:text-red-500 transition-colors" />
        Keluar
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => { if (!loading) setOpen(false) }}
        >
          <div
            className="bg-white rounded-2xl border border-gray-100 w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base leading-tight">Keluar dari akun?</p>
                  <p className="text-xs text-gray-400 mt-0.5">Sesi Anda akan diakhiri</p>
                </div>
              </div>
              <button
                onClick={() => { if (!loading) setOpen(false) }}
                disabled={loading}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-px bg-gray-100 mx-6" />

            <div className="px-6 py-4">
              <p className="text-sm text-gray-500">
                Pastikan semua perubahan sudah tersimpan sebelum keluar. Anda perlu login kembali untuk mengakses dashboard.
              </p>
            </div>

            <div className="px-6 pb-5 flex gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Keluar...</>
                  : <><LogOut className="w-4 h-4" />Ya, Keluar</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


