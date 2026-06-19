'use client'

import { useEffect, useState } from 'react'
import { leadsApi } from '@/lib/api'

const statusBadge = (s: string) => <span className={`badge badge-${s}`}>{s}</span>

export default function AdminLeads() {
  const [leads, setLeads] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState<any>(null)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const load = async () => {
    setLoading(true)
    const res = await leadsApi.getAll({ search, status })
    setLeads(res.data.data)
    setTotal(res.data.total)
    setLoading(false)
  }

  useEffect(() => { load() }, [search, status])

  const updateStatus = async (id: string, s: string) => {
    await leadsApi.update(id, { status: s })
    setLeads(prev => prev.map(l => l._id === id ? { ...l, status: s } : l))
    if (selected?._id === id) setSelected((l: any) => ({ ...l, status: s }))
    showToast('Status updated')
  }

  const saveNotes = async () => {
    await leadsApi.update(selected._id, { adminNotes: selected.adminNotes })
    showToast('Notes saved')
    load()
  }

  const deleteLead = async (id: string) => {
    if (!confirm('Delete this lead?')) return
    await leadsApi.delete(id)
    setSelected(null)
    load()
  }

  return (
    <div>
      {toast && <div className="fixed bottom-6 right-6 z-50 bg-[#1a1a1a] border border-[#d4af37]/50 text-white px-5 py-3 text-sm">{toast}</div>}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-xl font-semibold">Leads <span className="text-white/30 text-base font-normal ml-2">{total}</span></h1>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          placeholder="Search name, email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="admin-input max-w-xs"
        />
        <select value={status} onChange={e => setStatus(e.target.value)} className="admin-input max-w-[160px]">
          <option value="">All</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead list */}
        <div className="admin-card overflow-hidden">
          <table className="w-full admin-table">
            <thead><tr>
              <th>Name</th><th>Subject</th><th>Status</th><th>Date</th>
            </tr></thead>
            <tbody>
              {loading && <tr><td colSpan={4} className="text-center text-white/30 py-8">Loading...</td></tr>}
              {!loading && leads.length === 0 && <tr><td colSpan={4} className="text-center text-white/30 py-8">No leads yet.</td></tr>}
              {leads.map(l => (
                <tr
                  key={l._id}
                  onClick={() => setSelected(l)}
                  className="cursor-pointer"
                  style={{ background: selected?._id === l._id ? 'rgba(212,175,55,0.08)' : '' }}
                >
                  <td>
                    <p className="font-semibold">{l.name}</p>
                    <p className="text-white/40 text-xs">{l.email}</p>
                  </td>
                  <td className="text-white/50 text-xs">{l.subject || '—'}</td>
                  <td>{statusBadge(l.status)}</td>
                  <td className="text-white/40 text-xs">{new Date(l.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Lead detail */}
        {selected && (
          <div className="admin-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-white font-semibold text-lg">{selected.name}</h2>
                <a href={`mailto:${selected.email}`} className="text-[#d4af37] text-sm">{selected.email}</a>
                {selected.phone && <p className="text-white/50 text-sm">{selected.phone}</p>}
              </div>
              <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white text-lg">×</button>
            </div>

            <div className="mb-4 p-3 bg-[#d4af37]/5 border border-[#d4af37]/20">
              <p className="text-[#d4af37] text-xs tracking-widest uppercase mb-2">{selected.subject || 'Message'}</p>
              <p className="text-white/70 text-sm leading-relaxed">{selected.message}</p>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Status</label>
              <div className="flex gap-2 flex-wrap">
                {['new', 'contacted', 'converted', 'lost'].map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected._id, s)}
                    className={`px-3 py-1 text-xs border transition-all capitalize ${selected.status === s ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10' : 'border-white/20 text-white/50 hover:border-white/40'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Admin Notes</label>
              <textarea
                value={selected.adminNotes || ''}
                onChange={e => setSelected((l: any) => ({ ...l, adminNotes: e.target.value }))}
                rows={3}
                className="admin-input resize-none w-full"
                placeholder="Add internal notes..."
              />
            </div>

            <div className="flex gap-3">
              <a href={`mailto:${selected.email}`} className="btn-gold px-5 py-2 text-xs tracking-widest">Reply by Email</a>
              <button onClick={saveNotes} className="border border-[#d4af37]/40 text-[#d4af37] px-5 py-2 text-xs hover:bg-[#d4af37]/10">Save Notes</button>
              <button onClick={() => deleteLead(selected._id)} className="border border-red-500/30 text-red-400/60 px-4 py-2 text-xs hover:text-red-400">Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
