const asyncHandler = require('express-async-handler')
const Promotion = require('../models/Promotion')

// @desc  Get all promotions (admin)
// @route GET /api/promotions
const getPromotions = asyncHandler(async (req, res) => {
  const promos = await Promotion.find().sort('-createdAt')
  res.json({ success: true, data: promos })
})

// @desc  Create promotion (admin)
// @route POST /api/promotions
const createPromotion = asyncHandler(async (req, res) => {
  const promo = await Promotion.create(req.body)
  res.status(201).json({ success: true, data: promo })
})

// @desc  Update promotion (admin)
// @route PUT /api/promotions/:id
const updatePromotion = asyncHandler(async (req, res) => {
  const promo = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!promo) { res.status(404); throw new Error('Promotion not found') }
  res.json({ success: true, data: promo })
})

// @desc  Delete promotion (admin)
// @route DELETE /api/promotions/:id
const deletePromotion = asyncHandler(async (req, res) => {
  const promo = await Promotion.findByIdAndDelete(req.params.id)
  if (!promo) { res.status(404); throw new Error('Promotion not found') }
  res.json({ success: true, message: 'Deleted' })
})

// @desc  Validate promo (public)
// @route POST /api/promotions/validate
const validatePromo = asyncHandler(async (req, res) => {
  const { code } = req.body
  const promo = await Promotion.findOne({ code: code?.toUpperCase(), active: true })
  if (!promo) { res.status(404); throw new Error('Invalid promo code') }
  if (promo.expiresAt && new Date() > promo.expiresAt) { res.status(400); throw new Error('Code expired') }
  if (promo.maxUses > 0 && promo.usedCount >= promo.maxUses) { res.status(400); throw new Error('Code limit reached') }

  res.json({
    success: true,
    data: { code: promo.code, type: promo.type, value: promo.value, description: promo.description },
  })
})

module.exports = { getPromotions, createPromotion, updatePromotion, deletePromotion, validatePromo }
