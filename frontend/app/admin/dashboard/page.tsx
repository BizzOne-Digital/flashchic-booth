'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { dashboardApi } from '@/lib/api'

const statusBadge = (s: string) => <span className={`badge badge-${s}`}>{s.replace('_', ' ')}</span>

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi.getStats()
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-white/40 text-sm animate-pulse">Loading dashboard...</div>

  const { stats, recentBookings, recentLeads, upcomingBookings } = data || {}

  const statCards = [
    { label: 'Total Bookings', value: stats?.totalBookings, sub: `+${stats?.monthBookings} this month`, color: 'text-white' },
    { label: 'Pending Approval', value: stats?.pendingBookings, sub: 'Awaiting confirmation', color: 'text-yellow-400' },
    { label: 'Paid / Complete', value: stats?.paidBookings, sub: 'Fully settled', color: 'text-green-400' },
    { label: 'New Leads', value: stats?.newLeads, sub: `${stats?.totalLeads} total leads`, color: 'text-blue-400' },
    { label: 'Total Revenue', value: `$${stats?.totalRevenue?.toFixed(0) || 0}`, sub: 'From paid bookings', color: 'text-[#d4af37]' },
    { label: 'Deposits Collected', value: `$${stats?.totalDeposits?.toFixed(0) || 0}`, sub: '50% deposits received', color: 'text-[#d4af37]' },
  ]

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div>
        <h2 className="text-xs tracking-widest text-white/40 uppercase mb-4">Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map(card => (
            <div key={card.label} className="admin-card p-5">
              <p className="text-white/40 text-xs tracking-widest uppercase mb-2">{card.label}</p>
              <p className={`text-3xl font-bold ${card.color} mb-1`}>{card.value ?? '—'}</p>
              <p className="text-white/30 text-xs">{card.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs tracking-widest text-white/40 uppercase">Upcoming Events</h2>
          <Link href="/admin/bookings" className="text-[#d4af37] text-xs hover:underline">View all →</Link>
        </div>
        <div className="admin-card overflow-hidden">
          {upcomingBookings?.length === 0 && <p className="text-white/30 text-sm p-4">No upcoming events.</p>}
          <table className="w-full admin-table">
            <thead><tr>
              <th>Client</th><th>Date</th><th>Package</th><th>Location</th><th>Status</th>
            </tr></thead>
            <tbody>
              {upcomingBookings?.map((b: any) => (
                <tr key={b._id}>
                  <td>{b.firstName} {b.lastName}</td>
                  <td>{b.eventDate}</td>
                  <td className="capitalize">{b.package}</td>
                  <td className="text-white/50 text-xs">{b.eventLocation}</td>
                  <td>{statusBadge(b.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs tracking-widest text-white/40 uppercase">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-[#d4af37] text-xs hover:underline">View all →</Link>
          </div>
          <div className="admin-card overflow-hidden">
            <table className="w-full admin-table">
              <thead><tr><th>Client</th><th>Package</th><th>Status</th></tr></thead>
              <tbody>
                {recentBookings?.map((b: any) => (
                  <tr key={b._id}>
                    <td>
                      <Link href={`/admin/bookings/${b._id}`} className="hover:text-[#d4af37] transition-colors">
                        {b.firstName} {b.lastName}
                      </Link>
                      <p className="text-white/30 text-xs">{b.eventDate}</p>
                    </td>
                    <td className="capitalize text-white/60">{b.package}</td>
                    <td>{statusBadge(b.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Leads */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs tracking-widest text-white/40 uppercase">Recent Leads</h2>
            <Link href="/admin/leads" className="text-[#d4af37] text-xs hover:underline">View all →</Link>
          </div>
          <div className="admin-card overflow-hidden">
            <table className="w-full admin-table">
              <thead><tr><th>Name</th><th>Email</th><th>Status</th></tr></thead>
              <tbody>
                {recentLeads?.map((l: any) => (
                  <tr key={l._id}>
                    <td>{l.name}</td>
                    <td className="text-white/50 text-xs">{l.email}</td>
                    <td>{statusBadge(l.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs tracking-widest text-white/40 uppercase mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/admin/bookings', label: 'All Bookings' },
            { href: '/admin/gallery', label: 'Upload Photos' },
            { href: '/admin/pricing', label: 'Edit Pricing' },
            { href: '/admin/promotions', label: 'Create Promo' },
          ].map(a => (
            <Link key={a.href} href={a.href} className="btn-gold px-5 py-2 text-xs tracking-widest">{a.label}</Link>
          ))}
        </div>
      </div>
    </div>
  )
}
