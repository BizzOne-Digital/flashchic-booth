const mongoose = require('mongoose')

const addonSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price:       { type: Number, required: true },
  priceLabel:  { type: String, default: '' }, // e.g. "per hour", "flat rate", or custom like "2 stanchions + 1 rope"
  image:       { type: String, default: '' },
  category:    { type: String, default: 'general' }, // lighting, decor, etc.
  active:      { type: Boolean, default: true },
  order:       { type: Number, default: 0 },
  // For tiered pricing (like stanchions)
  tiers: [{
    label: { type: String },  // "2 stanchions + 1 rope"
    price: { type: Number },
  }],
}, { timestamps: true })

module.exports = mongoose.model('Addon', addonSchema)