const express = require('express')
const r = express.Router()
const { getPromotions, createPromotion, updatePromotion, deletePromotion, validatePromo } = require('../controllers/promotions')
const { protect, adminOnly } = require('../middleware/auth')

r.post('/validate', validatePromo)                      // public
r.get('/', protect, adminOnly, getPromotions)
r.post('/', protect, adminOnly, createPromotion)
r.put('/:id', protect, adminOnly, updatePromotion)
r.delete('/:id', protect, adminOnly, deletePromotion)

module.exports = r
