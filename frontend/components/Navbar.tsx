'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0a0a0a]/95 backdrop-blur-md py-3 shadow-[0_2px_20px_rgba(0,0,0,0.5)]'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo1.png"
              alt="Flashchic Logo"
              width={220}
              height={70}
              priority
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`nav-link font-sans text-xs tracking-[0.15em] uppercase transition-colors duration-300 ${
                    pathname === link.href
                      ? 'text-[#d4af37] active'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link
              href="/booking"
              className="btn-gold px-6 py-2.5 text-xs tracking-[0.15em] rounded-none font-semibold"
            >
              Book Now
            </Link>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-px bg-[#d4af37] transition-all duration-300 ${
                menuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-6 h-px bg-[#d4af37] transition-all duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-px bg-[#d4af37] transition-all duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#0a0a0a]/98 backdrop-blur-lg transition-all duration-500 lg:hidden flex flex-col justify-center items-center ${
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <ul className="flex flex-col items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`font-display text-2xl tracking-widest uppercase transition-colors duration-300 ${
                  pathname === link.href
                    ? 'gold-text'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}

          <li className="mt-4">
            <Link
              href="/booking"
              className="btn-gold px-8 py-3 text-sm tracking-widest rounded-none"
            >
              Book Now
            </Link>
          </li>
        </ul>

        {/* Contact Info */}
        <div className="absolute bottom-12 text-center">
          <a
            href="tel:5148318409"
            className="block text-[#d4af37] text-sm tracking-widest mb-2"
          >
            (514) 831-8409
          </a>
          <p className="text-white/40 text-xs tracking-widest">
            Laval, Québec
          </p>
        </div>
      </div>
    </>
  )
}