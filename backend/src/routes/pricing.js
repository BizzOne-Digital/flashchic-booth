const express = require('express')
const r = express.Router()
const { getPricing, getAllPricing, createPricing, updatePricing, deletePricing, seedPricing } = require('../controllers/pricing')
const { protect, adminOnly } = require('../middleware/auth')
const { upload } = require('../config/cloudinary')

r.get('/', getPricing)                                                    // public
r.get('/all', protect, adminOnly, getAllPricing)                          // admin
r.post('/seed', protect, adminOnly, seedPricing)                          // admin
r.post('/', protect, adminOnly, upload.single('image'), createPricing)    // admin + image upload
r.put('/:id', protect, adminOnly, upload.single('image'), updatePricing)  // admin + image upload
r.delete('/:id', protect, adminOnly, deletePricing)                       // admin

module.exports = r