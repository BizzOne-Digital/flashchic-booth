const mongoose = require('mongoose')

const leadSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  email:   { type: String, required: true, lowercase: true, trim: true },
  phone:   { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  source:  { type: String, default: 'website' },
  status:  { type: String, enum: ['new', 'contacted', 'converted', 'lost'], default: 'new' },
  adminNotes: { type: String },
  convertedToBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
}, { timestamps: true })

module.exports = mongoose.model('Lead', leadSchema)
