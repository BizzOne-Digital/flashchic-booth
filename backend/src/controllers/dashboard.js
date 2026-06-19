const asyncHandler = require('express-async-handler')
const Booking = require('../models/Booking')
const Lead = require('../models/Lead')
const Gallery = require('../models/Gallery')

// @desc  Get dashboard stats (admin)
// @route GET /api/dashboard
const getDashboard = asyncHandler(async (req, res) => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  const [
    totalBookings,
    monthBookings,
    pendingBookings,
    confirmedBookings,
    paidBookings,
    totalLeads,
    newLeads,
    galleryCount,
    revenueData,
    recentBookings,
    recentLeads,
    upcomingBookings,
  ] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Booking.countDocuments({ status: 'pending' }),
    Booking.countDocuments({ status: { $in: ['confirmed', 'deposit_paid'] } }),
    Booking.countDocuments({ status: { $in: ['paid', 'completed'] } }),
    Lead.countDocuments(),
    Lead.countDocuments({ status: 'new' }),
    Gallery.countDocuments(),
    Booking.aggregate([
      { $match: { status: { $in: ['deposit_paid', 'paid', 'completed'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' }, totalDeposits: { $sum: '$depositAmount' } } },
    ]),
    Booking.find().sort('-createdAt').limit(5).select('firstName lastName email package eventDate status total createdAt'),
    Lead.find().sort('-createdAt').limit(5).select('name email status createdAt'),
    Booking.find({
      eventDate: { $gte: now.toISOString().split('T')[0] },
      status: { $nin: ['cancelled'] },
    }).sort('eventDate').limit(5).select('firstName lastName eventDate package eventLocation status'),
  ])

  const revenue = revenueData[0] || { totalRevenue: 0, totalDeposits: 0 }

  res.json({
    success: true,
    data: {
      stats: {
        totalBookings,
        monthBookings,
        pendingBookings,
        confirmedBookings,
        paidBookings,
        totalLeads,
        newLeads,
        galleryCount,
        totalRevenue: revenue.totalRevenue,
        totalDeposits: revenue.totalDeposits,
      },
      recentBookings,
      recentLeads,
      upcomingBookings,
    },
  })
})

module.exports = { getDashboard }
