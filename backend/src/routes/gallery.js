// gallery.js
const express = require('express')
const r = express.Router()
const { getGallery, uploadGallery, updateGallery, deleteGallery, reorderGallery } = require('../controllers/gallery')
const { protect, adminOnly } = require('../middleware/auth')
const { upload } = require('../config/cloudinary')

r.get('/', getGallery)                                              // public
r.post('/', protect, adminOnly, upload.single('file'), uploadGallery)
r.put('/reorder', protect, adminOnly, reorderGallery)
r.put('/:id', protect, adminOnly, updateGallery)
r.delete('/:id', protect, adminOnly, deleteGallery)

module.exports = r
