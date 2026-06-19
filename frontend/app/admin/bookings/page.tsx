'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { bookingsApi, paymentsApi } from '@/lib/api'

const PKG = { photobooth: 'Photobooth', videobooth: '360 Video', combo: 'Combo' }
const statusBadge = (s: string) => <span className={`badge badge-${s}`}>{s.replace('_', ' ')}</span>

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [sendingLink, setSendingLink] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await bookingsApi.getAll({ search, status, page, limit: 15 })
      setBookings(res.data.data)
      setTotal(res.data.total)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [search, status, page])

  const updateStatus = async (id: string, newStatus: string) => {
    await bookingsApi.update(id, { status: newStatus })
    setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b))
  }

  const deleteBooking = async (id: string) => {
    if (!confirm('Delete this booking?')) return
    await bookingsApi.delete(id)
    load()
  }

  const sendPaymentLink = async (bookingId: string, type: 'deposit' | 'balance') => {
    setSendingLink(bookingId + type)
    try {
      const res = await paymentsApi.getPaymentLink(bookingId, type)
      const url = res.data.url
      navigator.clipboard.writeText(url)
      setToast('Payment link copied to clipboard!')
      setTimeout(() => setToast(''), 3000)
    } catch (e: any) {
      setToast(e.response?.data?.message || 'Error generating link')
      setTimeout(() => setToast(''), 3000)
    } finally { setSendingLink(null) }
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1a1a1a] border border-[#d4af37]/50 text-white px-5 py-3 text-sm">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-xl font-semibold">Bookings</h1>
          <p className="text-white/40 text-xs mt-1">{total} total bookings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search name, email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="admin-input max-w-xs"
        />
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }} className="admin-input max-w-[180px]">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="deposit_paid">Deposit Paid</option>
          <option value="paid">Paid</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="admin-card overflow-x-auto">
        <table className="w-full admin-table min-w-[900px]">
          <thead><tr>
            <th>Client</th><th>Package</th><th>Event Date</th><th>Total</th><th>Status</th><th>Payments</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {loading && <tr><td colSpan={7} className="text-center text-white/30 py-8">Loading...</td></tr>}
            {!loading && bookings.length === 0 && <tr><td colSpan={7} className="text-center text-white/30 py-8">No bookings found.</td></tr>}
            {bookings.map(b => (
              <tr key={b._id}>
                <td>
                  <Link href={`/admin/bookings/${b._id}`} className="hover:text-[#d4af37] transition-colors font-semibold">
                    {b.firstName} {b.lastName}
                  </Link>
                  <p className="text-white/40 text-xs">{b.email}</p>
                  <p className="text-white/40 text-xs">{b.phone}</p>
                </td>
                <td className="capitalize">{PKG[b.package as keyof typeof PKG] || b.package}</td>
                <td>{b.eventDate}</td>
                <td>
                  <p className="text-[#d4af37] font-semibold">${b.total?.toFixed(2)}</p>
                  <p className="text-white/30 text-xs">Dep: ${b.depositAmount?.toFixed(2)}</p>
                </td>
                <td>
                  {statusBadge(b.status)}
                  <select
                    value={b.status}
                    onChange={e => updateStatus(b._id, e.target.value)}
                    className="block mt-2 bg-[#1a1a1a] border border-[#d4af37]/20 text-white/70 text-xs py-1 px-2 rounded-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="deposit_paid">Deposit Paid</option>
                    <option value="paid">Paid</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <div className="flex flex-col gap-1">
                    {!b.depositPaid && (
                      <button
                        onClick={() => sendPaymentLink(b._id, 'deposit')}
                        disabled={sendingLink === b._id + 'deposit'}
                        className="text-xs bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] px-2 py-1 hover:bg-[#d4af37]/20 transition-all"
                      >
                        {sendingLink === b._id + 'deposit' ? '...' : '📋 Copy Deposit Link'}
                      </button>
                    )}
                    {b.depositPaid && !b.balancePaid && (
                      <button
                        onClick={() => sendPaymentLink(b._id, 'balance')}
                        disabled={sendingLink === b._id + 'balance'}
                        className="text-xs bg-green-500/10 border border-green-500/30 text-green-400 px-2 py-1 hover:bg-green-500/20 transition-all"
                      >
                        {sendingLink === b._id + 'balance' ? '...' : '📋 Copy Balance Link'}
                      </button>
                    )}
                    {b.depositPaid && <span className="text-xs text-green-400">✓ Deposit</span>}
                    {b.balancePaid && <span className="text-xs text-green-400">✓ Balance</span>}
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-1">
                    <Link href={`/admin/bookings/${b._id}`} className="text-xs text-[#d4af37] hover:underline">View</Link>
                    <button onClick={() => deleteBooking(b._id)} className="text-xs text-red-400/60 hover:text-red-400 text-left">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 15 && (
        <div className="flex gap-3 mt-4 justify-center">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-gold px-4 py-2 text-xs disabled:opacity-40">← Prev</button>
          <span className="text-white/40 text-sm self-center">Page {page}</span>
          <button disabled={page * 15 >= total} onClick={() => setPage(p => p + 1)} className="btn-gold px-4 py-2 text-xs disabled:opacity-40">Next →</button>
        </div>
      )}
    </div>
  )
}
