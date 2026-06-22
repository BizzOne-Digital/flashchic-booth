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
      name: 'Soft Box',
      description: 'Professional soft box lighting for perfect, flattering light at your event.',
      price: 25,
      priceLabel: 'flat rate',
      category: 'lighting',
      order: 1,
      tiers: [],
    },
    {
      name: 'Ring Light',
      description: 'Portable LED ring light — ideal for glam glow and photo-ready lighting.',
      price: 15,
      priceLabel: 'flat rate',
      category: 'lighting',
      order: 2,
      tiers: [],
    },
    {
      name: 'Luxury Stanchions & Velvet Ropes',
      description: 'Gold & black stanchions with pink or red velvet ropes — the perfect VIP touch for your booth area.',
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
      name: 'Red Carpet',
      description: 'Make your guests feel like VIPs with a classic red carpet entrance at your booth.',
      price: 20,
      priceLabel: 'flat rate',
      category: 'decor',
      order: 4,
      tiers: [],
    },
    {
      name: 'Hologram Fan',
      description: 'Stunning 3D holographic fan display — a show-stopping visual experience for your event.',
      price: 0,
      priceLabel: 'contact for pricing',
      category: 'booth',
      order: 5,
      tiers: [],
    },
  ]

  await Addon.insertMany(defaults)
  res.json({ success: true, message: 'Default addons seeded' })
})

module.exports = { getAddons, getAllAddons, createAddon, updateAddon, deleteAddon, seedAddons }