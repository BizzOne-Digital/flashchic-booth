const express = require('express')
const r = express.Router()
const { getDashboard } = require('../controllers/dashboard')
const { protect, adminOnly } = require('../middleware/auth')
r.get('/', protect, adminOnly, getDashboard)
module.exports = r
