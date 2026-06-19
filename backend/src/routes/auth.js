// auth.js
const express = require('express')
const r = express.Router()
const { login, getMe, seedAdmin } = require('../controllers/auth')
const { protect } = require('../middleware/auth')
r.post('/login', login)
r.get('/me', protect, getMe)
r.post('/seed', seedAdmin) // Run once only
module.exports = r
