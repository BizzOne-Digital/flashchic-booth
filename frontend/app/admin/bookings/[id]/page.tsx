'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { bookingsApi, paymentsApi } from '@/lib/api'

const PKG = { photobooth: 'Photobooth', videobooth: '360 Videobooth', combo: 'Photo + Video Combo' }
const statusBadge = (s: string) => <span className={`badge badge-${s}`}>{s.replace('_', ' ')}</span>

export default function BookingDetail() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('')
  const [toast, setToast] = useState({ msg: '', type: '' })
  const [paymentLoading, setPaymentLoading] = useState('')

  const showToast = (msg: string, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg: '', type: '' }), 4000)
  }

  useEffect(() => {
    bookingsApi.getOne(id)
      .then(res => {
        setBooking(res.data.data)
        setNotes(res.data.data.adminNotes || '')
        setStatus(res.data.data.status)
      })
      .catch(() => router.push('/admin/bookings'))
      .finally(() => setLoading(false))
  }, [id])

  const save = async () => {
    setSaving(true)
    try {
      const res = await bookingsApi.update(id, { status, adminNotes: notes })
      setBooking(res.data.data)
      showToast('Booking updated!')
    } catch (e: any) {
      showToast(e.response?.data?.message || 'Update failed', 'error')
    } finally { setSaving(false) }
  }

  const del = async () => {
    if (!confirm('Permanently delete this booking?')) return
    await bookingsApi.delete(id)
    router.push('/admin/bookings')
  }

  const copyPaymentLink = async (type: 'deposit' | 'balance') => {
    setPaymentLoading(type)
    try {
      const res = await paymentsApi.getPaymentLink(id, type)
      navigator.clipboard.writeText(res.data.url)
      showToast(`${type === 'deposit' ? 'Deposit' : 'Balance'} payment link copied!`)
    } catch (e: any) {
      showToast(e.response?.data?.message || 'Error generating link', 'error')
    } finally { setPaymentLoading('') }
  }

  if (loading) return <div className="text-white/30 animate-pulse text-sm">Loading booking...</div>
  if (!booking) return null

  const b = booking

  return (
    <div className="max-w-4xl">
      {toast.msg && (
        <div className={`fixed bottom-6 right-6 z-50 border px-5 py-3 text-sm ${toast.type === 'error' ? 'bg-red-900/80 border-red-500/50 text-red-200' : 'bg-[#1a1a1a] border-[#d4af37]/50 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/bookings" className="text-white/40 hover:text-white text-sm">← Back</Link>
        <div className="flex-1">
          <h1 className="text-white text-xl font-semibold">{b.firstName} {b.lastName}</h1>
          <p className="text-white/40 text-xs mt-1">Booking · {b.eventDate} · {PKG[b.package as keyof typeof PKG]}</p>
        </div>
        {statusBadge(b.status)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Client Info */}
          <div className="admin-card p-5">
            <h3 className="text-[#d4af37] text-xs tracking-widest uppercase mb-4">Client Information</h3>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              {[
                ['Full Name', `${b.firstName} ${b.lastName}`],
                ['Email', b.email],
                ['Phone', b.phone],
              ].map(([k, v]) => (
                <div key={k} className="contents">
                  <span className="text-white/30 text-xs uppercase tracking-widest">{k}</span>
                  <span className="text-white/80">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <a href={`mailto:${b.email}`} className="btn-gold px-4 py-2 text-xs">Email Client</a>
              <a href={`tel:${b.phone}`} className="border border-[#d4af37]/30 text-[#d4af37] px-4 py-2 text-xs hover:bg-[#d4af37]/10">Call Client</a>
            </div>
          </div>

          {/* Event Info */}
          <div className="admin-card p-5">
            <h3 className="text-[#d4af37] text-xs tracking-widest uppercase mb-4">Event Details</h3>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              {[
                ['Package', PKG[b.package as keyof typeof PKG]],
                ['Event Type', b.eventType],
                ['Event Date', b.eventDate],
                ['Start Time', b.startTime || '—'],
                ['End Time', b.endTime || '—'],
                ['Hours Booked', b.hours ? `${b.hours} hrs` : '—'],
                ['Location', b.eventLocation],
                ['Guests', b.guestCount || '—'],
                ['Indoor/Outdoor', b.indoorOutdoor || '—'],
                ['Theme', b.theme || '—'],
              ].map(([k, v]) => (
                <div key={k} className="contents">
                  <span className="text-white/30 text-xs uppercase tracking-widest py-1">{k}</span>
                  <span className="text-white/80 py-1 border-b border-white/5">{v}</span>
                </div>
              ))}
            </div>
            {b.additionalInfo && (
              <div className="mt-4 p-3 bg-[#d4af37]/5 border border-[#d4af37]/15">
                <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Client Notes</p>
                <p className="text-white/70 text-sm">{b.additionalInfo}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right — Payments + Actions */}
        <div className="space-y-5">
          {/* Financials */}
          <div className="admin-card p-5">
            <h3 className="text-[#d4af37] text-xs tracking-widest uppercase mb-4">Financials</h3>
            <div className="space-y-2 text-sm mb-4">
              {[
                ['Rate', `$${b.hourlyRate}/hr`],
                ['Subtotal', `$${b.subtotal?.toFixed(2)}`],
                b.discountAmount > 0 ? ['Discount', `-$${b.discountAmount?.toFixed(2)} (${b.discountCode})`] : null,
                ['Tax (15%)', `$${b.tax?.toFixed(2)}`],
              ].filter(Boolean).map((row: any) => (
                <div key={row[0]} className="flex justify-between">
                  <span className="text-white/40">{row[0]}</span>
                  <span className="text-white/70">{row[1]}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-[#d4af37]/20 pt-2 mt-2">
                <span className="text-white font-semibold">Total</span>
                <span className="text-[#d4af37] font-bold text-lg">${b.total?.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment status */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between p-2 bg-[#1a1a1a] border border-white/10">
                <span className="text-white/50 text-xs">Deposit (50%)</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#d4af37] text-sm">${b.depositAmount?.toFixed(2)}</span>
                  {b.depositPaid
                    ? <span className="text-green-400 text-xs">✓ Paid</span>
                    : <span className="text-yellow-400 text-xs">Pending</span>}
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#1a1a1a] border border-white/10">
                <span className="text-white/50 text-xs">Balance (50%)</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#d4af37] text-sm">${(b.total - b.depositAmount)?.toFixed(2)}</span>
                  {b.balancePaid
                    ? <span className="text-green-400 text-xs">✓ Paid</span>
                    : <span className="text-yellow-400 text-xs">Pending</span>}
                </div>
              </div>
            </div>

            {/* Payment link buttons */}
            <div className="space-y-2">
              {!b.depositPaid && (
                <button
                  onClick={() => copyPaymentLink('deposit')}
                  disabled={paymentLoading === 'deposit'}
                  className="w-full btn-gold py-2 text-xs tracking-widest"
                >
                  {paymentLoading === 'deposit' ? 'Generating...' : '📋 Copy Deposit Payment Link'}
                </button>
              )}
              {b.depositPaid && !b.balancePaid && (
                <button
                  onClick={() => copyPaymentLink('balance')}
                  disabled={paymentLoading === 'balance'}
                  className="w-full border border-green-500/30 text-green-400 py-2 text-xs tracking-widest hover:bg-green-500/10 transition-all"
                >
                  {paymentLoading === 'balance' ? 'Generating...' : '📋 Copy Balance Payment Link'}
                </button>
              )}
              {b.depositPaid && b.balancePaid && (
                <div className="text-center text-green-400 text-sm py-2">✓ Fully Paid</div>
              )}
            </div>
          </div>

          {/* Status + Notes */}
          <div className="admin-card p-5">
            <h3 className="text-[#d4af37] text-xs tracking-widest uppercase mb-4">Manage</h3>
            <div className="mb-4">
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="admin-input w-full">
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="deposit_paid">Deposit Paid</option>
                <option value="paid">Fully Paid</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Admin Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={4}
                className="admin-input resize-none w-full"
                placeholder="Internal notes..."
              />
            </div>
            <button onClick={save} disabled={saving} className="btn-gold w-full py-2 text-xs tracking-widest mb-3 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={del} className="w-full border border-red-500/30 text-red-400/60 py-2 text-xs hover:text-red-400 hover:border-red-500/50 transition-all">
              Delete Booking
            </button>
          </div>

          {/* Stripe IDs */}
          {(b.stripeDepositPaymentId || b.stripeBalancePaymentId) && (
            <div className="admin-card p-5">
              <h3 className="text-[#d4af37] text-xs tracking-widest uppercase mb-3">Stripe References</h3>
              {b.stripeDepositPaymentId && (
                <div className="mb-2">
                  <p className="text-white/30 text-xs uppercase tracking-widest">Deposit Payment</p>
                  <p className="font-mono text-white/50 text-xs break-all">{b.stripeDepositPaymentId}</p>
                </div>
              )}
              {b.stripeBalancePaymentId && (
                <div>
                  <p className="text-white/30 text-xs uppercase tracking-widest">Balance Payment</p>
                  <p className="font-mono text-white/50 text-xs break-all">{b.stripeBalancePaymentId}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
