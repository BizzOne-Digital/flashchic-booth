'use client'

import { useState } from 'react'
import Image from 'next/image'
import { leadsApi } from '@/lib/api'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await leadsApi.submit(form)
      setSent(true)
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to send. Please call (514) 831-8409')
    } finally { setLoading(false) }
  }

  return (
    <>
      <section className="relative pt-40 pb-20 px-6">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1800&q=80" alt="Contact" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#0a0a0a]/82" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="font-display text-xs tracking-[0.4em] text-[#d4af37] uppercase mb-4">Get In Touch</p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-white mb-4">Contact <span className="gold-text font-semibold">Us</span></h1>
          <div className="gold-divider mb-4" />
          <p className="text-white/60 font-light">We respond within 24 hours.</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <h2 className="font-display text-3xl font-light text-white mb-8">Let&apos;s Plan Your<br /><span className="gold-text font-semibold">Perfect Event</span></h2>
            <div className="space-y-5">
              {[
                { icon: '📞', label: 'Phone', value: '(514) 831-8409', href: 'tel:5148318409' },
                { icon: '✉️', label: 'Email', value: 'flashchic84@gmail.com', href: 'mailto:flashchic84@gmail.com' },
                { icon: '📍', label: 'Location', value: 'Laval, Québec', href: null },
                { icon: '📱', label: 'Instagram', value: '@flashchicphotobooth', href: 'https://instagram.com/flashchicphotobooth' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-11 h-11 border border-[#d4af37]/30 flex items-center justify-center text-lg">{item.icon}</div>
                  <div>
                    <p className="text-white/30 text-xs tracking-widest uppercase">{item.label}</p>
                    {item.href
                      ? <a href={item.href} className="text-white hover:text-[#d4af37] transition-colors text-sm">{item.value}</a>
                      : <p className="text-white text-sm">{item.value}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            {sent ? (
              <div className="luxury-card p-10 text-center">
                <div className="text-5xl mb-4">✓</div>
                <h3 className="font-display text-2xl text-white mb-3">Message Sent!</h3>
                <p className="text-white/60 text-sm">We'll reply within 24 hours at <strong className="text-[#d4af37]">{form.email}</strong></p>
              </div>
            ) : (
              <form onSubmit={submit} className="luxury-card p-8 md:p-10">
                {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 mb-5">{error}</div>}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Name *</label>
                    <input name="name" value={form.name} onChange={handle} required placeholder="Your name" className="luxury-input w-full px-4 py-3 text-sm" /></div>
                  <div><label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handle} required placeholder="your@email.com" className="luxury-input w-full px-4 py-3 text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Phone</label>
                    <input name="phone" value={form.phone} onChange={handle} placeholder="(514) 000-0000" className="luxury-input w-full px-4 py-3 text-sm" /></div>
                  <div><label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Subject</label>
                    <select name="subject" value={form.subject} onChange={handle} className="luxury-input w-full px-4 py-3 text-sm">
                      <option value="">Select topic</option>
                      <option>General Inquiry</option>
                      <option>Booking Request</option>
                      <option>Pricing Question</option>
                      <option>Custom Package</option>
                      <option>Other</option>
                    </select></div>
                </div>
                <div className="mb-6"><label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Message *</label>
                  <textarea name="message" value={form.message} onChange={handle} required rows={5} placeholder="Tell us about your event..." className="luxury-input w-full px-4 py-3 text-sm resize-none" /></div>
                <button type="submit" disabled={loading} className="btn-gold w-full py-4 text-sm tracking-widest font-semibold disabled:opacity-60">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
