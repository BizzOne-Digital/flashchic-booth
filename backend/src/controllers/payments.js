const asyncHandler = require('express-async-handler')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Booking = require('../models/Booking')

// @desc  Create Stripe checkout session for deposit (50%)
// @route POST /api/payments/deposit/:bookingId
const createDepositSession = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId)
  if (!booking) { res.status(404); throw new Error('Booking not found') }
  if (booking.depositPaid) { res.status(400); throw new Error('Deposit already paid') }

  const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000'

  const pkgNames = { photobooth: 'Photobooth', videobooth: '360 Videobooth', combo: 'Photo + Video Combo' }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: booking.email,
    metadata: { bookingId: booking._id.toString(), type: 'deposit' },
    line_items: [{
      price_data: {
        currency: 'cad',
        product_data: {
          name: `Flashchic Photobooth — ${pkgNames[booking.package] || booking.package}`,
          description: `50% Booking Deposit | Event: ${booking.eventDate} | ${booking.eventLocation}`,
        },
        unit_amount: Math.round(booking.depositAmount * 100), // in cents
      },
      quantity: 1,
    }],
    success_url: `${FRONTEND}/booking/success?session_id={CHECKOUT_SESSION_ID}&booking=${booking._id}`,
    cancel_url: `${FRONTEND}/booking/cancel?booking=${booking._id}`,
  })

  // Save session ID
  booking.stripeDepositSessionId = session.id
  await booking.save()

  res.json({ success: true, url: session.url, sessionId: session.id })
})

// @desc  Create Stripe checkout session for remaining balance
// @route POST /api/payments/balance/:bookingId
const createBalanceSession = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId)
  if (!booking) { res.status(404); throw new Error('Booking not found') }
  if (!booking.depositPaid) { res.status(400); throw new Error('Deposit must be paid first') }
  if (booking.balancePaid) { res.status(400); throw new Error('Balance already paid') }

  const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000'
  const balanceAmount = booking.total - booking.depositAmount

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: booking.email,
    metadata: { bookingId: booking._id.toString(), type: 'balance' },
    line_items: [{
      price_data: {
        currency: 'cad',
        product_data: {
          name: `Flashchic Photobooth — Remaining Balance`,
          description: `Remaining 50% balance for event on ${booking.eventDate}`,
        },
        unit_amount: Math.round(balanceAmount * 100),
      },
      quantity: 1,
    }],
    success_url: `${FRONTEND}/booking/success?session_id={CHECKOUT_SESSION_ID}&booking=${booking._id}&type=balance`,
    cancel_url: `${FRONTEND}/booking/cancel?booking=${booking._id}`,
  })

  booking.stripeBalanceSessionId = session.id
  await booking.save()

  res.json({ success: true, url: session.url, sessionId: session.id })
})

// @desc  Stripe webhook handler
// @route POST /api/payments/webhook
const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook error:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { bookingId, type } = session.metadata

    const booking = await Booking.findById(bookingId)
    if (!booking) return res.json({ received: true })

    if (type === 'deposit') {
      booking.depositPaid = true
      booking.stripeDepositPaymentId = session.payment_intent
      booking.status = 'deposit_paid'
    } else if (type === 'balance') {
      booking.balancePaid = true
      booking.stripeBalancePaymentId = session.payment_intent
      booking.status = 'paid'
    }
    await booking.save()

    // Send payment confirmation email
    try {
      const { sendPaymentConfirmation } = require('../utils/email')
      await sendPaymentConfirmation(booking, type)
    } catch (e) {
      console.error('Email error:', e.message)
    }
  }

  res.json({ received: true })
})

// @desc  Get payment link for booking (admin sends to client)
// @route GET /api/payments/link/:bookingId/:type
const getPaymentLink = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId)
  if (!booking) { res.status(404); throw new Error('Booking not found') }

  const { type } = req.params
  const sessionId = type === 'deposit' ? booking.stripeDepositSessionId : booking.stripeBalanceSessionId

  if (!sessionId) {
    // Create new session
    const createFn = type === 'deposit' ? createDepositSession : createBalanceSession
    req.params.bookingId = booking._id
    return createFn(req, res)
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId)
  res.json({ success: true, url: session.url })
})

module.exports = { createDepositSession, createBalanceSession, stripeWebhook, getPaymentLink }
