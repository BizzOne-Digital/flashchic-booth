const asyncHandler = require('express-async-handler')
const Lead = require('../models/Lead')
const { sendContactNotification, sendContactAutoReply } = require('../utils/email')

// @desc  Submit contact form (public)
// @route POST /api/leads
const createLead = asyncHandler(async (req, res) => {
  const lead = await Lead.create(req.body)
  try {
    await sendContactNotification(lead)
    await sendContactAutoReply(lead)
  } catch (e) {
    console.error('Email error:', e.message)
  }
  res.status(201).json({ success: true, message: 'Message sent' })
})

// @desc  Get all leads (admin)
// @route GET /api/leads
const getLeads = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query
  const query = {}
  if (status) query.status = status
  if (search) query.$or = [
    { name: new RegExp(search, 'i') },
    { email: new RegExp(search, 'i') },
  ]

  const total = await Lead.countDocuments(query)
  const leads = await Lead.find(query)
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('convertedToBooking', 'status total eventDate')

  res.json({ success: true, total, data: leads })
})

// @desc  Update lead status (admin)
// @route PUT /api/leads/:id
const updateLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!lead) { res.status(404); throw new Error('Lead not found') }
  res.json({ success: true, data: lead })
})

// @desc  Delete lead (admin)
// @route DELETE /api/leads/:id
const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id)
  if (!lead) { res.status(404); throw new Error('Lead not found') }
  res.json({ success: true, message: 'Deleted' })
})

module.exports = { createLead, getLeads, updateLead, deleteLead }
