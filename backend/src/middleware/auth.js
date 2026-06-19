const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/User')

const protect = asyncHandler(async (req, res, next) => {
  let token
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    res.status(401); throw new Error('Not authorized, no token')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    if (!req.user) { res.status(401); throw new Error('User not found') }
    next()
  } catch (err) {
    res.status(401); throw new Error('Not authorized, invalid token')
  }
})

const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin' || req.user?.role === 'superadmin') return next()
  res.status(403); throw new Error('Admin access required')
}

module.exports = { protect, adminOnly }
