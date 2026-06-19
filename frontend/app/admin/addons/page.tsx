'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { addonsApi } from '@/lib/api'

const emptyAddon = {
  name: '', description: '', price: 0, priceLabel: '',
  image: '', category: 'general', active: true, order: 0,
  tiers: [] as { label: string; price: number }[],
}

export default function AdminAddons() {
  const [addons, setAddons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(emptyAddon)
  const [imagePreview, setImagePreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [hasTiers, setHasTiers] = useState(false)
  const [toast, setToast] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const load = async () => {
    setLoading(true)
    const res = await addonsApi.getAll()
    setAddons(res.data.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyAddon, tiers: [] })
    setImagePreview('')
    setHasTiers(false)
    setIsOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openEdit = (addon: any) => {
    setEditing(addon)
    setForm({ ...addon })
    setImagePreview(addon.image || '')
    setHasTiers(addon.tiers && addon.tiers.length > 0)
    setIsOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImagePreview(URL.createObjectURL(file))
  }

  const addTier = () => setForm((f: any) => ({ ...f, tiers: [...(f.tiers || []), { label: '', price: 0 }] }))
  const removeTier = (i: number) => setForm((f: any) => ({ ...f, tiers: f.tiers.filter((_: any, idx: number) => idx !== i) }))
  const updateTier = (i: number, key: string, val: any) =>
    setForm((f: any) => ({ ...f, tiers: f.tiers.map((t: any, idx: number) => idx === i ? { ...t, [key]: val } : t) }))

  const save = async () => {
    if (!form.name) { showToast('Name is required'); return }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('description', form.description || '')
      fd.append('price', String(form.price || 0))
      fd.append('priceLabel', form.priceLabel || '')
      fd.append('category', form.category || 'general')
      fd.append('active', String(form.active))
      fd.append('order', String(form.order || 0))
      fd.append('tiers', JSON.stringify(hasTiers ? form.tiers : []))

      if (fileRef.current?.files?.[0]) {
        fd.append('image', fileRef.current.files[0])
      } else if (form.image) {
        fd.append('image', form.image)
      }

      if (editing) {
        await addonsApi.update(editing._id, fd)
        showToast('Add-on updated!')
      } else {
        await addonsApi.create(fd)
        showToast('Add-on created!')
      }

      setIsOpen(false)
      setEditing(null)
      setImagePreview('')
      if (fileRef.current) fileRef.current.value = ''
      load()
    } catch (e: any) {
      showToast(e.response?.data?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  const del = async (id: string) => {
    if (!confirm('Delete this add-on?')) return
    await addonsApi.delete(id)
    showToast('Deleted')
    load()
  }

  const toggleActive = async (addon: any) => {
    const fd = new FormData()
    fd.append('active', String(!addon.active))
    await addonsApi.update(addon._id, fd)
    load()
  }

  return (
    <div>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1a1a1a] border border-[#d4af37]/50 text-white px-5 py-3 text-sm shadow-xl">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-xl font-semibold">Add-Ons & Extras</h1>
        <div className="flex gap-3">
          <button
            onClick={() => addonsApi.seed().then(() => { showToast('Default add-ons seeded!'); load() })}
            className="border border-[#d4af37]/30 text-[#d4af37] text-xs px-4 py-2 hover:bg-[#d4af37]/10 transition-all"
          >
            Seed Defaults
          </button>
          <button onClick={openCreate} className="btn-gold px-5 py-2 text-xs tracking-widest">
            + New Add-On
          </button>
        </div>
      </div>

      {/* Form Panel */}
      {isOpen && (
        <div className="admin-card p-6 mb-8">
          <h2 className="text-[#d4af37] text-xs tracking-widest uppercase mb-6">
            {editing ? `Editing: ${editing.name}` : 'New Add-On'}
          </h2>

          {/* Image */}
          <div className="mb-6">
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Image</label>
            <div className="flex items-start gap-4">
              <div className="relative w-36 h-24 bg-[#1a1a1a] border border-[#d4af37]/20 overflow-hidden flex-shrink-0">
                {imagePreview
                  ? <Image src={imagePreview} alt="preview" fill className="object-cover" />
                  : <div className="flex items-center justify-center h-full text-white/20 text-xs">No image</div>
                }
              </div>
              <div className="flex-1">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="admin-input text-white/60 text-sm file:mr-3 file:py-1.5 file:px-4 file:border-0 file:bg-[#d4af37]/20 file:text-[#d4af37] file:text-xs file:cursor-pointer mb-2"
                />
                <p className="text-white/30 text-xs mb-1">Or paste URL:</p>
                <input
                  value={form.image}
                  onChange={e => { setForm((f: any) => ({ ...f, image: e.target.value })); setImagePreview(e.target.value) }}
                  placeholder="https://..."
                  className="admin-input text-sm"
                />
              </div>
            </div>
          </div>

          {/* Basic fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Name *</label>
              <input value={form.name} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} placeholder="e.g. Ring Light" className="admin-input" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Category</label>
              <select value={form.category} onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))} className="admin-input">
                <option value="general">General</option>
                <option value="lighting">Lighting</option>
                <option value="decor">Decor</option>
                <option value="booth">Booth</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Display Order</label>
              <input type="number" value={form.order} onChange={e => setForm((f: any) => ({ ...f, order: +e.target.value }))} className="admin-input" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Description</label>
            <textarea value={form.description} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} rows={2} className="admin-input resize-none" placeholder="Short description shown on card..." />
          </div>

          {/* Pricing type toggle */}
          <div className="mb-5 p-4 border border-[#d4af37]/15 bg-[#d4af37]/5">
            <label className="flex items-center gap-2 text-white/70 text-sm cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={hasTiers}
                onChange={e => setHasTiers(e.target.checked)}
                className="accent-[#d4af37] w-4 h-4"
              />
              This add-on has tiered pricing (like stanchions with different quantities)
            </label>

            {!hasTiers ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Price ($)</label>
                  <input type="number" value={form.price} onChange={e => setForm((f: any) => ({ ...f, price: +e.target.value }))} className="admin-input" placeholder="25" />
                </div>
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Price Label</label>
                  <input value={form.priceLabel} onChange={e => setForm((f: any) => ({ ...f, priceLabel: e.target.value }))} className="admin-input" placeholder="flat rate / per hour / etc." />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-widest mb-3">Pricing Tiers</label>
                <div className="space-y-2 mb-3">
                  {(form.tiers || []).map((tier: any, i: number) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        value={tier.label}
                        onChange={e => updateTier(i, 'label', e.target.value)}
                        className="admin-input flex-1 text-sm"
                        placeholder="e.g. 2 stanchions + 1 rope"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-white/30 text-sm">$</span>
                        <input
                          type="number"
                          value={tier.price}
                          onChange={e => updateTier(i, 'price', +e.target.value)}
                          className="admin-input w-20 text-sm"
                          placeholder="20"
                        />
                      </div>
                      <button onClick={() => removeTier(i)} className="text-red-400/60 hover:text-red-400 px-2 text-lg">×</button>
                    </div>
                  ))}
                </div>
                <button onClick={addTier} className="text-[#d4af37] text-xs hover:underline">+ Add tier</button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 mb-6">
            <label className="flex items-center gap-2 text-white/60 text-sm cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => setForm((f: any) => ({ ...f, active: e.target.checked }))} className="accent-[#d4af37] w-4 h-4" />
              Active (visible on site)
            </label>
          </div>

          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="btn-gold px-8 py-2.5 text-xs tracking-widest disabled:opacity-50">
              {saving ? 'Saving...' : editing ? 'Update Add-On' : 'Create Add-On'}
            </button>
            <button
              onClick={() => { setIsOpen(false); setEditing(null); setImagePreview('') }}
              className="border border-white/20 text-white/60 px-6 py-2.5 text-xs hover:border-white/40 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <p className="text-white/30 animate-pulse text-sm">Loading...</p>
      ) : addons.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white/30 text-sm mb-4">No add-ons yet.</p>
          <button
            onClick={() => addonsApi.seed().then(() => { showToast('Seeded!'); load() })}
            className="btn-gold px-6 py-2 text-xs"
          >
            Seed Default Add-Ons
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addons.map(addon => (
            <div key={addon._id} className="admin-card p-5 flex items-start gap-4">
              {/* Image */}
              <div className="relative w-20 h-16 bg-[#1a1a1a] border border-[#d4af37]/15 overflow-hidden flex-shrink-0">
                {addon.image
                  ? <Image src={addon.image} alt={addon.name} fill className="object-cover" />
                  : <div className="flex items-center justify-center h-full text-white/20 text-[10px]">No img</div>
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-white font-semibold text-sm">{addon.name}</h3>
                  <span className="text-[10px] text-white/30 border border-white/10 px-1.5 py-0.5 capitalize">{addon.category}</span>
                  <span className={`badge ${addon.active ? 'badge-paid' : 'badge-cancelled'}`}>
                    {addon.active ? 'Active' : 'Hidden'}
                  </span>
                </div>

                {addon.tiers?.length > 0 ? (
                  <div className="text-xs text-[#d4af37] space-y-0.5">
                    {addon.tiers.map((t: any, i: number) => (
                      <div key={i}>{t.label} — ${t.price}</div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#d4af37] font-semibold text-sm">
                    ${addon.price} <span className="text-white/30 font-normal text-xs">{addon.priceLabel}</span>
                  </p>
                )}

                <p className="text-white/40 text-xs mt-1 line-clamp-1">{addon.description}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <button onClick={() => openEdit(addon)} className="btn-gold px-4 py-1.5 text-xs">Edit</button>
                <button onClick={() => toggleActive(addon)} className="border border-white/20 text-white/50 px-4 py-1.5 text-xs hover:border-white/40 transition-all">
                  {addon.active ? 'Hide' : 'Show'}
                </button>
                <button onClick={() => del(addon._id)} className="border border-red-500/30 text-red-400/60 px-4 py-1.5 text-xs hover:text-red-400 transition-all">
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}