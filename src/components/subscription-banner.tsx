'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Zap, AlertTriangle, X, Copy, Check, MessageCircle, CreditCard } from 'lucide-react'
import type { Database } from '@/types/database.types'

type Subscription = Database['public']['Tables']['subscriptions']['Row']

interface SubscriptionBannerProps {
  subscription: Subscription | null
  daysUntilExpiry: number | null
}

const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '62895338170582'
const PAYMENT_AMOUNT = 'Rp20.000'
const BANK_NAME = process.env.NEXT_PUBLIC_BANK_NAME || 'BCA'
const BANK_ACCOUNT = process.env.NEXT_PUBLIC_BANK_ACCOUNT || ''
const BANK_HOLDER = process.env.NEXT_PUBLIC_BANK_HOLDER || ''
const QRIS_IMAGE = '/qris-payment.png'

function buildWaMessage(email: string) {
  return encodeURIComponent(
    `Halo, saya ingin perpanjang langganan Menuly.\n\nEmail: ${email}\nNominal: ${PAYMENT_AMOUNT}`
  )
}

export function SubscriptionBanner({
  subscription,
  daysUntilExpiry,
  userEmail,
}: SubscriptionBannerProps & { userEmail: string }) {
  const [showPayment, setShowPayment] = useState(false)
  const [copied, setCopied] = useState(false)

  const isExpired = subscription?.status === 'expired'
  const hasNoSub = !subscription
  const expiresSoon = daysUntilExpiry !== null && daysUntilExpiry <= 3 && daysUntilExpiry >= 0
  const isTrial = subscription?.status === 'trial'

  if (!isExpired && !hasNoSub && !expiresSoon) return null

  const waUrl = `https://wa.me/${ADMIN_WA}?text=${buildWaMessage(userEmail)}`

  function copyAccount() {
    if (!BANK_ACCOUNT) return
    navigator.clipboard.writeText(BANK_ACCOUNT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isExpired || hasNoSub) {
    return (
      <>
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-900">
                  {isExpired ? 'Langganan Anda telah berakhir' : 'Anda belum memiliki langganan aktif'}
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Perpanjang sekarang untuk tetap bisa menggunakan semua fitur Menuly.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPayment(true)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Cara Bayar
            </button>
          </div>
        </div>
        {showPayment && (
          <PaymentModal waUrl={waUrl} onClose={() => setShowPayment(false)} copied={copied} onCopy={copyAccount} />
        )}
      </>
    )
  }

  if (expiresSoon) {
    return (
      <>
        <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-red-900">
                  {isTrial
                    ? `Trial berakhir dalam ${daysUntilExpiry} hari`
                    : `Langganan berakhir dalam ${daysUntilExpiry} hari`}
                </p>
                <p className="text-xs text-red-600 mt-0.5">
                  Perpanjang sekarang agar toko Anda tetap aktif dan bisa diakses pelanggan.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPayment(true)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Perpanjang
            </button>
          </div>
        </div>
        {showPayment && (
          <PaymentModal waUrl={waUrl} onClose={() => setShowPayment(false)} copied={copied} onCopy={copyAccount} />
        )}
      </>
    )
  }

  return null
}

function PaymentModal({
  waUrl,
  onClose,
  copied,
  onCopy,
}: {
  waUrl: string
  onClose: () => void
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-gray-100 w-full max-w-sm shadow-xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 text-green-500" />
            </div>
            <p className="font-bold text-gray-900">Perpanjang Langganan</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Nominal pembayaran</p>
            <p className="text-3xl font-extrabold text-gray-900">{PAYMENT_AMOUNT}<span className="text-base font-normal text-gray-400">/bulan</span></p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Langkah 1 — Bayar</p>
            {QRIS_IMAGE ? (
              <div className="flex flex-col items-center bg-gray-50 rounded-xl p-4 gap-3">
                <p className="text-xs text-gray-500 font-medium">Scan QRIS lalu masukkan nominal <span className="font-bold text-gray-800">Rp20.000</span></p>
                <div className="bg-white rounded-xl p-2 border border-gray-200">
                  <Image src={QRIS_IMAGE} alt="QRIS Payment" width={200} height={200} className="rounded-lg" />
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {['GoPay', 'OVO', 'DANA', 'ShopeePay', 'Bank'].map(m => (
                    <span key={m} className="text-[10px] bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">{m}</span>
                  ))}
                </div>
              </div>
            ) : BANK_ACCOUNT ? (
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <p className="text-xs text-gray-500">Transfer ke rekening {BANK_NAME}</p>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-bold text-gray-900 font-mono tracking-wider">{BANK_ACCOUNT}</p>
                    {BANK_HOLDER && <p className="text-xs text-gray-500 mt-0.5">a.n. {BANK_HOLDER}</p>}
                  </div>
                  <button onClick={onCopy} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0">
                    {copied ? <><Check className="w-3.5 h-3.5 text-green-500" />Disalin</> : <><Copy className="w-3.5 h-3.5" />Salin</>}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <p className="text-xs text-amber-700">Hubungi admin via WhatsApp untuk informasi pembayaran.</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Langkah 2 — Kirim Bukti</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Setelah bayar, screenshot bukti transfer lalu kirim ke admin via WhatsApp. Langganan diaktifkan dalam beberapa menit.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Sudah Bayar? Kirim Bukti via WA
            </a>
          </div>

          <p className="text-center text-xs text-gray-400">
            Butuh bantuan? Hubungi admin di WhatsApp yang sama.
          </p>
        </div>
      </div>
    </div>
  )
}
