'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { galleryApi } from '@/lib/api'

export default function AdminGallery() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [filter, setFilter] = useState('')
  const [toast, setToast] = useState({ msg: '', type: '' })
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({ title: '', category: 'general', featured: false, tags: '' })
  const [editItem, setEditItem] = useState<any>(null)

  const showToast = (msg: string, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg: '', type: '' }), 3000)
  }

  const load = async () => {
    setLoading(true)
    const params = filter ? { category: filter } : {}
    const res = await galleryApi.getAll(params)
    setItems(res.data.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fileRef.current?.files?.length) return showToast('Please select a file', 'error')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', fileRef.current.files[0])
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)))
      await galleryApi.upload(fd)
      showToast('Uploaded successfully!')
      setForm({ title: '', category: 'general', featured: false, tags: '' })
      if (fileRef.current) fileRef.current.value = ''
      load()
    } catch (e: any) {
      showToast(e.response?.data?.message || 'Upload failed', 'error')
    } finally { setUploading(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item from gallery and Cloudinary?')) return
    await galleryApi.delete(id)
    showToast('Deleted')
    load()
  }

  const handleUpdate = async () => {
    if (!editItem) return
    await galleryApi.update(editItem._id, { featured: editItem.featured, category: editItem.category, title: editItem.title })
    setEditItem(null)
    showToast('Updated')
    load()
  }

  const toggleFeatured = async (item: any) => {
    await galleryApi.update(item._id, { featured: !item.featured })
    showToast(!item.featured ? 'Marked as featured' : 'Removed from featured')
    load()
  }

  return (
    <div>
      {toast.msg && (
        <div className={`fixed bottom-6 right-6 z-50 border px-5 py-3 text-sm ${toast.type === 'error' ? 'bg-red-900/80 border-red-500/50 text-red-200' : 'bg-[#1a1a1a] border-[#d4af37]/50 text-white'}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-xl font-semibold">Gallery</h1>
        <span className="text-white/40 text-xs">{items.length} items</span>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="admin-card p-6 mb-8">
        <h2 className="text-[#d4af37] text-xs tracking-widest uppercase mb-4">Upload New Media</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Title</label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Photo/video title"
              className="admin-input"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Category</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="admin-input"
            >
              <option value="general">General</option>
              <option value="photobooth">Photobooth</option>
              <option value="videobooth">Videobooth</option>
              <option value="combo">Combo</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Tags (comma-sep)</label>
            <input
              value={form.tags}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              placeholder="birthday, wedding..."
              className="admin-input"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">File (image/video)</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              className="admin-input text-white/60 file:mr-3 file:py-1 file:px-3 file:border-0 file:bg-[#d4af37]/20 file:text-[#d4af37] file:text-xs file:cursor-pointer"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-white/60 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
              className="accent-[#d4af37]"
            />
            Featured (shows on homepage)
          </label>
          <button type="submit" disabled={uploading} className="btn-gold px-6 py-2 text-xs tracking-widest disabled:opacity-50">
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </form>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['', 'general', 'photobooth', 'videobooth', 'combo'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 text-xs tracking-widest border transition-all ${filter === cat ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10' : 'border-white/20 text-white/40 hover:border-white/40'}`}
          >
            {cat || 'All'}
          </button>
        ))}
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#d4af37]/30 p-6 w-full max-w-md">
            <h3 className="text-[#d4af37] text-sm tracking-widest uppercase mb-4">Edit Item</h3>
            <input value={editItem.title} onChange={e => setEditItem((i: any) => ({ ...i, title: e.target.value }))} className="admin-input mb-3" placeholder="Title" />
            <select value={editItem.category} onChange={e => setEditItem((i: any) => ({ ...i, category: e.target.value }))} className="admin-input mb-3">
              <option value="general">General</option>
              <option value="photobooth">Photobooth</option>
              <option value="videobooth">Videobooth</option>
              <option value="combo">Combo</option>
            </select>
            <label className="flex items-center gap-2 text-white/60 text-sm mb-4">
              <input type="checkbox" checked={editItem.featured} onChange={e => setEditItem((i: any) => ({ ...i, featured: e.target.checked }))} className="accent-[#d4af37]" />
              Featured
            </label>
            <div className="flex gap-3">
              <button onClick={handleUpdate} className="btn-gold px-5 py-2 text-xs">Save</button>
              <button onClick={() => setEditItem(null)} className="border border-white/20 text-white/60 px-5 py-2 text-xs hover:border-white/40">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {loading ? (
        <p className="text-white/30 text-sm animate-pulse">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {items.map(item => (
            <div key={item._id} className="relative group admin-card overflow-hidden">
              {item.type === 'video' ? (
                <video src={item.url} className="w-full h-36 object-cover" muted />
              ) : (
                <div className="relative h-36">
                  <Image src={item.url} alt={item.title} fill className="object-cover" />
                </div>
              )}
              {item.featured && (
                <div className="absolute top-2 left-2 bg-[#d4af37] text-[#0a0a0a] text-[9px] px-2 py-0.5 font-bold tracking-widest">FEATURED</div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <p className="text-white text-xs font-semibold truncate mb-2">{item.title}</p>
                <p className="text-white/50 text-[10px] mb-2 capitalize">{item.category}</p>
                <div className="flex gap-2">
                  <button onClick={() => setEditItem(item)} className="flex-1 bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-[10px] py-1 hover:bg-[#d4af37]/30">Edit</button>
                  <button onClick={() => toggleFeatured(item)} className="flex-1 bg-white/10 border border-white/20 text-white text-[10px] py-1 hover:bg-white/20">
                    {item.featured ? 'Unfeature' : 'Feature'}
                  </button>
                </div>
                <button onClick={() => handleDelete(item._id)} className="mt-1 w-full bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] py-1 hover:bg-red-500/30">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-white/30 text-sm col-span-full py-8 text-center">No gallery items. Upload your first photo!</p>}
        </div>
      )}
    </div>
  )
}
