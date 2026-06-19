const express = require('express')
const r = express.Router()
const { createLead, getLeads, updateLead, deleteLead } = require('../controllers/leads')
const { protect, adminOnly } = require('../middleware/auth')

r.post('/', createLead)                             // public (contact form)
r.get('/', protect, adminOnly, getLeads)
r.put('/:id', protect, adminOnly, updateLead)
r.delete('/:id', protect, adminOnly, deleteLead)

module.exports = r
