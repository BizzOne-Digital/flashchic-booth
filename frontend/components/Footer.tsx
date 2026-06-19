import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-[#d4af37]/15">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Link href="/">
                <Image
                  src="/logo1.png"
                  alt="Flashchic Logo"
                  width={220}
                  height={80}
                  className="h-16 w-auto object-contain"
                />
              </Link>
            </div>

            <p className="text-white/50 text-sm leading-relaxed max-w-sm font-light">
              Luxury photobooth & 360 video booth experiences for your most memorable events. Based in Laval, serving Montréal and surrounding areas.
            </p>

            {/* Social */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://instagram.com/flashchicphotobooth"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-[#d4af37]/30 flex items-center justify-center hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-300"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="#d4af37" stroke="none" />
                </svg>
              </a>

              <a
                href="https://www.tiktok.com/@flashchicphotobooth"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-[#d4af37]/30 flex items-center justify-center hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-300"
                aria-label="TikTok"
              >
                <svg width="16" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-xs tracking-[0.25em] text-[#d4af37] uppercase mb-6">
              Navigation
            </h3>

            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/services', label: 'Services' },
                { href: '/pricing', label: 'Pricing' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/booking', label: 'Book Now' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 text-sm hover:text-[#d4af37] transition-colors duration-300 tracking-wide"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-xs tracking-[0.25em] text-[#d4af37] uppercase mb-6">
              Get In Touch
            </h3>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.09 12 19.79 19.79 0 0 1 1 3.18 2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.29 6.29l.87-.87a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>

                <a
                  href="tel:5148318409"
                  className="text-white/50 text-sm hover:text-[#d4af37] transition-colors"
                >
                  (514) 831-8409
                </a>
              </li>

              <li className="flex items-start gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>

                <a
                  href="mailto:flashchic84@gmail.com"
                  className="text-white/50 text-sm hover:text-[#d4af37] transition-colors break-all"
                >
                  flashchic84@gmail.com
                </a>
              </li>

              <li className="flex items-start gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>

                <span className="text-white/50 text-sm">
                  Laval, Québec
                  <br />
                  Serving Montréal & area
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#d4af37]/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs tracking-widest">
            © {new Date().getFullYear()} Flashchic Photobooth. All rights reserved.
          </p>

          <div className="flex items-center gap-1">
            <span className="text-white/20 text-xs">Laval, Québec</span>
            <span className="text-[#d4af37]/40 mx-2">·</span>
            <span className="text-white/20 text-xs">@flashchicphotobooth</span>
          </div>
        </div>
      </div>
    </footer>
  )
}