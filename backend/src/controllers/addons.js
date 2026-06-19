const asyncHandler = require('express-async-handler')
const Addon = require('../models/Addon')
const { uploadToCloudinary } = require('../config/cloudinary')

// @desc  Get all active addons (public)
// @route GET /api/addons
const getAddons = asyncHandler(async (req, res) => {
  const addons = await Addon.find({ active: true }).sort({ order: 1 })
  res.json({ success: true, data: addons })
})

// @desc  Get all addons (admin)
// @route GET /api/addons/all
const getAllAddons = asyncHandler(async (req, res) => {
  const addons = await Addon.find().sort({ order: 1 })
  res.json({ success: true, data: addons })
})

// @desc  Create addon (admin)
// @route POST /api/addons
const createAddon = asyncHandler(async (req, res) => {
  let imageUrl = req.body.image || ''
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype)
    imageUrl = result.secure_url
  }

  // Parse tiers if sent as JSON string
  let tiers = []
  if (req.body.tiers) {
    try { tiers = JSON.parse(req.body.tiers) } catch { tiers = [] }
  }

  const addon = await Addon.create({ ...req.body, image: imageUrl, tiers })
  res.status(201).json({ success: true, data: addon })
})

// @desc  Update addon (admin)
// @route PUT /api/addons/:id
const updateAddon = asyncHandler(async (req, res) => {
  let updateData = { ...req.body }
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype)
    updateData.image = result.secure_url
  }
  if (req.body.tiers) {
    try { updateData.tiers = JSON.parse(req.body.tiers) } catch { updateData.tiers = [] }
  }

  const addon = await Addon.findByIdAndUpdate(req.params.id, updateData, { new: true })
  if (!addon) { res.status(404); throw new Error('Addon not found') }
  res.json({ success: true, data: addon })
})

// @desc  Delete addon (admin)
// @route DELETE /api/addons/:id
const deleteAddon = asyncHandler(async (req, res) => {
  const addon = await Addon.findByIdAndDelete(req.params.id)
  if (!addon) { res.status(404); throw new Error('Addon not found') }
  res.json({ success: true, message: 'Deleted' })
})

// @desc  Seed default addons
// @route POST /api/addons/seed
const seedAddons = asyncHandler(async (req, res) => {
  const count = await Addon.countDocuments()
  if (count > 0) return res.json({ success: false, message: 'Addons already seeded' })

  const defaults = [
    {
      name: 'Soft Box Lighting',
      description: 'Professional soft box for perfect, flattering lighting at your event.',
      price: 25,
      priceLabel: 'flat rate',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80',
      category: 'lighting',
      order: 1,
    },
    {
      name: 'Ring Light',
      description: 'Classic ring light for that perfect glam glow in every photo.',
      price: 15,
      priceLabel: 'flat rate',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80',
      category: 'lighting',
      order: 2,
    },
    {
      name: 'Luxury Stanchions & Velvet Ropes',
      description: 'Gold & black stanchions with red or pink velvet ropes — the perfect VIP touch for your booth area.',
      price: 20,
      priceLabel: 'starting at',
      category: 'decor',
      order: 3,
      tiers: [
        { label: '2 stanchions + 1 rope', price: 20 },
        { label: '4 stanchions + 2 ropes', price: 30 },
        { label: '6 stanchions + 4 ropes', price: 40 },
      ],
    },
    {
      name: 'Digital iPad Express Booth',
      description: 'iPad Photo Booth with customizable lighting, unlimited digital photos + GIFs, custom welcome page & layouts, digital gallery for download.',
      price: 175,
      priceLabel: 'starting at / 2hr min',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80',
      category: 'booth',
      order: 4,
    },
  ]

  await Addon.insertMany(defaults)
  res.json({ success: true, message: 'Default addons seeded' })
})

module.exports = { getAddons, getAllAddons, createAddon, updateAddon, deleteAddon, seedAddons }