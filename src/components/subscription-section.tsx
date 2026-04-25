'use client'

import { useState } from 'react'
import { CreditCard, Copy, Check, MessageCircle, X, CheckCircle2, Clock, AlertTriangle, Zap } from 'lucide-react'
import type { Database } from '@/types/database.types'

type Subscription = Database['public']['Tables']['subscriptions']['Row']

const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '62895338170582'
const PAYMENT_AMOUNT = 'Rp20.000'
const BANK_NAME = process.env.NEXT_PUBLIC_BANK_NAME || 'BCA'
const BANK_ACCOUNT = process.env.NEXT_PUBLIC_BANK_ACCOUNT || ''
const BANK_HOLDER = process.env.NEXT_PUBLIC_BANK_HOLDER || ''

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function buildWaMessage(email: string) {
  return encodeURIComponent(
    `Halo, saya ingin perpanjang langganan MyMenu.\n\nEmail: ${email}\nNominal: ${PAYMENT_AMOUNT}\n\n[Lampirkan foto/screenshot bukti transfer di sini]`
  )
}

interface SubscriptionSectionProps {
  subscription: Subscription | null
  userEmail: string
}

export function SubscriptionSection({ subscription, userEmail }: SubscriptionSectionProps) {
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const waUrl = `https://wa.me/${ADMIN_WA}?text=${buildWaMessage(userEmail)}`

  const status = subscription?.status ?? null
  const expiresAt = subscription?.expires_at ? new Date(subscription.expires_at) : null
  const daysLeft = expiresAt
    ? Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  const isActive = status === 'active' && daysLeft !== null && daysLeft > 0
  const isTrial = status === 'trial' && daysLeft !== null && daysLeft > 0
  const isExpiringSoon = daysLeft !== null && daysLeft <= 3 && daysLeft >= 0
  const isExpired = status === 'expired' || (daysLeft !== null && daysLeft <= 0)
  const hasNoSub = !subscription

  function copyAccount() {
    if (!BANK_ACCOUNT) return
    navigator.clipboard.writeText(BANK_ACCOUNT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Status badge config
  const statusConfig = hasNoSub || isExpired
    ? { label: 'Tidak aktif', color: 'bg-red-50 text-red-600 border-red-100', icon: <AlertTriangle className="w-3.5 h-3.5" /> }
    : isTrial
    ? { label: 'Trial', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: <Clock className="w-3.5 h-3.5" /> }
    : isActive
    ? { label: 'Aktif', color: 'bg-green-50 text-green-600 border-green-100', icon: <CheckCircle2 className="w-3.5 h-3.5" /> }
    : { label: '-', color: 'bg-gray-50 text-gray-500 border-gray-100', icon: null }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Langganan</p>
              <p className="text-xs text-gray-400 mt-0.5">Status dan informasi pembayaran</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusConfig.color}`}>
            {statusConfig.icon}
            {statusConfig.label}
          </span>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Info rows */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Paket</span>
              <span className="font-semibold text-gray-900">MyMenu — {PAYMENT_AMOUNT}/bulan</span>
            </div>
            {subscription?.started_at && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Mulai</span>
                <span className="font-medium text-gray-700">{formatDate(subscription.started_at)}</span>
              </div>
            )}
            {expiresAt && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {isExpired ? 'Berakhir' : 'Aktif hingga'}
                </span>
                <span className={`font-semibold ${isExpiringSoon || isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatDate(subscription!.expires_at!)}
                  {!isExpired && daysLeft !== null && daysLeft > 0 && (
                    <span className="text-xs font-normal text-gray-400 ml-1">({daysLeft} hari lagi)</span>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* CTA */}
          {(hasNoSub || isExpired) ? (
            <div className="pt-1">
              <button
                onClick={() => setShowModal(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <Zap className="w-4 h-4" />
                Aktifkan Langganan
              </button>
            </div>
          ) : (
            <div className="pt-1">
              <button
                onClick={() => setShowModal(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                {isExpiringSoon ? 'Perpanjang Sekarang' : 'Perpanjang Langganan'}
              </button>
              {isExpiringSoon && (
                <p className="text-center text-xs text-red-500 mt-2 font-medium">
                  ⚠️ Berakhir dalam {daysLeft} hari — perpanjang sekarang
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-100 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-green-500" />
                </div>
                <p className="font-bold text-gray-900">Cara Perpanjang Langganan</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Step 1 */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Langkah 1 — Transfer</p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Nominal</p>
                    <p className="text-lg font-extrabold text-gray-900">
                      {PAYMENT_AMOUNT}
                      <span className="text-sm font-normal text-gray-400">/bulan</span>
                    </p>
                  </div>
                  {BANK_ACCOUNT && (
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-xs text-gray-500 mb-1">Rekening {BANK_NAME}</p>
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-bold text-gray-900 font-mono tracking-wider">{BANK_ACCOUNT}</p>
                          {BANK_HOLDER && <p className="text-xs text-gray-500 mt-0.5">a.n. {BANK_HOLDER}</p>}
                        </div>
                        <button
                          onClick={copyAccount}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
                        >
                          {copied ? (
                            <><Check className="w-3.5 h-3.5 text-green-500" />Disalin</>
                          ) : (
                            <><Copy className="w-3.5 h-3.5" />Salin</>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Langkah 2 — Kirim Bukti via WhatsApp</p>
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 space-y-1">
                  <p className="text-xs font-semibold text-blue-800">Cara kirim bukti transfer:</p>
                  <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside leading-relaxed">
                    <li>Screenshot atau foto struk transfer dari aplikasi bank</li>
                    <li>Klik tombol di bawah untuk buka WhatsApp admin</li>
                    <li>Lampirkan foto bukti transfer → kirim</li>
                  </ol>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Langganan akan diaktifkan dalam beberapa menit setelah admin memverifikasi.
                </p>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Buka WhatsApp &amp; Kirim Bukti
                </a>
              </div>

              <p className="text-center text-xs text-gray-400">
                Butuh bantuan? Hubungi admin di WhatsApp yang sama.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
