import Link from 'next/link'
import Image from 'next/image'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

async function getPricing() {
  try {
    const res = await fetch(`${API}/pricing`, { cache: 'no-store' })
    const data = await res.json()
    return data.data || []
  } catch { return [] }
}

async function getAddons() {
  try {
    const res = await fetch(`${API}/addons`, { cache: 'no-store' })
    const data = await res.json()
    return data.data || []
  } catch { return [] }
}

async function getGallery() {
  try {
    const res = await fetch(`${API}/gallery?featured=true`, { cache: 'no-store' })
    const data = await res.json()
    return (data.data || []).slice(0, 6)
  } catch { return [] }
}



const FALLBACK_PKGS = [
  { _id: '1', slug: 'photobooth', name: 'Photobooth', price: 150, unit: '/hr', minimum: 2, featured: false,
    tagline: 'Timeless Photos, Instant Joy', description: 'Classic photobooth with backdrop, custom overlay, and unlimited HD captures.',
    features: ['Custom overlay & backdrop', 'Unlimited HD photos', 'Instant sharing', 'Fun props included', 'Qualified operator'] },
  { _id: '2', slug: 'videobooth', name: '360 Videobooth', price: 150, unit: '/hr', minimum: 2, featured: false,
    tagline: 'Cinematic 360° Slow Motion', description: '42" rotating stage with HD slow-motion 360° video and instant sharing.',
    features: ['42" rotating video stage', 'HD slow-motion video', 'RGB video lighting', 'Custom overlay & song', 'Unlimited captures'] },
  { _id: '3', slug: 'combo', name: 'Photo + Video Combo', price: 250, unit: '/hr', minimum: 3, featured: true,
    tagline: 'The Complete Luxury Experience', description: 'Both photobooth and 360 video booth for the ultimate event experience.',
    features: ['Everything in Photobooth', 'Everything in 360 Videobooth', 'Premium backdrop', 'Full operator team'] },
]

