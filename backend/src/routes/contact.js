// contact.js — alias for leads (public contact form)
const express = require('express')
const r = express.Router()
const { createLead } = require('../controllers/leads')
r.post('/', createLead)
module.exports = r
