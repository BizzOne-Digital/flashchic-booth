'use client'

import { useState } from 'react'
import Image from 'next/image'
import { bookingsApi, paymentsApi, promosApi } from '@/lib/api'

const RATES: Record<string, number> = { photobooth: 150, videobooth: 150, combo: 250 }
const MIN_HOURS: Record<string, number> = { photobooth: 2, videobooth: 2, combo: 3 }
const TAX = 0.15

const calc = (pkg: string, hours: number, discount = 0) => {
  const rate = RATES[pkg] || 150
  const h = Math.max(hours, MIN_HOURS[pkg] || 2)
  const sub = rate * h - discount
  const tax = +(sub * TAX).toFixed(2)
  const total = +(sub + tax).toFixed(2)
  const deposit = +(total * 0.5).toFixed(2)
  return { subtotal: sub, tax, total, deposit }
}

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [bookingId, setBookingId] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoMsg, setPromoMsg] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [toast, setToast] = useState({ msg: '', type: '' })

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    package: '', hours: '', eventType: '', eventDate: '',
    startTime: '', endTime: '', eventLocation: '',
    guestCount: '', indoorOutdoor: '', theme: '', additionalInfo: '',
  })

  const showToast = (msg: string, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg: '', type: '' }), 4000)
  }

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const pricing = form.package ? calc(form.package, +form.hours || 0, promoDiscount) : null

  const applyPromo = async () => {
    if (!promoCode) return
    setPromoLoading(true)
    setPromoMsg('')
    try {
      const res = await promosApi.validate(promoCode)
      const d = res.data.data
      const sub = (RATES[form.package] || 150) * Math.max(+form.hours || 0, MIN_HOURS[form.package] || 2)
      const discAmount = d.type === 'percent' ? +(sub * d.value / 100).toFixed(2) : d.value
      setPromoDiscount(discAmount)
      setPromoMsg(`✓ ${d.type === 'percent' ? d.value + '%' : '$' + d.value} off applied!`)
    } catch (e: any) {
      setPromoMsg('✗ ' + (e.response?.data?.message || 'Invalid code'))
      setPromoDiscount(0)
    } finally { setPromoLoading(false) }
  }

  const next = () => {
    if (step === 1 && (!form.firstName || !form.email || !form.phone)) { showToast('Fill in all contact fields', 'error'); return }
    if (step === 2 && (!form.package || !form.eventDate || !form.eventLocation)) { showToast('Fill in all event details', 'error'); return }
    setStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await bookingsApi.create({ ...form, discountCode: promoCode || undefined, discountAmount: promoDiscount })
      const id = res.data.data._id
      setBookingId(id)

      // Redirect to Stripe deposit
      const stripeRes = await paymentsApi.createDepositSession(id)
      window.location.href = stripeRes.data.url
    } catch (e: any) {
      showToast(e.response?.data?.message || 'Submission failed. Please call (514) 831-8409', 'error')
    } finally { setLoading(false) }
  }

  return (
    <>
      {toast.msg && (
        <div className={`fixed bottom-6 right-6 z-50 border px-5 py-3 text-sm ${toast.type === 'error' ? 'bg-red-900/80 border-red-500/50 text-red-200' : 'bg-[#1a1a1a] border-[#d4af37]/50 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1800&q=80" alt="Book" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#0a0a0a]/82" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="font-display text-xs tracking-[0.4em] text-[#d4af37] uppercase mb-4">Reserve Your Date</p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-white mb-4">Book <span className="gold-text font-semibold">Your Experience</span></h1>
          <div className="gold-divider mb-4" />
          <p className="text-white/60 font-light">50% deposit secures your date via Stripe. We confirm within 24 hours.</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-[#0a0a0a]">
        <div className="max-w-2xl mx-auto">
          {/* Steps */}
          <div className="flex items-center justify-center gap-4 mb-10">
            {['Contact', 'Event', 'Review & Pay'].map((label, i) => {
              const num = i + 1
              return (
                <div key={label} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 flex items-center justify-center border font-display text-sm transition-all ${step >= num ? 'border-[#d4af37] bg-[#d4af37] text-[#0a0a0a]' : 'border-[#d4af37]/30 text-white/40'}`}>
                      {step > num ? '✓' : num}
                    </div>
                    <span className={`text-[10px] tracking-widest uppercase mt-1 ${step >= num ? 'text-[#d4af37]' : 'text-white/30'}`}>{label}</span>
                  </div>
                  {i < 2 && <div className={`w-12 h-px mb-4 ${step > num ? 'bg-[#d4af37]' : 'bg-[#d4af37]/20'}`} />}
                </div>
              )
            })}
          </div>

          <div className="luxury-card p-8 md:p-10">
            {/* Step 1 */}
            {step === 1 && (
              <div>
                <h2 className="font-display text-2xl text-white mb-6">Contact Information</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-xs tracking-widest text-white/40 uppercase mb-2">First Name *</label>
                    <input name="firstName" value={form.firstName} onChange={handle} placeholder="First name" className="luxury-input w-full px-4 py-3 text-sm" required /></div>
                  <div><label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Last Name *</label>
                    <input name="lastName" value={form.lastName} onChange={handle} placeholder="Last name" className="luxury-input w-full px-4 py-3 text-sm" required /></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div><label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handle} placeholder="your@email.com" className="luxury-input w-full px-4 py-3 text-sm" required /></div>
                  <div><label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Phone *</label>
                    <input name="phone" type="tel" value={form.phone} onChange={handle} placeholder="(514) 000-0000" className="luxury-input w-full px-4 py-3 text-sm" required /></div>
                </div>
                <button onClick={next} className="btn-gold w-full py-4 text-sm tracking-widest font-semibold">Next: Event Details →</button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div>
                <h2 className="font-display text-2xl text-white mb-6">Event Details</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Package *</label>
                    <select name="package" value={form.package} onChange={handle} className="luxury-input w-full px-4 py-3 text-sm" required>
                      <option value="">Select package</option>
                      <option value="photobooth">Photobooth — $150/hr (2hr min)</option>
                      <option value="videobooth">360 Videobooth — $150/hr (2hr min)</option>
                      <option value="combo">Photo + Video Combo — $250/hr (3hr min)</option>
                    </select></div>
                  <div><label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Event Type *</label>
                    <select name="eventType" value={form.eventType} onChange={handle} className="luxury-input w-full px-4 py-3 text-sm" required>
                      <option value="">Select type</option>
                      {['Birthday', 'Baby Shower', 'Corporate', 'Wedding', 'Gala', 'Graduation', 'Anniversary', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Event Date *</label>
                    <input name="eventDate" type="date" value={form.eventDate} onChange={handle} className="luxury-input w-full px-4 py-3 text-sm" required /></div>
                  <div><label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Number of Hours</label>
                    <input name="hours" type="number" min="2" value={form.hours} onChange={handle} placeholder="e.g. 3" className="luxury-input w-full px-4 py-3 text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Start Time</label>
                    <input name="startTime" type="time" value={form.startTime} onChange={handle} className="luxury-input w-full px-4 py-3 text-sm" /></div>
                  <div><label className="block text-xs tracking-widest text-white/40 uppercase mb-2">End Time</label>
                    <input name="endTime" type="time" value={form.endTime} onChange={handle} className="luxury-input w-full px-4 py-3 text-sm" /></div>
                </div>
                <div className="mb-4"><label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Event Location *</label>
                  <input name="eventLocation" value={form.eventLocation} onChange={handle} placeholder="Venue name & address" className="luxury-input w-full px-4 py-3 text-sm" required /></div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Guests</label>
                    <input name="guestCount" type="number" value={form.guestCount} onChange={handle} placeholder="Approx. guests" className="luxury-input w-full px-4 py-3 text-sm" /></div>
                  <div><label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Indoor / Outdoor</label>
                    <select name="indoorOutdoor" value={form.indoorOutdoor} onChange={handle} className="luxury-input w-full px-4 py-3 text-sm">
                      <option value="">Select</option>
                      <option value="Indoor">Indoor</option>
                      <option value="Outdoor">Outdoor</option>
                      <option value="Both">Both</option>
                    </select></div>
                </div>
                <div className="mb-4"><label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Theme / Colors</label>
                  <input name="theme" value={form.theme} onChange={handle} placeholder="e.g. Black & Gold, Tropical..." className="luxury-input w-full px-4 py-3 text-sm" /></div>
                <div className="mb-6"><label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Additional Notes</label>
                  <textarea name="additionalInfo" value={form.additionalInfo} onChange={handle} rows={3} className="luxury-input w-full px-4 py-3 text-sm resize-none" placeholder="Anything else we should know..." /></div>

                {/* Promo code */}
                {form.package && (
                  <div className="mb-6 p-4 border border-[#d4af37]/20 bg-[#d4af37]/5">
                    <label className="block text-xs tracking-widest text-[#d4af37] uppercase mb-2">Promo Code</label>
                    <div className="flex gap-2">
                      <input value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} placeholder="Enter code" className="luxury-input flex-1 px-4 py-2 text-sm font-mono tracking-widest" />
                      <button onClick={applyPromo} disabled={promoLoading} className="btn-gold px-4 py-2 text-xs tracking-widest">Apply</button>
                    </div>
                    {promoMsg && <p className={`text-xs mt-2 ${promoMsg.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>{promoMsg}</p>}
                  </div>
                )}

                {/* Price preview */}
                {pricing && form.package && (
                  <div className="mb-6 p-4 border border-[#d4af37]/20 bg-[#d4af37]/5 text-sm">
                    <p className="text-[#d4af37] text-xs tracking-widest uppercase mb-3">Estimate</p>
                    {[
                      ['Subtotal', `$${pricing.subtotal.toFixed(2)}`],
                      promoDiscount > 0 ? ['Discount', `-$${promoDiscount.toFixed(2)}`] : null,
                      ['Tax (15%)', `$${pricing.tax.toFixed(2)}`],
                    ].filter(Boolean).map((r: any) => (
                      <div key={r[0]} className="flex justify-between text-white/60 mb-1"><span>{r[0]}</span><span>{r[1]}</span></div>
                    ))}
                    <div className="flex justify-between border-t border-[#d4af37]/20 pt-2 mt-2">
                      <span className="text-white font-semibold">Total</span><span className="text-[#d4af37] font-bold">${pricing.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-white/40 text-xs">Deposit due now (50%)</span>
                      <span className="text-[#d4af37] text-xs font-semibold">${pricing.deposit.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="px-6 py-4 border border-[#d4af37]/30 text-[#d4af37] text-sm hover:bg-[#d4af37]/10 transition-all">← Back</button>
                  <button onClick={next} className="btn-gold flex-1 py-4 text-sm tracking-widest font-semibold">Review & Pay →</button>
                </div>
              </div>
            )}

            {/* Step 3 — Review */}
            {step === 3 && (
              <form onSubmit={submit}>
                <h2 className="font-display text-2xl text-white mb-6">Review & Pay Deposit</h2>
                <div className="p-4 bg-[#d4af37]/8 border border-[#d4af37]/25 mb-6">
                  <p className="text-[#d4af37] text-xs tracking-widest uppercase mb-1">Secure Checkout</p>
                  <p className="text-white/60 text-sm">You'll be redirected to Stripe to pay the 50% deposit. Your booking is confirmed upon successful payment.</p>
                </div>
                <div className="grid grid-cols-2 gap-y-3 text-sm mb-6">
                  {[
                    ['Name', `${form.firstName} ${form.lastName}`],
                    ['Email', form.email],
                    ['Package', form.package],
                    ['Event Date', form.eventDate],
                    ['Event Type', form.eventType],
                    ['Location', form.eventLocation],
                    ['Hours', form.hours || 'TBD'],
                  ].map(([k, v]) => (
                    <div key={k} className="contents">
                      <span className="text-white/30 text-xs uppercase tracking-widest py-2">{k}</span>
                      <span className="text-white/80 py-2 border-b border-[#d4af37]/10">{v}</span>
                    </div>
                  ))}
                </div>
                {pricing && (
                  <div className="p-4 border border-[#d4af37]/30 bg-[#d4af37]/8 mb-6">
                    <div className="flex justify-between text-white/60 mb-1 text-sm"><span>Total</span><span className="text-[#d4af37] font-bold">${pricing.total.toFixed(2)} CAD</span></div>
                    <div className="flex justify-between text-white/60 text-sm"><span>Deposit to pay now</span><span className="text-[#d4af37] font-bold text-lg">${pricing.deposit.toFixed(2)} CAD</span></div>
                  </div>
                )}
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(2)} className="px-6 py-4 border border-[#d4af37]/30 text-[#d4af37] text-sm hover:bg-[#d4af37]/10 transition-all">← Edit</button>
                  <button type="submit" disabled={loading} className="btn-gold flex-1 py-4 text-sm tracking-widest font-semibold disabled:opacity-60">
                    {loading ? 'Redirecting to Stripe...' : '💳 Pay Deposit & Confirm'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Trust badges */}
          {step < 3 && (
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[['50% Deposit', 'Via Stripe'], ['24hr Response', 'Guaranteed'], ['Secure', 'SSL + Stripe']].map(([a, b]) => (
                <div key={a} className="border border-[#d4af37]/20 p-4 text-center">
                  <p className="text-[#d4af37] text-xs font-semibold mb-0.5">{a}</p>
                  <p className="text-white/30 text-xs">{b}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
