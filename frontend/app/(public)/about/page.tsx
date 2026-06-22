import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'About Us | Flashchic Photobooth – Laval, Québec',
  description: 'Learn about Flashchic Photobooth, founded by Stéphanie Lebrun in Laval, Québec.',
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1800&q=80" alt="About Flashchic" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#0a0a0a]/80" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="font-display text-xs tracking-[0.4em] text-[#d4af37] uppercase mb-4">Our Story</p>
          <h1 className="font-display text-5xl md:text-7xl font-light text-white mb-6">
            About <span className="gold-text font-semibold">Flashchic</span>
          </h1>
          <div className="gold-divider mb-6" />
          <p className="text-white/60 text-lg font-light max-w-2xl mx-auto">
            Passionate about capturing joy, luxury, and unforgettable moments at every event.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="relative h-[550px] overflow-hidden">
              <Image
                src="/founder.jpeg"
                alt="Stéphanie Lebrun – Flashchic founder"
                fill className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/50 to-transparent" />
            </div>
            <div className="absolute -top-4 -left-4 w-20 h-20 border-l border-t border-[#d4af37]/50" />
            <div className="absolute -bottom-4 -right-4 w-20 h-20 border-r border-b border-[#d4af37]/50" />

          </div>

          <div>
            <p className="font-display text-xs tracking-[0.4em] text-[#d4af37] uppercase mb-4">Meet the Founder</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-8 leading-tight">
              Stéphanie <span className="gold-text font-semibold">Lebrun</span>
            </h2>
            <div className="space-y-5 text-white/60 font-light leading-relaxed">
              <p>
                Flashchic Photobooth was founded with a single vision: to bring a truly luxurious, magazine-worthy experience to every event in Laval, Montréal, and beyond.
              </p>
              <p>
                We believe every celebration deserves more than just a memory — it deserves a moment that your guests will talk about for years. That&apos;s why we invest in the best equipment, the most stunning setups, and an experience that&apos;s seamlessly professional from setup to teardown.
              </p>
              <p>
                From intimate baby showers to high-energy corporate galas, we bring the same level of dedication and luxury to every booking.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-4">
              <a
                href="https://instagram.com/flashchicphotobooth"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#d4af37] text-sm hover:text-white transition-colors border-b border-[#d4af37]/40 pb-px"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
                @flashchicphotobooth
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-6 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-display text-xs tracking-[0.4em] text-[#d4af37] uppercase mb-4">Why Choose Us</p>
            <h2 className="font-display text-4xl font-light text-white mb-4">
              The Flashchic <span className="gold-text font-semibold">Difference</span>
            </h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Professional Equipment',
                desc: 'Top-of-the-line cameras, lighting, and stage equipment for cinematic quality every time.',
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 7 16 12 23 17V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>
                  </svg>
                ),
              },
              {
                title: 'Instant Sharing',
                desc: 'Guests receive their photos and videos instantly at the event via our sharing system.',
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                ),
              },
              {
                title: 'Certified Operator',
                desc: 'Every booking includes a qualified, professional booth operator — no hiccups on your day.',
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>
                  </svg>
                ),
              },
              {
                title: 'Fully Customizable',
                desc: 'Custom overlays, song choice, backdrop colors and props tailored to your event theme.',
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
                  </svg>
                ),
              },
              {
                title: 'Stress-Free Setup',
                desc: 'We arrive 60 minutes early and handle complete setup and teardown — you just enjoy.',
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                ),
              },
              {
                title: 'Local & Trusted',
                desc: 'Proudly based in Laval, serving greater Montréal with a reputation built on exceptional service.',
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.title} className="luxury-card p-8">
                <div className="mb-5">{item.icon}</div>
                <h3 className="font-display text-xl text-white mb-3">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events we serve */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-display text-xs tracking-[0.4em] text-[#d4af37] uppercase mb-4">Perfect For</p>
            <h2 className="font-display text-4xl font-light text-white mb-4">Every <span className="gold-text font-semibold">Occasion</span></h2>
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
                <div className="absolute inset-0 bg-[#0a0a0a]/50 group-hover:bg-[#0a0a0a]/20 transition-colors duration-300" />
                <div className="absolute inset-0 border border-[#d4af37]/0 group-hover:border-[#d4af37]/40 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-end p-3">
                  <span className="font-display text-white text-sm tracking-widest">{event.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#0a0a0a] text-center border-t border-[#d4af37]/10">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-4xl font-light text-white mb-4">
            Ready to Create <span className="gold-text font-semibold">Memories?</span>
          </h2>
          <p className="text-white/50 mb-10 font-light">Book your luxury booth experience today.</p>
          <Link href="/booking" className="btn-gold px-12 py-4 text-sm tracking-widest font-semibold inline-block">
            Book Now
          </Link>
        </div>
      </section>
    </>
  )
}