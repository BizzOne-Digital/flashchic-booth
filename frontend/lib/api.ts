import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('fc_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem('fc_token')
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(err)
  }
)

// ─── AUTH ─────────────────────────────────────────────────────────────────
export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  seed: () => api.post('/auth/seed'),
}

// ─── BOOKINGS ─────────────────────────────────────────────────────────────
export const bookingsApi = {
  create: (data: any) => api.post('/bookings', data),
  getAll: (params?: any) => api.get('/bookings', { params }),
  getOne: (id: string) => api.get(`/bookings/${id}`),
  update: (id: string, data: any) => api.put(`/bookings/${id}`, data),
  delete: (id: string) => api.delete(`/bookings/${id}`),
  validatePromo: (data: any) => api.post('/bookings/validate-promo', data),
}

// ─── GALLERY ──────────────────────────────────────────────────────────────
export const galleryApi = {
  getPublic: (params?: any) => api.get('/gallery', { params }),
  getAll: (params?: any) => api.get('/gallery', { params }),
  upload: (data: FormData) => api.post('/gallery', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: any) => api.put(`/gallery/${id}`, data),
  delete: (id: string) => api.delete(`/gallery/${id}`),
  reorder: (items: { id: string; order: number }[]) => api.put('/gallery/reorder', { items }),
}

// ─── PRICING ──────────────────────────────────────────────────────────────
export const pricingApi = {
  getPublic: () => api.get('/pricing'),
  getAll: () => api.get('/pricing/all'),
  create: (data: any) => api.post('/pricing', data),
  update: (id: string, data: any) => api.put(`/pricing/${id}`, data),
  delete: (id: string) => api.delete(`/pricing/${id}`),
  seed: () => api.post('/pricing/seed'),
}

// ─── LEADS ────────────────────────────────────────────────────────────────
export const leadsApi = {
  submit: (data: any) => api.post('/leads', data),
  getAll: (params?: any) => api.get('/leads', { params }),
  update: (id: string, data: any) => api.put(`/leads/${id}`, data),
  delete: (id: string) => api.delete(`/leads/${id}`),
}

// ─── PROMOTIONS ───────────────────────────────────────────────────────────
export const promosApi = {
  validate: (code: string) => api.post('/promotions/validate', { code }),
  getAll: () => api.get('/promotions'),
  create: (data: any) => api.post('/promotions', data),
  update: (id: string, data: any) => api.put(`/promotions/${id}`, data),
  delete: (id: string) => api.delete(`/promotions/${id}`),
}

// ─── PAYMENTS ─────────────────────────────────────────────────────────────
export const paymentsApi = {
  createDepositSession: (bookingId: string) => api.post(`/payments/deposit/${bookingId}`),
  createBalanceSession: (bookingId: string) => api.post(`/payments/balance/${bookingId}`),
  getPaymentLink: (bookingId: string, type: 'deposit' | 'balance') => api.get(`/payments/link/${bookingId}/${type}`),
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────
export const dashboardApi = {
  getStats: () => api.get('/dashboard'),
}

// ─── ADDONS ───────────────────────────────────────────────────────────────
export const addonsApi = {
  getPublic: () => api.get('/addons'),
  getAll:    () => api.get('/addons/all'),
  create:    (data: FormData) => api.post('/addons', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:    (id: string, data: FormData) => api.put(`/addons/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:    (id: string) => api.delete(`/addons/${id}`),
  seed:      () => api.post('/addons/seed'),
}