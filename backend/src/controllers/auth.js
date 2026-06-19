const asyncHandler = require('express-async-handler')
const User = require('../models/User')

// @desc  Login admin
// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400); throw new Error('Please provide email and password')
  }

  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.matchPassword(password))) {
    res.status(401); throw new Error('Invalid credentials')
  }

  const token = user.getSignedToken()
  res.json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  })
})

// @desc  Get current admin
// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  res.json({ success: true, user })
})

// @desc  Seed first admin (run once, then disable)
// @route POST /api/auth/seed
const seedAdmin = asyncHandler(async (req, res) => {
  const exists = await User.findOne({ email: process.env.ADMIN_EMAIL })
  if (exists) {
    res.status(400); throw new Error('Admin already exists')
  }
  const user = await User.create({
    name: 'Stéphanie Lebrun',
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: 'superadmin',
  })
  res.status(201).json({ success: true, message: 'Admin created', email: user.email })
})

module.exports = { login, getMe, seedAdmin }
