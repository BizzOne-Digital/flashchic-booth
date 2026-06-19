const mongoose = require('mongoose')

const pricingSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  price:       { type: Number, required: true },
  unit:        { type: String, default: '/hr' },
  minimum:     { type: Number, default: 2 },
  description: { type: String },
  tagline:     { type: String },
  image:       { type: String, default: '' },  // Cloudinary URL or any image URL
  featured:    { type: Boolean, default: false },
  active:      { type: Boolean, default: true },
  order:       { type: Number, default: 0 },
  features:    [{ type: String }],
  notIncluded: [{ type: String }],
  addons: [{
    name:  { type: String },
    price: { type: Number },
  }],
}, { timestamps: true })

module.exports = mongoose.model('Pricing', pricingSchema)