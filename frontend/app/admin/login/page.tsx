'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'

export default function AdminLogin() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 border border-[#d4af37]/50 flex items-center justify-center mx-auto mb-4">
            <span className="text-[#d4af37] text-xl font-semibold">FC</span>
          </div>
          <h1 className="font-display text-2xl text-white tracking-widest mb-1">Flashchic</h1>
          <p className="text-white/30 text-xs tracking-widest uppercase">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111] border border-[#d4af37]/25 p-8">
          <h2 className="text-white text-sm tracking-widest uppercase mb-6 text-center">Sign In</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@email.com"
              className="admin-input"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs tracking-widest text-white/40 uppercase mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="admin-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-3 text-xs tracking-widest disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-6 tracking-wider">
          Flashchic Photobooth Admin · Laval, QC
        </p>
      </div>
    </div>
  )
}
