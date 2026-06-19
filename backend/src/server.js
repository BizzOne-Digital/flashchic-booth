const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const connectDB = require('./config/db')

const authRoutes     = require('./routes/auth')
const bookingRoutes  = require('./routes/bookings')
const galleryRoutes  = require('./routes/gallery')
const pricingRoutes  = require('./routes/pricing')
const leadRoutes     = require('./routes/leads')
const promoRoutes    = require('./routes/promotions')
const paymentRoutes  = require('./routes/payments')
const addonRoutes    = require('./routes/addons')
const contactRoutes  = require('./routes/contact')
const dashboardRoutes = require('./routes/dashboard')

const app = express()

// Connect DB
connectDB()

// Security
app.use(helmet({ crossOriginResourcePolicy: false }))

// Raw body for Stripe webhooks
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))

// Body parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// CORS — allow all Vercel domains + localhost
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow no-origin requests (Postman, mobile) and vercel.app domains
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    if (origin.endsWith('.vercel.app')) return callback(null, true)
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Preflight
app.options('*', cors())

// Logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 })
app.use('/api/', limiter)

// Routes
app.use('/api/auth',      authRoutes)
app.use('/api/bookings',  bookingRoutes)
app.use('/api/gallery',   galleryRoutes)
app.use('/api/pricing',   pricingRoutes)
app.use('/api/leads',     leadRoutes)
app.use('/api/promotions', promoRoutes)
app.use('/api/payments',  paymentRoutes)
app.use('/api/contact',   contactRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/addons',    addonRoutes)

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', env: process.env.NODE_ENV, time: new Date() }))

// 404
app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Route not found' }))

// Error handler
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

// Vercel export
module.exports = app
