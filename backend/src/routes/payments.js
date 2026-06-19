const express = require('express')
const r = express.Router()
const { createDepositSession, createBalanceSession, stripeWebhook, getPaymentLink } = require('../controllers/payments')
const { protect, adminOnly } = require('../middleware/auth')

r.post('/webhook', stripeWebhook)                                        // public (Stripe raw body)
r.post('/deposit/:bookingId', createDepositSession)                       // public (client pays)
r.post('/balance/:bookingId', createBalanceSession)                       // public (client pays)
r.get('/link/:bookingId/:type', protect, adminOnly, getPaymentLink)       // admin sends link

module.exports = r