export default async function HomePage() {
  const [packages, gallery, addons] = await Promise.all([getPricing(), getGallery(), getAddons()])
  const pkgs = packages.length > 0 ? packages : FALLBACK_PKGS

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Desktop image */}
          <Image src="/herobg.png" alt="Luxury event photobooth" fill className="object-cover hidden sm:block" priority />
          {/* Mobile image */}
          <Image src="/heromobile.png" alt="Luxury event photobooth" fill className="object-cover block sm:hidden" priority />
          <div className="absolute inset-0 hero-overlay" />
          <div className="absolute inset-0 bg-[#0a0a0a]/40" />
        </div>
        <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent" />
          <div className="absolute bottom-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/15 to-transparent" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <p className="font-display text-xs tracking-[0.4em] text-[#d4af37] uppercase mb-6">Laval, Québec · Premium Booth Experiences</p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[1.05] mb-6 text-white">
            Capture Your<span className="block gold-text font-semibold">Finest Moments</span>
          </h1>
          <div className="gold-divider mb-8" />
          <p className="font-sans font-light text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            Luxury photobooth & 360 video booth rental for birthdays, corporate events, weddings, and every occasion worth celebrating.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/booking" className="btn-gold px-10 py-4 text-sm tracking-[0.2em] font-semibold w-full sm:w-auto text-center">Reserve Your Date</Link>
            <Link href="/services" className="px-10 py-4 text-sm tracking-[0.2em] border border-white/30 hover:border-[#d4af37] text-white hover:text-[#d4af37] transition-all duration-300 w-full sm:w-auto text-center font-sans">Explore Services</Link>
          </div>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase font-sans">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#d4af37]/60 to-transparent" />
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#111111] border-y border-[#d4af37]/15 py-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[['360°','Video Booth'],['2h','Min. Rental'],['HD','Slow Motion'],['∞','Captures']].map(([n,l]) => (
              <div key={l} className="text-center">
                <div className="font-display text-3xl font-semibold gold-text mb-1">{n}</div>
                <div className="font-sans text-xs tracking-[0.2em] text-white/40 uppercase">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* SERVICES — Dynamic */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-display text-xs tracking-[0.4em] text-[#d4af37] uppercase mb-4">What We Offer</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-4">Our <span className="gold-text font-semibold">Services</span></h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pkgs.map((pkg: any) => {
              const img = pkg.image || 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80'
              return (
                <div key={pkg._id} className="luxury-card group overflow-hidden relative flex flex-col">
                  {pkg.featured && (
                    <div className="absolute top-4 right-4 z-20 bg-[#d4af37] text-[#0a0a0a] text-[10px] tracking-widest uppercase px-3 py-1 font-semibold">Best Value</div>
                  )}
                  <div className="relative h-52 overflow-hidden">
                    <Image src={img} alt={pkg.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111]/80 to-transparent" />
                    <div className="absolute bottom-4 left-6">
                      <span className="font-display text-2xl text-white">{pkg.name}</span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">

                    <p className="text-white/60 text-sm leading-relaxed mb-5 font-light">{pkg.tagline || pkg.description}</p>
                    <ul className="space-y-2 mb-6 flex-1">
                      {(pkg.features || []).slice(0, 5).map((feat: string) => (
                        <li key={feat} className="flex items-center gap-2 text-sm text-white/70">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                          {feat}
                        </li>
                      ))}
                    </ul>
                    <Link href="/booking" className="block w-full text-center btn-gold py-3 text-xs tracking-widest font-semibold mt-auto">Book This</Link>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="text-center mt-12">
            <Link href="/services" className="text-[#d4af37] text-sm tracking-widest hover:text-white transition-colors border-b border-[#d4af37]/40 pb-px">View All Services & Details →</Link>
          </div>
        </div>
      </section>

      {/* ABOUT STRIP */}
      <section className="py-24 px-6 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="relative h-[500px] overflow-hidden">
              <Image src="/newimg2.png" alt="Flashchic setup" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/60 to-transparent" />
            </div>
            <div className="absolute -top-4 -left-4 w-24 h-24 border-l border-t border-[#d4af37]/50" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r border-b border-[#d4af37]/50" />

          </div>
          <div>
            <p className="font-display text-xs tracking-[0.4em] text-[#d4af37] uppercase mb-4">Our Story</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
              Where <span className="gold-text font-semibold">Luxury</span><br />Meets Memory
            </h2>
            <div className="w-16 h-px mb-8" style={{ background: 'linear-gradient(90deg, #d4af37, transparent)' }} />
            <p className="text-white/60 leading-relaxed mb-6 font-light">
              Flashchic Photobooth was born from a passion for creating unforgettable moments. Founded by Stéphanie Lebrun, we bring professional-grade photobooth and 360 video experiences to events across Laval, Montréal, and beyond.
            </p>
            <p className="text-white/60 leading-relaxed mb-8 font-light">
              From intimate birthday celebrations to large corporate galas, our luxury setups, professional operators, and instant sharing technology ensure every guest leaves with a lasting memory.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-10">
              {[
                { icon: '★', label: 'Premium Quality', desc: 'HD slow-motion & professional lighting' },
                { icon: '⚡', label: 'Instant Access', desc: 'Share videos & photos right from the event' },
                { icon: '✦', label: 'Custom Experience', desc: 'Personalized overlays, songs & props' },
                { icon: '◈', label: 'Full Service', desc: 'Setup, operator & takedown included' },
              ].map((item) => (
                <div key={item.label} className="flex gap-3">
                  <span className="text-[#d4af37] text-lg mt-0.5 flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-white text-sm font-semibold mb-1">{item.label}</p>
                    <p className="text-white/45 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/about" className="btn-gold px-8 py-3 text-xs tracking-widest font-semibold inline-block">Our Full Story</Link>
          </div>
        </div>
      </section>

      {/* EVENTS GRID */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-display text-xs tracking-[0.4em] text-[#d4af37] uppercase mb-4">Perfect For</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-4">Every <span className="gold-text font-semibold">Occasion</span></h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
             { label: 'Birthdays', img: 'https://images.unsplash.com/photo-1544155892-b2b6c64204fc?q=80' },
              { label: 'Baby Showers', img: 'https://images.unsplash.com/photo-1528218635780-5952720c9729?q=80' },
              { label: 'Corporate', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80' },
              { label: 'Weddings', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80' },
              { label: 'Galas', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80' },
              { label: 'Parties', img: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&q=80' },
            ].map((event) => (
              <div key={event.label} className="group relative overflow-hidden aspect-square">
                <Image src={event.img} alt={event.label} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-[#0a0a0a]/50 group-hover:bg-[#0a0a0a]/30 transition-colors duration-300" />
                <div className="absolute inset-0 border border-[#d4af37]/0 group-hover:border-[#d4af37]/40 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-end p-4">
                  <span className="font-display text-white text-sm tracking-widest">{event.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    {/* GALLERY — Dynamic from Admin */}
      {gallery.length > 0 && (
        <section className="py-24 px-6 bg-[#0d0d0d]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="font-display text-xs tracking-[0.4em] text-[#d4af37] uppercase mb-4">Our Work</p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-4">Recent <span className="gold-text font-semibold">Events</span></h2>
              <div className="gold-divider" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[200px] sm:auto-rows-[220px]">
              {gallery.map((item: any, i: number) => (
                <div
                  key={item._id}
                  className={`relative group overflow-hidden ${
                    i === 0 ? 'col-span-1 sm:col-span-2 row-span-1 sm:row-span-2' : ''
                  }`}
                >
                  {item.type === 'video'
                    ? <video src={item.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" muted autoPlay loop playsInline />
                    : <Image src={item.url} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  }
                  <div className="absolute inset-0 bg-[#0a0a0a]/30 group-hover:bg-[#0a0a0a]/10 transition-colors duration-300" />
                  <div className="absolute inset-0 border border-[#d4af37]/0 group-hover:border-[#d4af37]/30 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-display text-white text-sm tracking-wide">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/gallery" className="btn-gold px-8 py-3 text-xs tracking-widest font-semibold inline-block w-full sm:w-auto">
                View Full Gallery
              </Link>
            </div>
          </div>
        </section>
    
      )}
      {/* ADD-ONS & EXTRAS — Dynamic from Admin */}
      {addons.length > 0 && (
        <section className="py-24 px-6 bg-[#0a0a0a]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="font-display text-xs tracking-[0.4em] text-[#d4af37] uppercase mb-4">Elevate Your Experience</p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-4">
                Add-Ons & <span className="gold-text font-semibold">Extras</span>
              </h2>
              <div className="gold-divider mb-4" />
              <p className="text-white/50 text-sm font-light max-w-xl mx-auto">
                Customize your booth experience with our premium extras. Contact us to include any add-on with your booking.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {addons.map((addon: any) => (
                <div key={addon._id} className="luxury-card group overflow-hidden flex flex-col w-full sm:w-[280px]">
                  {addon.image ? (
                    <div className="relative h-40 overflow-hidden flex-shrink-0">
                      <Image src={addon.image} alt={addon.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111]/60 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-40 bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#d4af37]/30 text-3xl">✦</span>
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-display text-base text-white mb-1 leading-tight">{addon.name}</h3>
                    {addon.description && (
                      <p className="text-white/40 text-xs leading-relaxed">{addon.description}</p>
                    )}
                    {addon.tiers && addon.tiers.length > 0 && (
                      <ul className="mt-2 space-y-0.5">
                        {addon.tiers.map((tier: any, i: number) => (
                          <li key={i} className="text-white/40 text-xs flex items-center gap-1.5">
                            <span className="text-[#d4af37]/50">·</span>
                            {tier.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <p className="text-white/30 text-xs mb-5 tracking-wide">
                Add-ons are available upon request. Mention them when booking or contact us for details.
              </p>
              <Link href="/contact" className="border border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/10 transition-all py-3 px-8 text-xs tracking-widest font-sans inline-block">
                Inquire About Add-Ons
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA BANNER */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1800&q=80" alt="Book" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#0a0a0a]/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="font-display text-xs tracking-[0.4em] text-[#d4af37] uppercase mb-4">Ready to Book?</p>
          <h2 className="font-display text-4xl md:text-6xl font-light text-white mb-6 leading-tight">
            Make Your Event<br /><span className="gold-text font-semibold">Unforgettable</span>
          </h2>
          <p className="text-white/60 text-lg mb-10 font-light">Secure your date with a 50% deposit. Limited availability — book early.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking" className="btn-gold px-12 py-4 text-sm tracking-widest font-semibold">Reserve Now</Link>
            <a href="tel:5148318409" className="px-12 py-4 text-sm tracking-widest border border-white/30 hover:border-[#d4af37] text-white hover:text-[#d4af37] transition-all duration-300 font-sans">Call Us</a>
          </div>
        </div>
      </section>
    </>
  )
}