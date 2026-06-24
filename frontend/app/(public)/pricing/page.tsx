import Link from 'next/link'
import Image from 'next/image'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

async function getPricing() {
  try {
    const res = await fetch(`${API}/pricing`, { next: { revalidate: 300 } })
    const data = await res.json()
    return data.data || []
  } catch { return [] }
}

const FALLBACK = [
  { _id: '1', name: 'Photobooth', price: 150, unit: '/hr', minimum: 2, featured: false,
    features: ['Custom overlay & backdrop', 'Unlimited HD photos', 'Instant sharing', 'Fun props', 'Qualified operator', 'Delivery, setup & teardown'],
    notIncluded: ['360 video capability'] },
  { _id: '2', name: 'Photo + Video Combo', price: 250, unit: '/hr', minimum: 3, featured: true,
    features: ['Both photobooth & 360 videobooth', '42" rotating 360 stage', 'Custom overlays for both', 'HD slow-motion video', 'Instant sharing', 'Full operator team'],
    notIncluded: [] },
  { _id: '3', name: '360 Videobooth', price: 150, unit: '/hr', minimum: 2, featured: false,
    features: ['42" rotating video stage', 'HD slow-motion video', 'RGB video lighting', 'Custom overlay & song', 'Unlimited captures', 'Instant video sharing'],
    notIncluded: ['Traditional photo prints'] },
]

export default async function PricingPage() {
  const packages = await getPricing()
  const pkgs = packages.length > 0 ? packages : FALLBACK

  return (
    <>
      <section className="relative pt-40 pb-20 px-6">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#0a0a0a]/82" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="font-display text-xs tracking-[0.4em] text-[#d4af37] uppercase mb-4">Transparent Rates</p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-white mb-4">Simple <span className="gold-text font-semibold">Pricing</span></h1>
          <div className="gold-divider mb-4" />
          <p className="text-white/60 font-light">No hidden fees. Everything included.</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {pkgs.map((pkg: any) => (
              <div key={pkg._id} className={`relative flex flex-col p-8 ${pkg.featured ? 'pricing-featured' : 'luxury-card'}`}>
                {pkg.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#d4af37] text-[#0a0a0a] text-[10px] tracking-widest uppercase px-5 py-1.5 font-semibold whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <p className="font-display text-xs tracking-[0.3em] text-[#d4af37] uppercase mb-4">{pkg.name}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-display text-5xl font-light text-white">${pkg.price}</span>
                  <span className="text-white/40 text-sm">{pkg.unit || '/hr'}</span>
                </div>
                <p className="text-white/40 text-xs tracking-wider mb-2">{pkg.minimum}hr minimum</p>
                <p className="text-white/40 text-xs mb-6">Starting from <span className="text-[#d4af37] font-semibold">${pkg.price * (pkg.minimum || 2)}</span></p>
                <ul className="space-y-2 mb-6 flex-1">
                  {pkg.features?.map((f: string) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
                      {f}
                    </li>
                  ))}
                  {pkg.notIncluded?.map((f: string) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/25">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0"><path d="M18 6 6 18M6 6l12 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/booking" className={`block text-center py-4 text-xs tracking-[0.2em] font-semibold font-sans transition-all ${pkg.featured ? 'btn-gold' : 'border border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/10'}`}>
                  Book Now
                </Link>
              </div>
            ))}
          </div>

          {/* Additional fees */}
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-2xl font-light text-white text-center mb-8">Additional <span className="gold-text font-semibold">Fees</span></h2>
            <div className="space-y-3">
              {[
                { label: 'Travel — Montréal & Laval area', price: 'Free', note: 'No charge for local events' },
                { label: 'Travel — 200km+ outside Montréal', price: '$150', note: 'For events far from Montréal' },
                { label: 'Tax (TPS/TVQ)', price: '15%', note: 'Applied to total invoice' },
              ].map(fee => (
                <div key={fee.label} className="luxury-card p-5 flex items-center justify-between">
                  <div><p className="text-white text-sm font-semibold">{fee.label}</p><p className="text-white/40 text-xs">{fee.note}</p></div>
                  <span className="font-display text-xl gold-text flex-shrink-0">{fee.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment policy */}
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl font-light text-white text-center mb-8">Payment <span className="gold-text font-semibold">Policy</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Booking Deposit', desc: '50% paid online via Stripe to secure your date. Non-refundable.' },
                { title: 'Balance Due', desc: 'Remaining 50% due 15 days before your event.' },
                { title: 'Cancellation', desc: 'Within 30 days of event — no refund on service fee.' },
                { title: 'Date Changes', desc: "We'll accommodate changes subject to availability." },
              ].map(p => (
                <div key={p.title} className="luxury-card p-5">
                  <h3 className="font-display text-base text-white mb-2">{p.title}</h3>
                  <p className="text-white/50 text-sm font-light">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-[#0d0d0d] text-center border-t border-[#d4af37]/10">
        <h2 className="font-display text-4xl font-light text-white mb-4">Ready to <span className="gold-text font-semibold">Book?</span></h2>
        <p className="text-white/50 mb-10 font-light">Secure your date online with Stripe.</p>
        <Link href="/booking" className="btn-gold px-12 py-4 text-sm tracking-widest font-semibold inline-block">Reserve Your Date</Link>
      </section>
    </>
  )
}
