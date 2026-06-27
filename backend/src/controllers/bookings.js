const asyncHandler = require('express-async-handler')
const Booking = require('../models/Booking')
const { sendBookingNotification, sendBookingConfirmation } = require('../utils/email')

const MIN_HOURS = { photobooth: 2, videobooth: 2, combo: 3 }
const TAX_RATE = 0.15

// Calculate financials — uses rate from request (live DB price) or fallback
const calcPrice = (pkg, hours, hourlyRate, discountAmount = 0) => {
  const minH = MIN_HOURS[pkg] || 2
  const bookedHours = Math.max(hours || minH, minH)
  const subtotal = +(hourlyRate * bookedHours - discountAmount).toFixed(2)
  const tax = +(subtotal * TAX_RATE).toFixed(2)
  const total = +(subtotal + tax).toFixed(2)
  const deposit = +(total * 0.5).toFixed(2)
  return { hourlyRate, subtotal, tax, total, depositAmount: deposit }
}

// @desc  Create booking (public)
// @route POST /api/bookings
const createBooking = asyncHandler(async (req, res) => {
  const { package: pkg, hours, discountCode } = req.body

  // Validate promo code if provided
  let discountAmount = 0
  let usedPromo = null
  if (discountCode) {
    const Promotion = require('../models/Promotion')
    const promo = await Promotion.findOne({
      code: discountCode.toUpperCase(),
      active: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
      $or: [{ maxUses: 0 }, { $expr: { $lt: ['$usedCount', '$maxUses'] } }],
    })
    if (promo) {
      const Pricing = require('../models/Pricing')
      const pricingDoc = await Pricing.findOne({ slug: pkg, active: true })
      const liveRatePromo = pricingDoc?.price || (pkg === 'combo' ? 200 : 85)
      const subtotal = liveRatePromo * Math.max(hours || MIN_HOURS[pkg], MIN_HOURS[pkg])
      discountAmount = promo.type === 'percent'
        ? +(subtotal * promo.value / 100).toFixed(2)
        : promo.value
      usedPromo = promo
    }
  }

  // Fetch live pricing from DB with event-type override support
  const Pricing = require('../models/Pricing')
  const pricingDoc = await Pricing.findOne({ slug: pkg, active: true })
  let liveRate = pricingDoc?.price || (pkg === 'combo' ? 200 : 85)

  // Check if this event type has a specific rate override
  if (pricingDoc?.eventPricing?.length && req.body.eventType) {
    const eventOverride = pricingDoc.eventPricing.find(
      ep => ep.eventType.toLowerCase() === req.body.eventType.toLowerCase()
    )
    if (eventOverride) liveRate = eventOverride.rate
  }

  const pricing = calcPrice(pkg, hours, liveRate, discountAmount)

  const booking = await Booking.create({
    ...req.body,
    ...pricing,
    discountCode: usedPromo ? discountCode.toUpperCase() : undefined,
    discountAmount,
    status: 'pending',
  })

  // Increment promo usage
  if (usedPromo) {
    await usedPromo.updateOne({ $inc: { usedCount: 1 } })
  }

  // Send emails
  try {
    await sendBookingNotification(booking)
    await sendBookingConfirmation(booking)
  } catch (e) {
    console.error('Email error:', e.message)
  }

  res.status(201).json({ success: true, data: booking })
})

// @desc  Get all bookings (admin)
// @route GET /api/bookings
const getBookings = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20, sort = '-createdAt' } = req.query
  const query = {}
  if (status) query.status = status
  if (search) {
    query.$or = [
      { firstName: new RegExp(search, 'i') },
      { lastName: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
      { phone: new RegExp(search, 'i') },
    ]
  }

  const total = await Booking.countDocuments(query)
  const bookings = await Booking.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit))

  res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), data: bookings })
})

// @desc  Get single booking (admin)
// @route GET /api/bookings/:id
const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
  if (!booking) { res.status(404); throw new Error('Booking not found') }
  res.json({ success: true, data: booking })
})

// @desc  Update booking (admin)
// @route PUT /api/bookings/:id
const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!booking) { res.status(404); throw new Error('Booking not found') }
  res.json({ success: true, data: booking })
})

// @desc  Delete booking (admin)
// @route DELETE /api/bookings/:id
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id)
  if (!booking) { res.status(404); throw new Error('Booking not found') }
  res.json({ success: true, message: 'Booking deleted' })
})

// @desc  Validate promo code (public)
// @route POST /api/bookings/validate-promo
const validatePromo = asyncHandler(async (req, res) => {
  const { code, package: pkg, hours } = req.body
  const Promotion = require('../models/Promotion')
  const promo = await Promotion.findOne({ code: code.toUpperCase(), active: true })
  if (!promo) { res.status(404); throw new Error('Invalid promo code') }
  if (promo.expiresAt && promo.expiresAt < new Date()) { res.status(400); throw new Error('Promo code expired') }
  if (promo.maxUses > 0 && promo.usedCount >= promo.maxUses) { res.status(400); throw new Error('Promo code limit reached') }

  const Pricing = require('../models/Pricing')
  const pricingDocV = await Pricing.findOne({ slug: pkg, active: true })
  const liveRateV = pricingDocV?.price || (pkg === 'combo' ? 200 : 85)
  const subtotal = liveRateV * Math.max(hours || MIN_HOURS[pkg], MIN_HOURS[pkg])
  const discountAmount = promo.type === 'percent'
    ? +(subtotal * promo.value / 100).toFixed(2)
    : promo.value

  res.json({ success: true, discount: { type: promo.type, value: promo.value, amount: discountAmount }, description: promo.description })
})

module.exports = { createBooking, getBookings, getBooking, updateBooking, deleteBooking, validatePromo }