const asyncHandler = require('express-async-handler')
const Gallery = require('../models/Gallery')
const { cloudinary, uploadToCloudinary } = require('../config/cloudinary')

// @desc  Get all gallery items (public)
// @route GET /api/gallery
const getGallery = asyncHandler(async (req, res) => {
  const { category, type, featured } = req.query
  const query = {}
  if (category) query.category = category
  if (type) query.type = type
  if (featured) query.featured = featured === 'true'

  const items = await Gallery.find(query).sort({ order: 1, createdAt: -1 })
  res.json({ success: true, count: items.length, data: items })
})

// @desc  Upload gallery item (admin)
// @route POST /api/gallery
const uploadGallery = asyncHandler(async (req, res) => {
  if (!req.file) { res.status(400); throw new Error('Please upload a file') }

  const { title, description, category, eventType, featured, tags } = req.body

  // Upload buffer to Cloudinary
  const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype)

  const item = await Gallery.create({
    title: title || 'Untitled',
    description,
    url: result.secure_url,
    publicId: result.public_id,
    type: req.file.mimetype?.startsWith('video') ? 'video' : 'image',
    category: category || 'general',
    eventType,
    featured: featured === 'true',
    tags: tags ? tags.split(',').map(t => t.trim()) : [],
  })

  res.status(201).json({ success: true, data: item })
})

// @desc  Update gallery item (admin)
// @route PUT /api/gallery/:id
const updateGallery = asyncHandler(async (req, res) => {
  const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!item) { res.status(404); throw new Error('Gallery item not found') }
  res.json({ success: true, data: item })
})

// @desc  Delete gallery item (admin)
// @route DELETE /api/gallery/:id
const deleteGallery = asyncHandler(async (req, res) => {
  const item = await Gallery.findById(req.params.id)
  if (!item) { res.status(404); throw new Error('Gallery item not found') }

  // Delete from Cloudinary
  try {
    await cloudinary.uploader.destroy(item.publicId, {
      resource_type: item.type === 'video' ? 'video' : 'image'
    })
  } catch (e) {
    console.error('Cloudinary delete error:', e.message)
  }

  await item.deleteOne()
  res.json({ success: true, message: 'Deleted' })
})

// @desc  Reorder gallery (admin)
// @route PUT /api/gallery/reorder
const reorderGallery = asyncHandler(async (req, res) => {
  const { items } = req.body // [{ id, order }]
  await Promise.all(items.map(({ id, order }) => Gallery.findByIdAndUpdate(id, { order })))
  res.json({ success: true, message: 'Reordered' })
})

module.exports = { getGallery, uploadGallery, updateGallery, deleteGallery, reorderGallery }
