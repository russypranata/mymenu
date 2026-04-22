'use client'

import Link from 'next/link'
import { CheckCircle2, Circle, ChevronRight, X } from 'lucide-react'
import { useState } from 'react'

interface Step {
  id: string
  label: string
  desc: string
  href: string
  done: boolean
}

interface Props {
  hasStore: boolean
  hasMenu: boolean
  hasShared: boolean // we use hasStore as proxy — if they have a store, they can share
}

export function OnboardingChecklist({ hasStore, hasMenu, hasShared }: Props) {
  const [dismissed, setDismissed] = useState(false)

  const steps: Step[] = [
    {
      id: 'store',
      label: 'Buat toko',
      desc: 'Buat halaman menu digital pertama Anda',
      href: '/store/new',
      done: hasStore,
    },
    {
      id: 'menu',
      label: 'Tambah menu',
      desc: 'Tambahkan minimal 1 item menu ke toko',
      href: '/store',
      done: hasMenu,
    },
    {
      id: 'share',
      label: 'Bagikan ke pelanggan',
      desc: 'Salin link atau cetak QR code toko Anda',
      href: '/store',
      done: hasShared,
    },
  ]

  const completedCount = steps.filter(s => s.done).length
  const allDone = completedCount === steps.length

  // Hide if all done or dismissed
  if (allDone || dismissed) return null

  const progressPct = (completedCount / steps.length) * 100

  return (
    <div className="bg-white rounded-2xl border border-green-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-green-50 border-b border-green-100">
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold text-green-900">Mulai dalam 3 langkah</p>
            <p className="text-xs text-green-600">{completedCount} dari {steps.length} selesai</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Progress bar */}
          <div className="w-20 h-1.5 bg-green-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="w-6 h-6 rounded-full flex items-center justify-center text-green-400 hover:text-green-600 hover:bg-green-100 transition-colors"
            aria-label="Tutup panduan"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Steps */}
      <ul className="divide-y divide-gray-50">
        {steps.map((step, i) => (
          <li key={step.id}>
            {step.done ? (
              <div className="flex items-center gap-3 px-5 py-3.5 opacity-60">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-500 line-through">{step.label}</p>
                </div>
              </div>
            ) : (
              <Link
                href={step.href}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
              >
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 group-hover:border-green-400 transition-colors">
                  <span className="text-[10px] font-bold text-gray-400 group-hover:text-green-500">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{step.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-green-400 transition-colors flex-shrink-0" />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
