const express = require('express')
const r = express.Router()
const { getAddons, getAllAddons, createAddon, updateAddon, deleteAddon, seedAddons } = require('../controllers/addons')
const { protect, adminOnly } = require('../middleware/auth')
const { upload } = require('../config/cloudinary')

r.get('/', getAddons)                                                     // public
r.get('/all', protect, adminOnly, getAllAddons)                            // admin
r.post('/seed', protect, adminOnly, seedAddons)                           // admin
r.post('/', protect, adminOnly, upload.single('image'), createAddon)      // admin
r.put('/:id', protect, adminOnly, upload.single('image'), updateAddon)    // admin
r.delete('/:id', protect, adminOnly, deleteAddon)                         // admin

module.exports = r