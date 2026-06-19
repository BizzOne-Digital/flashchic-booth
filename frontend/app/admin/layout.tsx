'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '◈' },
  { href: '/admin/bookings', label: 'Bookings', icon: '📅' },
  { href: '/admin/leads', label: 'Leads', icon: '📋' },
  { href: '/admin/gallery', label: 'Gallery', icon: '🖼' },
  { href: '/admin/pricing', label: 'Pricing', icon: '💰' },
  { href: '/admin/addons', label: 'Add-Ons', icon: '✦' },
  { href: '/admin/promotions', label: 'Promotions', icon: '🎟' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { admin, loading, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (!loading && !admin && !isLoginPage) {
      router.push('/admin/login')
    }
  }, [admin, loading, isLoginPage, router])

  // Login page — render without sidebar
  if (isLoginPage) {
    return <>{children}</>
  }

  // Still checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#d4af37] text-sm tracking-widest animate-pulse">Loading...</div>
      </div>
    )
  }

  // Not logged in
  if (!admin) return null

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside className="w-60 bg-[#080808] border-r border-[#d4af37]/15 flex flex-col fixed top-0 left-0 h-full z-30">
        {/* Logo */}
        <div className="p-6 border-b border-[#d4af37]/15">
          <Link href="/admin/dashboard">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-[#d4af37]/50 flex items-center justify-center">
                <span className="text-[#d4af37] text-xs font-bold">FC</span>
              </div>
              <div>
                <p className="text-xs tracking-widest text-[#d4af37] uppercase font-semibold">Flashchic</p>
                <p className="text-[10px] text-white/30 tracking-widest">Admin Panel</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-all border-l-2 ${
                  isActive
                    ? 'bg-[#d4af37]/12 border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="tracking-wide">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-[#d4af37]/15">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] text-xs font-bold">
              {admin.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{admin.name}</p>
              <p className="text-white/30 text-[10px] truncate">{admin.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 text-center text-[10px] tracking-widest text-white/40 hover:text-white border border-white/10 hover:border-white/30 py-2 transition-all"
            >
              View Site
            </Link>
            <button
              onClick={logout}
              className="flex-1 text-[10px] tracking-widest text-red-400/70 hover:text-red-400 border border-red-400/20 hover:border-red-400/40 py-2 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-60 min-h-screen">
        {/* Top bar */}
        <div className="bg-[#080808] border-b border-[#d4af37]/15 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-white/70 text-sm tracking-widest capitalize">
            {navItems.find(i => pathname.startsWith(i.href))?.label || 'Admin'}
          </h1>
          <a href="tel:5148318409" className="text-[#d4af37] text-xs tracking-widest">
            (514) 831-8409
          </a>
        </div>
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}