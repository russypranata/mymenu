'use client'

import { useState } from 'react'
import { updateSubscription, extendSubscription, sendSubscriptionReminder } from '@/lib/actions/admin'
import { X, MessageCircle, CreditCard } from 'lucide-react'
import { SelectFilter } from '@/components/select-filter'

const STATUS_OPTIONS = [
  { value: 'trial', label: 'Trial' },
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'cancelled', label: 'Cancelled' },
]

const PLAN_TYPE_OPTIONS = [
  { value: 'monthly', label: 'Bulanan' },
  { value: 'annual', label: 'Tahunan' },
]

export function SubActions({
  subscriptionId,
  currentStatus,
  currentPlanType,
}: {
  subscriptionId: string
  currentStatus: string
  currentPlanType?: 'monthly' | 'annual'
}) {
  const [open, setOpen] = useState(false)
  const [extendDays, setExtendDays] = useState(30)
  const [newStatus, setNewStatus] = useState(currentStatus)
  const [newExpiry, setNewExpiry] = useState('')
  const [planType, setPlanType] = useState<'monthly' | 'annual'>(currentPlanType ?? 'monthly')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reminderLoading, setReminderLoading] = useState(false)
  const [reminderMsg, setReminderMsg] = useState<string | null>(null)

  async function handleReminder() {
    setReminderLoading(true)
    setReminderMsg(null)
    const result = await sendSubscriptionReminder(subscriptionId)
    setReminderMsg(result.error ? result.error : 'Reminder terkirim!')
    setReminderLoading(false)
    setTimeout(() => setReminderMsg(null), 3000)
  }

  async function handleUpdate() {
    setLoading(true)
    setError(null)
    const data: { status?: string; expires_at?: string; plan_type?: 'monthly' | 'annual' } = {}
    if (newStatus !== currentStatus) data.status = newStatus
    if (newExpiry) data.expires_at = new Date(newExpiry).toISOString()
    if (planType !== (currentPlanType ?? 'monthly')) data.plan_type = planType
    const result = await updateSubscription(subscriptionId, data)
    if (result.error) setError(result.error)
    else setOpen(false)
    setLoading(false)
  }

  async function handleExtend(days: number) {
    setLoading(true)
    setError(null)
    // If plan_type was changed in the dropdown, save it first before extending
    if (planType !== (currentPlanType ?? 'monthly')) {
      const updateResult = await updateSubscription(subscriptionId, { plan_type: planType })
      if (updateResult.error) {
        setError(updateResult.error)
        setLoading(false)
        return
      }
    }
    const result = await extendSubscription(subscriptionId, days)
    if (result.error) setError(result.error)
    else setOpen(false)
    setLoading(false)
  }

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        {reminderMsg && (
          <span className={`text-xs ${reminderMsg === 'Reminder terkirim!' ? 'text-green-500' : 'text-red-500'}`}>
            {reminderMsg}
          </span>
        )}
        <button
          onClick={handleReminder}
          disabled={reminderLoading}
          title="Kirim Reminder WA"
          className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
        <button
          onClick={() => setOpen(true)}
          className="text-xs font-semibold px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Edit
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-green-500" />
                </div>
                <p className="font-bold text-gray-900">Edit Subscription</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Status</label>
                  <SelectFilter
                    value={newStatus}
                    onChange={setNewStatus}
                    options={STATUS_OPTIONS}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Jenis Paket</label>
                  <SelectFilter
                    value={planType}
                    onChange={(v) => setPlanType(v as 'monthly' | 'annual')}
                    options={PLAN_TYPE_OPTIONS}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Tanggal Berakhir</label>
                  <input
                    type="date"
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl pl-3 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
                  />
                </div>
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  Simpan Perubahan
                </button>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500">Perpanjang Langganan</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExtend(30)}
                    disabled={loading}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                  >
                    Perpanjang 30 Hari
                  </button>
                  <button
                    onClick={() => handleExtend(365)}
                    disabled={loading}
                    className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                  >
                    Perpanjang 365 Hari
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={1}
                    value={extendDays}
                    onChange={(e) => setExtendDays(Number(e.target.value))}
                    className="w-20 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl pl-3 pr-2 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
                  />
                  <span className="text-sm text-gray-400 self-center">hari</span>
                  <button
                    onClick={() => handleExtend(extendDays)}
                    disabled={loading}
                    className="flex-1 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                  >
                    Perpanjang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
