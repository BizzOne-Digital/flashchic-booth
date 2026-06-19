'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { galleryApi } from '@/lib/api'

const CATS = [
  { value: '', label: 'All' },
  { value: 'photobooth', label: 'Photobooth' },
  { value: 'videobooth', label: '360 Video' },
  { value: 'combo', label: 'Combo' },
  { value: 'general', label: 'General' },
]

export default function GalleryPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    setLoading(true)
    const params = filter ? { category: filter } : {}
    galleryApi.getPublic(params)
      .then(res => setItems(res.data.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [filter])

  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1800&q=80" alt="Gallery" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#0a0a0a]/80" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="font-display text-xs tracking-[0.4em] text-[#d4af37] uppercase mb-4">Our Work</p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-white mb-4">Event <span className="gold-text font-semibold">Gallery</span></h1>
          <div className="gold-divider" />
        </div>
      </section>

      <section className="py-16 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {CATS.map(cat => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`px-5 py-2 text-xs tracking-widest border transition-all ${filter === cat.value ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10' : 'border-white/20 text-white/50 hover:border-white/40'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loading && <div className="text-white/30 text-center py-20 animate-pulse">Loading gallery...</div>}

          {!loading && items.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/30 text-sm mb-4">No photos uploaded yet.</p>
              <a href="https://instagram.com/flashchicphotobooth" target="_blank" rel="noopener noreferrer" className="text-[#d4af37] text-sm hover:underline">View our Instagram →</a>
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {items.map((item: any) => (
                <div key={item._id} className="relative group overflow-hidden aspect-square">
                  {item.type === 'video'
                    ? <video src={item.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" muted autoPlay loop playsInline />
                    : <Image src={item.url} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />}
                  <div className="absolute inset-0 bg-[#0a0a0a]/25 group-hover:bg-[#0a0a0a]/10 transition-colors" />
                  <div className="absolute inset-0 border border-[#d4af37]/0 group-hover:border-[#d4af37]/30 transition-colors" />
                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-display text-sm">{item.title}</span>
                    {item.category && <p className="text-white/50 text-xs capitalize">{item.category}</p>}
                  </div>
                  {item.featured && (
                    <div className="absolute top-2 right-2 bg-[#d4af37] text-[#0a0a0a] text-[9px] px-2 py-0.5 font-bold tracking-widest">FEATURED</div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-14">
            <p className="text-white/40 text-sm mb-4">Follow us for more event highlights</p>
            <a href="https://instagram.com/flashchicphotobooth" target="_blank" rel="noopener noreferrer" className="btn-gold px-8 py-3 text-xs tracking-widest font-semibold inline-block">
              @flashchicphotobooth
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-[#0d0d0d] text-center border-t border-[#d4af37]/10">
        <h2 className="font-display text-4xl font-light text-white mb-4">Your Event Could Be <span className="gold-text font-semibold">Next</span></h2>
        <p className="text-white/50 mb-10 font-light">Let's create something beautiful together.</p>
        <Link href="/booking" className="btn-gold px-12 py-4 text-sm tracking-widest font-semibold inline-block">Book Your Experience</Link>
      </section>
    </>
  )
}