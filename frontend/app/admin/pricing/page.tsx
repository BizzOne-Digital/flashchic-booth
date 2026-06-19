'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { api } from '@/lib/api'

const emptyPkg = {
  name: '', slug: '', price: 150, unit: '/hr', minimum: 2,
  description: '', tagline: '', image: '',
  featured: false, active: true, order: 0,
  features: [''], notIncluded: [''],
}

export default function AdminPricing() {
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<any>(emptyPkg)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const load = async () => {
    setLoading(true)
    const res = await api.get('/pricing/all')
    setPackages(res.data.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openEdit = (pkg: any) => {
    setEditing(pkg)
    setForm({
      ...pkg,
      features: pkg.features?.length ? pkg.features : [''],
      notIncluded: pkg.notIncluded?.length ? pkg.notIncluded : [''],
    })
    setImagePreview(pkg.image || '')
    setCreating(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyPkg })
    setImagePreview('')
    setCreating(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImagePreview(URL.createObjectURL(file))
  }

  const save = async () => {
    if (!form.name || !form.slug || !form.price) {
      showToast('Name, slug and price are required')
      return
    }
    setSaving(true)
    try {
      // Use FormData so image file can be sent
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('slug', form.slug)
      fd.append('price', String(form.price))
      fd.append('unit', form.unit || '/hr')
      fd.append('minimum', String(form.minimum || 2))
      fd.append('description', form.description || '')
      fd.append('tagline', form.tagline || '')
      fd.append('featured', String(form.featured))
      fd.append('active', String(form.active))
      fd.append('order', String(form.order || 0))

      // Features & notIncluded as JSON string
      const features = form.features.filter(Boolean)
      const notIncluded = form.notIncluded.filter(Boolean)
      features.forEach((f: string) => fd.append('features[]', f))
      notIncluded.forEach((f: string) => fd.append('notIncluded[]', f))

      // Image: file if selected, else keep existing URL
      if (fileRef.current?.files?.[0]) {
        fd.append('image', fileRef.current.files[0])
      } else if (form.image) {
        fd.append('image', form.image)
      }

      if (editing) {
        await api.put(`/pricing/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        showToast('Package updated!')
      } else {
        await api.post('/pricing', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        showToast('Package created!')
      }

      setEditing(null)
      setCreating(false)
      setImagePreview('')
      if (fileRef.current) fileRef.current.value = ''
      load()
    } catch (e: any) {
      showToast(e.response?.data?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  const deletePkg = async (id: string) => {
    if (!confirm('Delete this package?')) return
    await api.delete(`/pricing/${id}`)
    showToast('Deleted')
    load()
  }

  const toggleActive = async (pkg: any) => {
    const fd = new FormData()
    fd.append('active', String(!pkg.active))
    await api.put(`/pricing/${pkg._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    load()
  }

  const updateFeature = (idx: number, val: string, field: 'features' | 'notIncluded') => {
    setForm((f: any) => ({ ...f, [field]: f[field].map((v: string, i: number) => i === idx ? val : v) }))
  }
  const addFeature = (field: 'features' | 'notIncluded') =>
    setForm((f: any) => ({ ...f, [field]: [...f[field], ''] }))
  const removeFeature = (idx: number, field: 'features' | 'notIncluded') =>
    setForm((f: any) => ({ ...f, [field]: f[field].filter((_: any, i: number) => i !== idx) }))

  const isOpen = editing || creating

  return (
    <div>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1a1a1a] border border-[#d4af37]/50 text-white px-5 py-3 text-sm shadow-xl">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-xl font-semibold">Pricing Packages</h1>
        <div className="flex gap-3">
          <button
            onClick={() => api.post('/pricing/seed').then(() => { showToast('Default packages seeded'); load() })}
            className="border border-[#d4af37]/30 text-[#d4af37] text-xs px-4 py-2 hover:bg-[#d4af37]/10 transition-all"
          >
            Seed Defaults
          </button>
          <button onClick={openCreate} className="btn-gold px-5 py-2 text-xs tracking-widest">
            + New Package
          </button>
        </div>
      </div>

      {/* Edit / Create Panel */}
      {isOpen && (
        <div className="admin-card p-6 mb-8">
          <h2 className="text-[#d4af37] text-xs tracking-widest uppercase mb-6">
            {editing ? `Editing: ${editing.name}` : 'New Package'}
          </h2>

          {/* Image upload */}
          <div className="mb-6">
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Card Image</label>
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="relative w-40 h-28 bg-[#1a1a1a] border border-[#d4af37]/20 overflow-hidden flex-shrink-0">
                {imagePreview ? (
                  <Image src={imagePreview} alt="preview" fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-white/20 text-xs">No image</div>
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="admin-input text-white/60 text-sm file:mr-3 file:py-1.5 file:px-4 file:border-0 file:bg-[#d4af37]/20 file:text-[#d4af37] file:text-xs file:cursor-pointer file:tracking-widest mb-3"
                />
                <p className="text-white/30 text-xs mb-2">Or paste image URL:</p>
                <input
                  value={form.image}
                  onChange={e => { setForm((f: any) => ({ ...f, image: e.target.value })); setImagePreview(e.target.value) }}
                  placeholder="https://... (Unsplash, Cloudinary, etc.)"
                  className="admin-input text-sm"
                />
              </div>
            </div>
          </div>

          {/* Basic fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
            {[
              { label: 'Package Name', key: 'name', type: 'text', placeholder: 'e.g. Photobooth' },
              { label: 'Slug', key: 'slug', type: 'text', placeholder: 'e.g. photobooth' },
              { label: 'Tagline', key: 'tagline', type: 'text', placeholder: 'Short catchy line' },
              { label: 'Price ($/hr)', key: 'price', type: 'number', placeholder: '150' },
              { label: 'Minimum Hours', key: 'minimum', type: 'number', placeholder: '2' },
              { label: 'Display Order', key: 'order', type: 'number', placeholder: '1' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  placeholder={f.placeholder}
                  onChange={e => setForm((p: any) => ({ ...p, [f.key]: f.type === 'number' ? +e.target.value : e.target.value }))}
                  className="admin-input"
                />
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Description (shown on card)</label>
            <textarea
              value={form.description}
              onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))}
              rows={3}
              placeholder="Describe this package..."
              className="admin-input h-20 resize-none"
            />
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-3">
                Features <span className="text-[#d4af37]">(What&apos;s included)</span>
              </label>
              {form.features.map((f: string, i: number) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    value={f}
                    onChange={e => updateFeature(i, e.target.value, 'features')}
                    className="admin-input flex-1 text-sm"
                    placeholder={`Feature ${i + 1}`}
                  />
                  <button onClick={() => removeFeature(i, 'features')} className="text-red-400/60 hover:text-red-400 px-2 text-lg">×</button>
                </div>
              ))}
              <button onClick={() => addFeature('features')} className="text-[#d4af37] text-xs hover:underline mt-1">
                + Add feature
              </button>
            </div>

            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-3">
                Not Included <span className="text-white/20">(shown crossed out)</span>
              </label>
              {form.notIncluded.map((f: string, i: number) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    value={f}
                    onChange={e => updateFeature(i, e.target.value, 'notIncluded')}
                    className="admin-input flex-1 text-sm"
                    placeholder={`e.g. 360 video capability`}
                  />
                  <button onClick={() => removeFeature(i, 'notIncluded')} className="text-red-400/60 hover:text-red-400 px-2 text-lg">×</button>
                </div>
              ))}
              <button onClick={() => addFeature('notIncluded')} className="text-[#d4af37] text-xs hover:underline mt-1">
                + Add item
              </button>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6 mb-6">
            <label className="flex items-center gap-2 text-white/60 text-sm cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => setForm((p: any) => ({ ...p, featured: e.target.checked }))} className="accent-[#d4af37] w-4 h-4" />
              Featured (highlighted card)
            </label>
            <label className="flex items-center gap-2 text-white/60 text-sm cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => setForm((p: any) => ({ ...p, active: e.target.checked }))} className="accent-[#d4af37] w-4 h-4" />
              Active (visible on site)
            </label>
          </div>

          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="btn-gold px-8 py-2.5 text-xs tracking-widest disabled:opacity-50">
              {saving ? 'Saving...' : editing ? 'Update Package' : 'Create Package'}
            </button>
            <button
              onClick={() => { setEditing(null); setCreating(false); setImagePreview('') }}
              className="border border-white/20 text-white/60 px-6 py-2.5 text-xs hover:border-white/40 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Package Cards */}
      {loading ? (
        <p className="text-white/30 animate-pulse text-sm">Loading...</p>
      ) : packages.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white/30 text-sm mb-4">No packages yet.</p>
          <button onClick={() => api.post('/pricing/seed').then(() => { showToast('Seeded!'); load() })} className="btn-gold px-6 py-2 text-xs">
            Seed Default Packages
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {packages.map(pkg => (
            <div key={pkg._id} className="admin-card p-5">
              <div className="flex items-start gap-5">
                {/* Image thumbnail */}
                <div className="relative w-24 h-16 bg-[#1a1a1a] border border-[#d4af37]/15 overflow-hidden flex-shrink-0">
                  {pkg.image ? (
                    <Image src={pkg.image} alt={pkg.name} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white/20 text-[10px]">No img</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="text-white font-semibold">{pkg.name}</h3>
                    {pkg.featured && <span className="badge badge-confirmed">Featured</span>}
                    <span className={`badge ${pkg.active ? 'badge-paid' : 'badge-cancelled'}`}>
                      {pkg.active ? 'Active' : 'Hidden'}
                    </span>
                    <span className="text-white/30 text-xs">Order: {pkg.order}</span>
                  </div>
                  <p className="text-[#d4af37] text-lg font-bold mb-1">
                    ${pkg.price}{pkg.unit}
                    <span className="text-white/30 text-xs font-normal ml-2">{pkg.minimum}hr min</span>
                  </p>
                  <p className="text-white/40 text-sm italic mb-2">{pkg.tagline}</p>
                  <p className="text-white/50 text-sm leading-relaxed line-clamp-2">{pkg.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {pkg.features?.slice(0, 4).map((f: string) => (
                      <span key={f} className="text-xs text-white/40 border border-white/10 px-2 py-0.5">✓ {f}</span>
                    ))}
                    {pkg.features?.length > 4 && (
                      <span className="text-xs text-white/25">+{pkg.features.length - 4} more</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(pkg)} className="btn-gold px-5 py-2 text-xs tracking-widest">
                    Edit
                  </button>
                  <button
                    onClick={() => toggleActive(pkg)}
                    className="border border-white/20 text-white/60 px-5 py-2 text-xs hover:border-white/40 transition-all"
                  >
                    {pkg.active ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => deletePkg(pkg._id)}
                    className="border border-red-500/30 text-red-400/60 px-5 py-2 text-xs hover:text-red-400 hover:border-red-500/50 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}