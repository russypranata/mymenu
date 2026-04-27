'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { CreditCard, Copy, Check, MessageCircle, X, CheckCircle2, Clock, AlertTriangle, Zap } from 'lucide-react'
import type { Database } from '@/types/database.types'
import { ImageWithSkeleton } from '@/components/image-with-skeleton'
import { getPlanAmount, getPlanDuration, getPlanLabel } from '@/lib/subscription-helpers'

type Subscription = Database['public']['Tables']['subscriptions']['Row']

const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '62895338170582'
const BANK_NAME = process.env.NEXT_PUBLIC_BANK_NAME || 'BCA'
const BANK_ACCOUNT = process.env.NEXT_PUBLIC_BANK_ACCOUNT || ''
const BANK_HOLDER = process.env.NEXT_PUBLIC_BANK_HOLDER || ''
const QRIS_IMAGE = '/qris-payment.jpeg'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function buildWaMessage(email: string, planType: 'monthly' | 'annual' = 'monthly') {
  const amount = getPlanAmount(planType)
  const paket = planType === 'annual' ? 'Tahunan' : 'Bulanan'
  return encodeURIComponent(
    `Halo, saya ingin perpanjang langganan Menuly.\n\nEmail: ${email}\nPaket: ${paket}\nNominal: ${amount}\n\n[Lampirkan foto/screenshot bukti transfer di sini]`
  )
}

interface SubscriptionSectionProps {
  subscription: Subscription | null
  userEmail: string
  initialModalOpen?: boolean
}

export function SubscriptionSection({ subscription, userEmail, initialModalOpen = false }: SubscriptionSectionProps) {
  const [showModal, setShowModal] = useState(initialModalOpen)
  const [copied, setCopied] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>(
    (subscription?.plan_type as 'monthly' | 'annual') ?? 'monthly'
  )

  // Update modal state when initialModalOpen changes
  useEffect(() => {
    if (initialModalOpen) {
      setShowModal(true)
    }
  }, [initialModalOpen])

  const planType = (subscription?.plan_type as 'monthly' | 'annual') ?? 'monthly'
  const origin = (subscription?.origin as 'trial' | 'paid') ?? 'trial'
  const planLabel = getPlanLabel(planType, origin)
  const currentAmount = getPlanAmount(planType)
  const currentDuration = getPlanDuration(planType)
  const selectedAmount = getPlanAmount(selectedPlan)
  const waUrl = `https://wa.me/${ADMIN_WA}?text=${buildWaMessage(userEmail, selectedPlan)}`

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
  const isExpiredFromTrial = isExpired && origin !== 'paid'

  function copyAccount() {
    if (!BANK_ACCOUNT) return
    navigator.clipboard.writeText(BANK_ACCOUNT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Status badge config
  const statusConfig = hasNoSub
    ? { label: 'Belum berlangganan', color: 'bg-gray-50 text-gray-500 border-gray-100', icon: <AlertTriangle className="w-3.5 h-3.5" /> }
    : isExpired
    ? {
        label: isExpiredFromTrial ? 'Trial berakhir' : 'Langganan berakhir',
        color: 'bg-red-50 text-red-600 border-red-100',
        icon: <AlertTriangle className="w-3.5 h-3.5" />
      }
    : isTrial
    ? { label: 'Trial', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: <Clock className="w-3.5 h-3.5" /> }
    : isActive
    ? { label: 'Aktif', color: 'bg-green-50 text-green-600 border-green-100', icon: <CheckCircle2 className="w-3.5 h-3.5" /> }
    : { label: '-', color: 'bg-gray-50 text-gray-500 border-gray-100', icon: null }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Langganan</p>
              <p className="text-xs text-gray-400 mt-0.5">Status dan informasi pembayaran</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Info rows */}
          <div className="space-y-2.5">
            {/* Status badge as first row */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusConfig.color}`}>
                {statusConfig.icon}
                {statusConfig.label}
              </span>
            </div>

            {/* Paket info - removed, detail per transaksi ada di riwayat */}

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
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-100 w-full max-w-sm shadow-xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
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
            <div className="px-6 py-5 space-y-5 max-h-[calc(100vh-12rem)] overflow-y-auto">

              {/* Plan selector */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Pilih Paket</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedPlan('monthly')}
                    className={`py-2.5 px-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                      selectedPlan === 'monthly'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    Bulanan
                    <span className="block text-xs font-normal mt-0.5">{getPlanAmount('monthly')}/bln</span>
                  </button>
                  <button
                    onClick={() => setSelectedPlan('annual')}
                    className={`py-2.5 px-3 rounded-xl text-sm font-semibold border-2 transition-all relative ${
                      selectedPlan === 'annual'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    Tahunan
                    <span className="block text-xs font-normal mt-0.5">{getPlanAmount('annual')}/thn</span>
                    <span className="absolute -top-2 -right-1 text-[9px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">Hemat</span>
                  </button>
                </div>
              </div>

              {/* Nominal */}
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Nominal pembayaran</p>
                <p className="text-3xl font-extrabold text-gray-900">{selectedAmount}<span className="text-base font-normal text-gray-400">{getPlanDuration(selectedPlan)}</span></p>
                {selectedPlan === 'annual' && (
                  <p className="text-xs text-green-600 mt-1 font-medium">Hemat Rp40.000 dibanding bayar bulanan</p>
                )}
              </div>

              {/* Step 1 */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Langkah 1 — Bayar</p>

                {QRIS_IMAGE ? (
                  <div className="flex flex-col items-center bg-gray-50 rounded-xl p-4 gap-3">
                <p className="text-xs text-gray-500 font-medium">Scan QRIS lalu masukkan nominal <span className="font-bold text-gray-800">{selectedAmount}</span></p>                    <div className="bg-white rounded-xl p-2 border border-gray-200">
                      <div className="relative w-[200px] h-[200px]">
                        <ImageWithSkeleton src={QRIS_IMAGE} alt="QRIS Payment" fill sizes="200px" className="rounded-lg object-contain" />
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400">QRIS Neo Bank · Berlaku untuk semua e-wallet & bank</p>
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
                ) : (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                    <p className="text-xs text-amber-700">Hubungi admin via WhatsApp untuk informasi pembayaran.</p>
                  </div>
                )}
              </div>

              {/* Step 2 */}
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
      )}
    </>
  )
}
