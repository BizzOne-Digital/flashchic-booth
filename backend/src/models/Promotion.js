const mongoose = require('mongoose')

const promoSchema = new mongoose.Schema({
  code:          { type: String, required: true, unique: true, uppercase: true, trim: true },
  description:   { type: String },
  type:          { type: String, enum: ['percent', 'fixed'], default: 'percent' },
  value:         { type: Number, required: true },  // % or $ amount
  minBookingAmt: { type: Number, default: 0 },
  maxUses:       { type: Number, default: 0 },  // 0 = unlimited
  usedCount:     { type: Number, default: 0 },
  active:        { type: Boolean, default: true },
  expiresAt:     { type: Date },
  appliesTo:     [{ type: String, enum: ['photobooth', 'videobooth', 'combo', 'all'] }],
}, { timestamps: true })

module.exports = mongoose.model('Promotion', promoSchema)
