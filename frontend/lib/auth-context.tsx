'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'

interface Admin { id: string; name: string; email: string; role: string }
interface AuthCtx {
  admin: Admin | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthCtx>({
  admin: null,
  loading: true,
  login: async () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('fc_token')
    if (!token) {
      setLoading(false)
      return
    }
    authApi.me()
      .then(res => setAdmin(res.data.user))
      .catch(() => localStorage.removeItem('fc_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password })
    localStorage.setItem('fc_token', res.data.token)
    setAdmin(res.data.user)
    router.push('/admin/dashboard')
  }

  const logout = () => {
    localStorage.removeItem('fc_token')
    setAdmin(null)
    router.push('/admin/login')
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)