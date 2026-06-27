const asyncHandler = require('express-async-handler')
const Pricing = require('../models/Pricing')
const { uploadToCloudinary } = require('../config/cloudinary')

// @desc  Get all active pricing (public)
// @route GET /api/pricing
const getPricing = asyncHandler(async (req, res) => {
  const packages = await Pricing.find({ active: true }).sort({ order: 1 })
  res.json({ success: true, data: packages })
})

// @desc  Get all pricing including inactive (admin)
// @route GET /api/pricing/all
const getAllPricing = asyncHandler(async (req, res) => {
  const packages = await Pricing.find().sort({ order: 1 })
  res.json({ success: true, data: packages })
})

// @desc  Create pricing package (admin)
// @route POST /api/pricing
const createPricing = asyncHandler(async (req, res) => {
  let imageUrl = req.body.image || ''

  // If file uploaded, push to Cloudinary
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype)
    imageUrl = result.secure_url
  }

  let eventPricing = []
  if (req.body.eventPricing) {
    try { eventPricing = JSON.parse(req.body.eventPricing) } catch { eventPricing = [] }
  }
  const pkg = await Pricing.create({ ...req.body, image: imageUrl, eventPricing })
  res.status(201).json({ success: true, data: pkg })
})

// @desc  Update pricing package (admin)
// @route PUT /api/pricing/:id
const updatePricing = asyncHandler(async (req, res) => {
  let updateData = { ...req.body }

  // If new image file uploaded, replace on Cloudinary
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype)
    updateData.image = result.secure_url
  }

  if (req.body.eventPricing) {
    try { updateData.eventPricing = JSON.parse(req.body.eventPricing) } catch { updateData.eventPricing = [] }
  }
  const pkg = await Pricing.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
  if (!pkg) { res.status(404); throw new Error('Package not found') }
  res.json({ success: true, data: pkg })
})

// @desc  Delete pricing package (admin)
// @route DELETE /api/pricing/:id
const deletePricing = asyncHandler(async (req, res) => {
  const pkg = await Pricing.findByIdAndDelete(req.params.id)
  if (!pkg) { res.status(404); throw new Error('Package not found') }
  res.json({ success: true, message: 'Deleted' })
})

// @desc  Seed default packages
// @route POST /api/pricing/seed
const seedPricing = asyncHandler(async (req, res) => {
  const count = await Pricing.countDocuments()
  if (count > 0) return res.json({ success: false, message: 'Pricing already seeded' })

  const defaults = [
    {
      name: 'Photobooth', slug: 'photobooth', price: 150, minimum: 2, order: 1,
      tagline: 'Timeless Photos, Instant Joy',
      description: 'Classic photobooth with backdrop, custom overlay, and unlimited HD captures.',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
      features: ['Custom overlay & backdrop', 'Unlimited HD photos', 'Instant sharing', 'Fun props included', 'Qualified operator', 'Delivery, setup & teardown'],
      notIncluded: ['360 video capability'],
    },
    {
      name: '360 Videobooth', slug: 'videobooth', price: 150, minimum: 2, order: 2,
      tagline: 'Cinematic 360° Slow Motion',
      description: '42" rotating stage with HD slow-motion 360° video and instant sharing.',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
      features: ['42" rotating video stage', 'HD slow-motion video', 'RGB video lighting', 'Custom overlay & song', 'Unlimited captures', 'Instant video sharing'],
      notIncluded: ['Traditional photo prints'],
    },
    {
      name: 'Photo + Video Combo', slug: 'combo', price: 250, minimum: 3, order: 3, featured: true,
      tagline: 'The Complete Luxury Experience',
      description: 'Both photobooth and 360 video booth for the ultimate event experience your guests will never forget.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
      features: ['Everything in Photobooth', 'Everything in 360 Videobooth', 'Premium backdrop', 'Full operator team', 'Custom overlays for both'],
      notIncluded: [],
    },
  ]

  await Pricing.insertMany(defaults)
  res.json({ success: true, message: 'Default pricing seeded' })
})

module.exports = { getPricing, getAllPricing, createPricing, updatePricing, deletePricing, seedPricing }