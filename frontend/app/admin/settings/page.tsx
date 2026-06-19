'use client'

import { useState } from 'react'
import { authApi, pricingApi } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

export default function AdminSettings() {
  const { admin } = useAuth()
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 4000) }

  const seedAdmin = async () => {
    setLoading('seed-admin')
    try {
      await authApi.seed()
      showToast('Admin account seeded successfully!')
    } catch (e: any) {
      showToast(e.response?.data?.message || 'Error seeding admin')
    } finally { setLoading('') }
  }

  const seedPricing = async () => {
    setLoading('seed-pricing')
    try {
      await pricingApi.seed()
      showToast('Default pricing packages seeded!')
    } catch (e: any) {
      showToast(e.response?.data?.message || 'Error seeding pricing')
    } finally { setLoading('') }
  }

  return (
    <div className="max-w-2xl">
      {toast && <div className="fixed bottom-6 right-6 z-50 bg-[#1a1a1a] border border-[#d4af37]/50 text-white px-5 py-3 text-sm">{toast}</div>}

      <h1 className="text-white text-xl font-semibold mb-8">Settings</h1>

      {/* Admin Info */}
      <div className="admin-card p-6 mb-6">
        <h2 className="text-[#d4af37] text-xs tracking-widest uppercase mb-4">Admin Account</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] text-lg font-bold">
              {admin?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-white font-semibold">{admin?.name}</p>
              <p className="text-white/50 text-sm">{admin?.email}</p>
              <span className="badge badge-confirmed capitalize">{admin?.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Env Checklist */}
      <div className="admin-card p-6 mb-6">
        <h2 className="text-[#d4af37] text-xs tracking-widest uppercase mb-4">Configuration Checklist</h2>
        <div className="space-y-3 text-sm">
          {[
            { label: 'MongoDB URI', key: 'MONGO_URI' },
            { label: 'JWT Secret', key: 'JWT_SECRET' },
            { label: 'Cloudinary Config', key: 'CLOUDINARY_CLOUD_NAME' },
            { label: 'Stripe Secret Key', key: 'STRIPE_SECRET_KEY' },
            { label: 'Stripe Webhook Secret', key: 'STRIPE_WEBHOOK_SECRET' },
            { label: 'Gmail / Email Config', key: 'EMAIL_FROM' },
          ].map(item => (
            <div key={item.key} className="flex items-center gap-3">
              <div className="w-4 h-4 border border-[#d4af37]/40 flex items-center justify-center">
                <span className="text-[#d4af37] text-[10px]">✓</span>
              </div>
              <span className="text-white/70">{item.label}</span>
              <span className="text-white/30 text-xs font-mono ml-auto">.env → {item.key}</span>
            </div>
          ))}
        </div>
      </div>

      {/* One-time Setup */}
      <div className="admin-card p-6 mb-6">
        <h2 className="text-[#d4af37] text-xs tracking-widest uppercase mb-2">One-time Setup</h2>
        <p className="text-white/40 text-xs mb-4">Run these once to initialize your database with defaults.</p>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={seedPricing}
            disabled={!!loading}
            className="btn-gold px-5 py-2 text-xs tracking-widest disabled:opacity-50"
          >
            {loading === 'seed-pricing' ? 'Seeding...' : 'Seed Default Pricing'}
          </button>
          <button
            onClick={seedAdmin}
            disabled={!!loading}
            className="border border-[#d4af37]/40 text-[#d4af37] px-5 py-2 text-xs hover:bg-[#d4af37]/10 transition-all"
          >
            {loading === 'seed-admin' ? 'Seeding...' : 'Re-seed Admin Account'}
          </button>
        </div>
      </div>

      {/* Business Info */}
      <div className="admin-card p-6">
        <h2 className="text-[#d4af37] text-xs tracking-widest uppercase mb-4">Business Info</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            ['Business', 'Flashchic Photobooth'],
            ['Owner', 'Stéphanie Lebrun'],
            ['Phone', '(514) 831-8409'],
            ['Email', 'flashchic84@gmail.com'],
            ['Location', 'Laval, Québec'],
            ['Instagram', '@flashchicphotobooth'],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-white/30 text-xs uppercase tracking-widest">{k}</p>
              <p className="text-white/70">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
