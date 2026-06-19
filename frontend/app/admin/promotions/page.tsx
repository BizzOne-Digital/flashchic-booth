'use client'

import { useEffect, useState } from 'react'
import { promosApi } from '@/lib/api'

const emptyPromo = {
  code: '', description: '', type: 'percent', value: 10,
  maxUses: 0, active: true, expiresAt: '', appliesTo: ['all'],
}

export default function AdminPromotions() {
  const [promos, setPromos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<any>(emptyPromo)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const load = async () => {
    const res = await promosApi.getAll()
    setPromos(res.data.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    const data = { ...form, code: form.code.toUpperCase(), expiresAt: form.expiresAt || null }
    await promosApi.create(data)
    showToast('Promo created!')
    setCreating(false)
    setForm(emptyPromo)
    load()
  }

  const toggle = async (promo: any) => {
    await promosApi.update(promo._id, { active: !promo.active })
    load()
  }

  const del = async (id: string) => {
    if (!confirm('Delete this promo code?')) return
    await promosApi.delete(id)
    load()
  }

  return (
    <div>
      {toast && <div className="fixed bottom-6 right-6 z-50 bg-[#1a1a1a] border border-[#d4af37]/50 text-white px-5 py-3 text-sm">{toast}</div>}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-xl font-semibold">Promotions & Discount Codes</h1>
        <button onClick={() => setCreating(c => !c)} className="btn-gold px-5 py-2 text-xs tracking-widest">
          {creating ? 'Cancel' : '+ New Code'}
        </button>
      </div>

      {/* Create form */}
      {creating && (
        <div className="admin-card p-6 mb-8">
          <h2 className="text-[#d4af37] text-xs tracking-widest uppercase mb-5">New Promo Code</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Code (auto uppercase)</label>
              <input
                value={form.code}
                onChange={e => setForm((f: any) => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="SUMMER20"
                className="admin-input font-mono tracking-widest"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Type</label>
              <select value={form.type} onChange={e => setForm((f: any) => ({ ...f, type: e.target.value }))} className="admin-input">
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">
                Value ({form.type === 'percent' ? '%' : '$'})
              </label>
              <input
                type="number"
                value={form.value}
                onChange={e => setForm((f: any) => ({ ...f, value: +e.target.value }))}
                min={1}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Max Uses (0 = unlimited)</label>
              <input
                type="number"
                value={form.maxUses}
                onChange={e => setForm((f: any) => ({ ...f, maxUses: +e.target.value }))}
                min={0}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Expiry Date (optional)</label>
              <input
                type="date"
                value={form.expiresAt}
                onChange={e => setForm((f: any) => ({ ...f, expiresAt: e.target.value }))}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Description</label>
              <input
                value={form.description}
                onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))}
                placeholder="Summer discount..."
                className="admin-input"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 mb-5">
            <label className="flex items-center gap-2 text-white/60 text-sm cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => setForm((f: any) => ({ ...f, active: e.target.checked }))} className="accent-[#d4af37]" />
              Active
            </label>
          </div>
          <button onClick={save} className="btn-gold px-6 py-2 text-xs tracking-widest">Create Promo Code</button>
        </div>
      )}

      {/* Promo List */}
      {loading ? <p className="text-white/30 animate-pulse text-sm">Loading...</p> : (
        <div className="admin-card overflow-x-auto">
          <table className="w-full admin-table">
            <thead><tr>
              <th>Code</th><th>Type</th><th>Value</th><th>Uses</th><th>Expires</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {promos.length === 0 && (
                <tr><td colSpan={7} className="text-center text-white/30 py-8">No promo codes yet.</td></tr>
              )}
              {promos.map(p => (
                <tr key={p._id}>
                  <td>
                    <span className="font-mono text-[#d4af37] font-bold tracking-widest">{p.code}</span>
                    {p.description && <p className="text-white/40 text-xs mt-0.5">{p.description}</p>}
                  </td>
                  <td className="capitalize text-white/60">{p.type}</td>
                  <td className="text-white font-semibold">
                    {p.type === 'percent' ? `${p.value}%` : `$${p.value}`}
                  </td>
                  <td className="text-white/60">
                    {p.usedCount} / {p.maxUses === 0 ? '∞' : p.maxUses}
                  </td>
                  <td className="text-white/50 text-xs">
                    {p.expiresAt ? new Date(p.expiresAt).toLocaleDateString() : '—'}
                  </td>
                  <td>
                    <span className={`badge ${p.active ? 'badge-paid' : 'badge-cancelled'}`}>
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => toggle(p)} className="text-xs border border-white/20 text-white/60 px-3 py-1 hover:border-white/40">
                        {p.active ? 'Disable' : 'Enable'}
                      </button>
                      <button onClick={() => del(p._id)} className="text-xs border border-red-500/30 text-red-400/60 px-3 py-1 hover:text-red-400">Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
