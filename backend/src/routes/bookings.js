const express = require('express')
const r = express.Router()
const { createBooking, getBookings, getBooking, updateBooking, deleteBooking, validatePromo } = require('../controllers/bookings')
const { protect, adminOnly } = require('../middleware/auth')

r.post('/validate-promo', validatePromo)
r.post('/', createBooking)                                   // public
r.get('/', protect, adminOnly, getBookings)                  // admin
r.get('/:id', protect, adminOnly, getBooking)
r.put('/:id', protect, adminOnly, updateBooking)
r.delete('/:id', protect, adminOnly, deleteBooking)

module.exports = r
