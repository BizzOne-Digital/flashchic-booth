'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { bookingsApi, promosApi } from '@/lib/api'

const RATES: Record<string, number> = { photobooth: 85, videobooth: 85, combo: 200 }
const MIN_HOURS: Record<string, number> = { photobooth: 2, videobooth: 2, combo: 3 }
const TAX = 0.15
const ETRANSFER_EMAIL = 'flashchic84@gmail.com'

const calc = (pkg: string, hours: number, discount = 0) => {
  const rate = RATES[pkg] || 85
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
  const [submitted, setSubmitted] = useState(false)
  const [bookingData, setBookingData] = useState<any>(null)
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
      const sub = (RATES[form.package] || 85) * Math.max(+form.hours || 0, MIN_HOURS[form.package] || 2)
      const discAmount = d.type === 'percent' ? +(sub * d.value / 100).toFixed(2) : d.value
      setPromoDiscount(discAmount)
      setPromoMsg(`✓ ${d.type === 'percent' ? d.value + '%' : '$' + d.value} off applied!`)
    } catch (e: any) {
      setPromoMsg('✗ ' + (e.response?.data?.message || 'Invalid code'))
      setPromoDiscount(0)
    } finally { setPromoLoading(false) }
  }

  const next = () => {
    if (step === 1 && (!form.firstName || !form.email || !form.phone)) {
      showToast('Please fill in all contact fields', 'error'); return
    }
    if (step === 2 && (!form.package || !form.eventDate || !form.eventLocation)) {
      showToast('Please fill in all event details', 'error'); return
    }
    setStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await bookingsApi.create({
        ...form,
        discountCode: promoCode || undefined,
        discountAmount: promoDiscount,
      })
      setBookingData({ ...res.data.data, pricing })
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e: any) {
      showToast(e.response?.data?.message || 'Submission failed. Please call (514) 831-8409', 'error')
    } finally { setLoading(false) }
  }

  // ── SUCCESS SCREEN ──────────────────────────────────────────────────────
  if (submitted && bookingData) {
    const depositAmt = bookingData.pricing?.deposit || bookingData.depositAmount
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-32 px-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="luxury-card p-10 md:p-14 text-center">
            {/* Checkmark */}
            <div className="w-20 h-20 border border-green-400/50 flex items-center justify-center mx-auto mb-8">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            </div>

            <h1 className="font-display text-3xl text-white mb-3">
              Booking <span className="gold-text font-semibold">Request Sent!</span>
            </h1>
            <p className="text-white/60 text-sm leading-relaxed mb-10">
              Thank you, <strong className="text-white">{bookingData.firstName}</strong>! Your booking request has been received. To confirm your date, please send the deposit via e-transfer.
            </p>

            {/* E-Transfer Instructions */}
            <div className="bg-[#d4af37]/8 border border-[#d4af37]/30 p-6 mb-8 text-left">
              <p className="font-display text-xs tracking-[0.3em] text-[#d4af37] uppercase mb-5 text-center">
                E-Transfer Instructions
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#d4af37] text-[#0a0a0a] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                  <div>
                    <p className="text-white text-sm font-semibold">Send the deposit amount</p>
                    <p className="text-[#d4af37] text-xl font-bold mt-1">
                      ${depositAmt?.toFixed(2)} CAD
                      <span className="text-white/40 text-xs font-normal ml-2">(50% deposit)</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#d4af37] text-[#0a0a0a] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <p className="text-white text-sm font-semibold">Send to this email</p>
                    <p className="text-[#d4af37] text-base font-semibold mt-1 font-mono">{ETRANSFER_EMAIL}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#d4af37] text-[#0a0a0a] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                  <div>
                    <p className="text-white text-sm font-semibold">Add your name in the message</p>
                    <p className="text-white/50 text-xs mt-1">
                      Write: <span className="text-white font-semibold">{bookingData.firstName} {bookingData.lastName} — {bookingData.eventDate}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="border border-[#d4af37]/15 p-5 mb-8 text-left text-sm">
              <p className="text-[#d4af37] text-xs tracking-widest uppercase mb-3">Your Booking Summary</p>
              <div className="space-y-1.5 text-white/60">
                <div className="flex justify-between"><span>Package</span><span className="text-white capitalize">{bookingData.package}</span></div>
                <div className="flex justify-between"><span>Event Date</span><span className="text-white">{bookingData.eventDate}</span></div>
                <div className="flex justify-between"><span>Location</span><span className="text-white">{bookingData.eventLocation}</span></div>
                <div className="flex justify-between border-t border-[#d4af37]/10 pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-[#d4af37] font-semibold">${bookingData.pricing?.total?.toFixed(2) || bookingData.total?.toFixed(2)} CAD</span>
                </div>
                <div className="flex justify-between">
                  <span>Deposit Due Now</span>
                  <span className="text-[#d4af37] font-bold">${depositAmt?.toFixed(2)} CAD</span>
                </div>
                <div className="flex justify-between">
                  <span>Balance Due</span>
                  <span className="text-white/50">15 days before event</span>
                </div>
              </div>
            </div>

            <p className="text-white/40 text-xs mb-8">
              Once your e-transfer is received, Stéphanie will confirm your booking within 24 hours at <span className="text-[#d4af37]">{bookingData.email}</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/" className="btn-gold px-8 py-3 text-xs tracking-widest font-semibold text-center">
                Back to Home
              </Link>
              <a
                href="https://instagram.com/flashchicphotobooth"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 text-xs tracking-widest border border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/10 transition-all text-center"
              >
                Follow Us
              </a>
            </div>
          </div>
        </div>
      </div>
    )
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
          <h1 className="font-display text-5xl md:text-6xl font-light text-white mb-4">
            Book <span className="gold-text font-semibold">Your Experience</span>
          </h1>
          <div className="gold-divider mb-4" />
          <p className="text-white/60 font-light">Fill in your details and we&apos;ll confirm within 24 hours.</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-[#0a0a0a]">
        <div className="max-w-2xl mx-auto">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-4 mb-10">
            {['Contact', 'Event', 'Review'].map((label, i) => {
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

            {/* STEP 1 — Contact */}
            {step === 1 && (
              <div>
                <h2 className="font-display text-2xl text-white mb-6">Contact Information</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs tracking-widest text-white/40 uppercase mb-2">First Name *</label>
                    <input name="firstName" value={form.firstName} onChange={handle} placeholder="First name" className="luxury-input w-full px-4 py-3 text-sm" required />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Last Name *</label>
                    <input name="lastName" value={form.lastName} onChange={handle} placeholder="Last name" className="luxury-input w-full px-4 py-3 text-sm" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handle} placeholder="your@email.com" className="luxury-input w-full px-4 py-3 text-sm" required />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Phone *</label>
                    <input name="phone" type="tel" value={form.phone} onChange={handle} placeholder="(514) 000-0000" className="luxury-input w-full px-4 py-3 text-sm" required />
                  </div>
                </div>
                <button onClick={next} className="btn-gold w-full py-4 text-sm tracking-widest font-semibold">
                  Next: Event Details →
                </button>
              </div>
            )}

            {/* STEP 2 — Event */}
            {step === 2 && (
              <div>
                <h2 className="font-display text-2xl text-white mb-6">Event Details</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Package *</label>
                    <select name="package" value={form.package} onChange={handle} className="luxury-input w-full px-4 py-3 text-sm" style={{colorScheme:'dark'}} required>
                      <option value="">Select package</option>
                      <option value="photobooth">Photobooth</option>
                      <option value="videobooth">360 Videobooth</option>
                      <option value="combo">Photo + Video Combo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Event Type *</label>
                    <select name="eventType" value={form.eventType} onChange={handle} className="luxury-input w-full px-4 py-3 text-sm" style={{colorScheme:'dark'}} required>
                      <option value="">Select type</option>
                      {['Birthday', 'Baby Shower', 'Corporate', 'Wedding', 'Gala', 'Graduation', 'Anniversary', 'Other'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Event Date *</label>
                    <input name="eventDate" type="date" value={form.eventDate} onChange={handle} className="luxury-input w-full px-4 py-3 text-sm" style={{colorScheme:'dark'}} required />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Number of Hours</label>
                    <input name="hours" type="number" min="2" value={form.hours} onChange={handle} placeholder="e.g. 3" className="luxury-input w-full px-4 py-3 text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Start Time</label>
                    <input name="startTime" type="time" value={form.startTime} onChange={handle} className="luxury-input w-full px-4 py-3 text-sm" style={{colorScheme:'dark'}} />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest text-white/40 uppercase mb-2">End Time</label>
                    <input name="endTime" type="time" value={form.endTime} onChange={handle} className="luxury-input w-full px-4 py-3 text-sm" style={{colorScheme:'dark'}} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Event Location *</label>
                  <input name="eventLocation" value={form.eventLocation} onChange={handle} placeholder="Venue name & address" className="luxury-input w-full px-4 py-3 text-sm" required />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Guests</label>
                    <input name="guestCount" type="number" value={form.guestCount} onChange={handle} placeholder="Approx. guests" className="luxury-input w-full px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Indoor / Outdoor</label>
                    <select name="indoorOutdoor" value={form.indoorOutdoor} onChange={handle} className="luxury-input w-full px-4 py-3 text-sm" style={{colorScheme:'dark'}}>
                      <option value="">Select</option>
                      <option value="Indoor">Indoor</option>
                      <option value="Outdoor">Outdoor</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Theme / Colors</label>
                  <input name="theme" value={form.theme} onChange={handle} placeholder="e.g. Black & Gold, Tropical..." className="luxury-input w-full px-4 py-3 text-sm" />
                </div>
                <div className="mb-5">
                  <label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Additional Notes</label>
                  <textarea name="additionalInfo" value={form.additionalInfo} onChange={handle} rows={3} className="luxury-input w-full px-4 py-3 text-sm resize-none" placeholder="Anything else we should know..." />
                </div>

                {/* Promo code */}
                {form.package && (
                  <div className="mb-5 p-4 border border-[#d4af37]/20 bg-[#d4af37]/5">
                    <label className="block text-xs tracking-widest text-[#d4af37] uppercase mb-2">Promo Code</label>
                    <div className="flex gap-2">
                      <input value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} placeholder="Enter code" className="luxury-input flex-1 px-4 py-2 text-sm font-mono tracking-widest" />
                      <button onClick={applyPromo} disabled={promoLoading} className="btn-gold px-4 py-2 text-xs tracking-widest">Apply</button>
                    </div>
                    {promoMsg && <p className={`text-xs mt-2 ${promoMsg.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>{promoMsg}</p>}
                  </div>
                )}

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="px-6 py-4 border border-[#d4af37]/30 text-[#d4af37] text-sm hover:bg-[#d4af37]/10 transition-all">
                    ← Back
                  </button>
                  <button onClick={next} className="btn-gold flex-1 py-4 text-sm tracking-widest font-semibold">
                    Review →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 — Review */}
            {step === 3 && (
              <form onSubmit={submit}>
                <h2 className="font-display text-2xl text-white mb-6">Review & Confirm</h2>

                {/* E-transfer notice */}
                <div className="p-4 bg-[#d4af37]/8 border border-[#d4af37]/25 mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                    <p className="text-[#d4af37] text-xs tracking-widest uppercase font-semibold">Payment via E-Transfer</p>
                  </div>
                  <p className="text-white/60 text-sm">After submitting, you will receive instructions to send a 50% deposit by e-transfer to confirm your date.</p>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-2 gap-y-3 text-sm mb-6">
                  {[
                    ['Name', `${form.firstName} ${form.lastName}`],
                    ['Email', form.email],
                    ['Phone', form.phone],
                    ['Package', form.package],
                    ['Event Date', form.eventDate],
                    ['Event Type', form.eventType],
                    ['Location', form.eventLocation],
                    ['Hours', form.hours || 'TBD'],
                  ].map(([k, v]) => (
                    <div key={k} className="contents">
                      <span className="text-white/30 text-xs uppercase tracking-widest py-2">{k}</span>
                      <span className="text-white/80 py-2 border-b border-[#d4af37]/10 capitalize">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(2)} className="px-6 py-4 border border-[#d4af37]/30 text-[#d4af37] text-sm hover:bg-[#d4af37]/10 transition-all">
                    ← Edit
                  </button>
                  <button type="submit" disabled={loading} className="btn-gold flex-1 py-4 text-sm tracking-widest font-semibold disabled:opacity-60">
                    {loading ? 'Submitting...' : 'Submit Booking Request'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Trust badges */}
          {step < 3 && (
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[['E-Transfer', 'Simple & secure'], ['24hr Response', 'Guaranteed'], ['50% Deposit', 'To confirm date']].map(([a, b]) => (
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