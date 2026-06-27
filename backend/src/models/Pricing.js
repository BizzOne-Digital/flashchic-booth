const mongoose = require('mongoose')

const eventPricingSchema = new mongoose.Schema({
  eventType: { type: String, required: true }, // e.g. "Birthday"
  rate:       { type: Number, required: true }, // override rate for this event type
})

const pricingSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  price:       { type: Number, required: true }, // base/default price
  unit:        { type: String, default: '/hr' },
  minimum:     { type: Number, default: 2 },
  description: { type: String },
  tagline:     { type: String },
  image:       { type: String, default: '' },
  featured:    { type: Boolean, default: false },
  active:      { type: Boolean, default: true },
  order:       { type: Number, default: 0 },
  features:    [{ type: String }],
  notIncluded: [{ type: String }],
  // Per-event-type pricing overrides
  eventPricing: [eventPricingSchema],
  addons: [{
    name:  { type: String },
    price: { type: Number },
  }],
}, { timestamps: true })

module.exports = mongoose.model('Pricing', pricingSchema)