const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  // Client info
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, lowercase: true, trim: true },
  phone:     { type: String, required: true },

  // Event
  package:       { type: String, required: true, enum: ['photobooth', 'videobooth', 'combo'] },
  eventType:     { type: String, required: true },
  eventDate:     { type: String, required: true },
  startTime:     { type: String },
  endTime:       { type: String },
  eventLocation: { type: String, required: true },
  guestCount:    { type: Number },
  indoorOutdoor: { type: String, enum: ['Indoor', 'Outdoor', 'Both', ''] },
  theme:         { type: String },
  hours:         { type: Number },
  setupTime:     { type: String },
  additionalInfo:{ type: String },

  // Financials
  hourlyRate:     { type: Number },
  subtotal:       { type: Number },
  tax:            { type: Number },
  total:          { type: Number },
  depositAmount:  { type: Number },
  depositPaid:    { type: Boolean, default: false },
  balancePaid:    { type: Boolean, default: false },
  discountCode:   { type: String },
  discountAmount: { type: Number, default: 0 },

  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'deposit_paid', 'paid', 'cancelled', 'completed'],
    default: 'pending',
  },

  // Stripe
  stripeDepositSessionId:  { type: String },
  stripeBalanceSessionId:  { type: String },
  stripeDepositPaymentId:  { type: String },
  stripeBalancePaymentId:  { type: String },

  // Admin notes
  adminNotes: { type: String },

  // Contract
  contractSigned: { type: Boolean, default: false },
  contractDate:   { type: Date },

}, { timestamps: true })

// Virtual: full name
bookingSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`
})

module.exports = mongoose.model('Booking', bookingSchema)
