const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const connectDB = require('./config/db')

const authRoutes      = require('./routes/auth')
const bookingRoutes   = require('./routes/bookings')
const galleryRoutes   = require('./routes/gallery')
const pricingRoutes   = require('./routes/pricing')
const leadRoutes      = require('./routes/leads')
const promoRoutes     = require('./routes/promotions')
const paymentRoutes   = require('./routes/payments')
const addonRoutes     = require('./routes/addons')
const contactRoutes   = require('./routes/contact')
const dashboardRoutes = require('./routes/dashboard')

const app = express()

// Connect DB
connectDB()

// Security
app.use(helmet({ crossOriginResourcePolicy: false }))

// Raw body for Stripe webhooks — MUST be before express.json
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))

// Body parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ── CORS ──────────────────────────────────────────────────────────────────
// Allow all origins in production (Vercel generates dynamic preview URLs)
// Lock down with FRONTEND_URL if needed
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server, Postman, mobile apps (no origin)
    if (!origin) return callback(null, true)
    // Allow localhost dev
    if (origin.startsWith('http://localhost')) return callback(null, true)
    // Allow any vercel.app subdomain
    if (origin.endsWith('.vercel.app')) return callback(null, true)
    // Allow specific custom domain if set
    const frontendUrl = process.env.FRONTEND_URL
    if (frontendUrl && origin === frontendUrl) return callback(null, true)
    // Allow all in dev
    if (process.env.NODE_ENV !== 'production') return callback(null, true)
    // Block others in production
    callback(new Error(`CORS blocked: ${origin}`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}))

// Handle preflight for all routes
app.options('*', cors())

// Logging
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'))

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false })
app.use('/api/', limiter)

// ── Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes)
app.use('/api/bookings',   bookingRoutes)
app.use('/api/gallery',    galleryRoutes)
app.use('/api/pricing',    pricingRoutes)
app.use('/api/leads',      leadRoutes)
app.use('/api/promotions', promoRoutes)
app.use('/api/payments',   paymentRoutes)
app.use('/api/contact',    contactRoutes)
app.use('/api/dashboard',  dashboardRoutes)
app.use('/api/addons',     addonRoutes)

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', env: process.env.NODE_ENV, time: new Date().toISOString() }))

// Root ping — confirms backend is alive
app.get('/', (req, res) => res.json({ message: 'Flashchic API is running', version: '1.0.0' }))

// 404
app.use('*', (req, res) => res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` }))

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
  })
})

// Local dev server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => console.log(`🚀 Flashchic API running on port ${PORT}`))
}

module.exports = app