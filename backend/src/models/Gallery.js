const mongoose = require('mongoose')

const gallerySchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  url:         { type: String, required: true },
  publicId:    { type: String, required: true },
  type:        { type: String, enum: ['image', 'video'], default: 'image' },
  category:    { type: String, enum: ['photobooth', 'videobooth', 'combo', 'general'], default: 'general' },
  eventType:   { type: String },
  featured:    { type: Boolean, default: false },
  order:       { type: Number, default: 0 },
  tags:        [{ type: String }],
}, { timestamps: true })

module.exports = mongoose.model('Gallery', gallerySchema)
