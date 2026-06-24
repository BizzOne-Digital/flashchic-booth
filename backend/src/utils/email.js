const nodemailer = require('nodemailer')

const getTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_FROM, pass: process.env.EMAIL_PASS },
})

const PKG_NAMES = { photobooth: 'Photobooth', videobooth: '360 Videobooth', combo: 'Photo + Video Combo' }
const goldStyle = `color:#d4af37`
const baseStyle = `font-family:sans-serif;max-width:620px;margin:0 auto;background:#111;color:#fff;padding:40px;border:1px solid #d4af37`
const headerStyle = `text-align:center;margin-bottom:24px`
const h1Style = `${goldStyle};font-size:22px;letter-spacing:4px;text-transform:uppercase;margin:0`
const hrStyle = `border-color:#d4af37;opacity:0.3;margin:20px 0`
const tdLabelStyle = `padding:8px 0;color:#888;font-size:11px;letter-spacing:1px;text-transform:uppercase;width:140px`
const tdValueStyle = `padding:8px 0;color:#ddd`

const row = (label, value) => `
  <tr>
    <td style="${tdLabelStyle}">${label}</td>
    <td style="${tdValueStyle}">${value || '—'}</td>
  </tr>`

// ── BOOKING NOTIFICATION TO OWNER ──────────────────────────────────────────
const sendBookingNotification = async (booking) => {
  const t = getTransporter()
  const pkgName = PKG_NAMES[booking.package] || booking.package
  await t.sendMail({
    from: `"Flashchic Website" <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_TO,
    replyTo: booking.email,
    subject: `🎉 NEW BOOKING — ${booking.firstName} ${booking.lastName} | ${booking.eventDate}`,
    html: `
      <div style="${baseStyle}">
        <div style="${headerStyle}">
          <h1 style="${h1Style}">Flashchic Photobooth</h1>
          <p style="color:#888;font-size:11px;letter-spacing:2px;margin-top:6px">NEW BOOKING REQUEST</p>
        </div>
        <hr style="${hrStyle}"/>
        <div style="background:#d4af37;padding:12px;text-align:center;margin-bottom:20px">
          <strong style="color:#0a0a0a;font-size:15px">${pkgName} — $${booking.total?.toFixed(2)} CAD</strong>
        </div>
        <table style="width:100%;border-collapse:collapse">
          ${row('Client', `${booking.firstName} ${booking.lastName}`)}
          ${row('Email', `<a href="mailto:${booking.email}" style="${goldStyle}">${booking.email}</a>`)}
          ${row('Phone', `<a href="tel:${booking.phone}" style="color:#fff">${booking.phone}</a>`)}
          ${row('Event Date', booking.eventDate)}
          ${row('Event Type', booking.eventType)}
          ${row('Location', booking.eventLocation)}
          ${row('Guests', booking.guestCount)}
          ${row('Indoor/Outdoor', booking.indoorOutdoor)}
          ${row('Hours', `${booking.hours || '—'} hrs`)}
          ${row('Theme', booking.theme)}
          ${row('Deposit Due', `<strong style="${goldStyle}">$${booking.depositAmount?.toFixed(2)}</strong>`)}
        </table>
        ${booking.additionalInfo ? `<div style="background:#1a1a1a;padding:15px;border-left:3px solid #d4af37;margin-top:16px"><p style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px">Notes</p><p style="color:#ddd">${booking.additionalInfo}</p></div>` : ''}
        <div style="margin-top:24px;text-align:center">
          <a href="mailto:${booking.email}" style="background:#d4af37;color:#0a0a0a;padding:12px 28px;text-decoration:none;font-weight:bold;font-size:12px;letter-spacing:2px;text-transform:uppercase">Reply to Client</a>
        </div>
        <p style="margin-top:24px;color:#444;font-size:11px;text-align:center">Flashchic Photobooth · Laval, Québec</p>
      </div>`,
  })
}

// ── BOOKING AUTO-REPLY TO CLIENT (with e-transfer instructions) ─────────────
const sendBookingConfirmation = async (booking) => {
  const t = getTransporter()
  const depositAmt = booking.depositAmount?.toFixed(2) || '0.00'
  await t.sendMail({
    from: `"Flashchic Photobooth" <${process.env.EMAIL_FROM}>`,
    to: booking.email,
    subject: `Booking Request Received — ${booking.eventDate} | Flashchic Photobooth`,
    html: `
      <div style="${baseStyle}">
        <div style="${headerStyle}"><h1 style="${h1Style}">Flashchic Photobooth</h1></div>
        <hr style="${hrStyle}"/>
        <p style="color:#ddd">Hi ${booking.firstName},</p>
        <p style="color:#ddd;line-height:1.7">Thank you for your booking request! To confirm your date, please send the <strong style="${goldStyle}">50% deposit via e-transfer</strong>.</p>

        <div style="background:#1a1a1a;padding:20px;border:2px solid #d4af37;margin:20px 0;text-align:center">
          <p style="${goldStyle};font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px">E-Transfer Instructions</p>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;width:40%">Step 1 — Amount</td><td style="padding:8px 0;color:#d4af37;font-size:20px;font-weight:bold">$${depositAmt} CAD</td></tr>
            <tr><td style="padding:8px 0;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px">Step 2 — Send to</td><td style="padding:8px 0;color:#d4af37;font-size:16px;font-weight:bold">${process.env.EMAIL_FROM}</td></tr>
            <tr><td style="padding:8px 0;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px">Step 3 — Message</td><td style="padding:8px 0;color:#fff">${booking.firstName} ${booking.lastName} — ${booking.eventDate}</td></tr>
          </table>
        </div>

        <div style="background:#1a1a1a;padding:16px;border-left:3px solid #d4af37;margin:20px 0">
          <p style="${goldStyle};font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Your Booking Summary</p>
          <p style="color:#ddd;margin:4px 0">📅 Date: <strong>${booking.eventDate}</strong></p>
          <p style="color:#ddd;margin:4px 0">📦 Package: <strong>${PKG_NAMES[booking.package] || booking.package}</strong></p>
          <p style="color:#ddd;margin:4px 0">📍 Location: <strong>${booking.eventLocation}</strong></p>
          <p style="color:#ddd;margin:4px 0">💰 Total: <strong style="${goldStyle}">$${booking.total?.toFixed(2)} CAD</strong></p>
          <p style="color:#ddd;margin:4px 0">💳 Deposit Due Now: <strong style="${goldStyle}">$${depositAmt} CAD</strong></p>
          <p style="color:#ddd;margin:4px 0">📆 Balance Due: <strong>15 days before event</strong></p>
        </div>

        <p style="color:#ddd;line-height:1.7">Once your e-transfer is received, we will confirm your booking within 24 hours.</p>
        <p style="color:#ddd;line-height:1.7;margin-top:10px">Questions? Call/text: <a href="tel:5148318409" style="${goldStyle};font-weight:bold">(514) 831-8409</a></p>
        <hr style="${hrStyle}"/>
        <p style="color:#555;font-size:11px;text-align:center">Flashchic Photobooth · Laval, Québec · <a href="https://instagram.com/flashchicphotobooth" style="${goldStyle}">@flashchicphotobooth</a></p>
      </div>`,
  })
}

// ── PAYMENT CONFIRMATION ─────────────────────────────────────────────────────
const sendPaymentConfirmation = async (booking, type) => {
  const t = getTransporter()
  const isDeposit = type === 'deposit'
  const amount = isDeposit ? booking.depositAmount : booking.total - booking.depositAmount
  await t.sendMail({
    from: `"Flashchic Photobooth" <${process.env.EMAIL_FROM}>`,
    to: booking.email,
    subject: `Payment Confirmed ✓ — Flashchic Photobooth`,
    html: `
      <div style="${baseStyle}">
        <div style="${headerStyle}"><h1 style="${h1Style}">Payment Confirmed</h1></div>
        <hr style="${hrStyle}"/>
        <p style="color:#ddd">Hi ${booking.firstName},</p>
        <p style="color:#ddd;line-height:1.7">Your ${isDeposit ? '50% deposit' : 'remaining balance'} of <strong style="${goldStyle}">$${amount?.toFixed(2)} CAD</strong> has been received successfully.</p>
        ${isDeposit ? `<p style="color:#ddd;line-height:1.7">Your date on <strong>${booking.eventDate}</strong> is now <strong style="${goldStyle}">confirmed</strong>! The remaining balance of <strong style="${goldStyle}">$${(booking.total - booking.depositAmount)?.toFixed(2)}</strong> is due 15 days before your event.</p>` : `<p style="color:#ddd;line-height:1.7">Your event on <strong>${booking.eventDate}</strong> is now <strong style="${goldStyle}">fully paid</strong>. See you there!</p>`}
        <hr style="${hrStyle}"/>
        <p style="color:#555;font-size:11px;text-align:center">Flashchic Photobooth · (514) 831-8409 · Laval, Québec</p>
      </div>`,
  })

  // Also notify owner
  await t.sendMail({
    from: `"Flashchic System" <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_TO,
    subject: `💳 PAYMENT RECEIVED — ${booking.firstName} ${booking.lastName} ($${amount?.toFixed(2)})`,
    html: `<div style="${baseStyle}"><p style="color:#ddd">Payment of <strong style="${goldStyle}">$${amount?.toFixed(2)} CAD</strong> received from <strong>${booking.firstName} ${booking.lastName}</strong> (${booking.email}) for ${isDeposit ? 'deposit' : 'full balance'}. Event: ${booking.eventDate}.</p></div>`,
  })
}

// ── CONTACT NOTIFICATION ────────────────────────────────────────────────────
const sendContactNotification = async (lead) => {
  const t = getTransporter()
  await t.sendMail({
    from: `"Flashchic Website" <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_TO,
    replyTo: lead.email,
    subject: `[Contact] ${lead.subject || 'New Message'} — ${lead.name}`,
    html: `
      <div style="${baseStyle}">
        <div style="${headerStyle}"><h1 style="${h1Style}">New Contact Message</h1></div>
        <hr style="${hrStyle}"/>
        <table style="width:100%;border-collapse:collapse">
          ${row('Name', lead.name)}
          ${row('Email', `<a href="mailto:${lead.email}" style="${goldStyle}">${lead.email}</a>`)}
          ${row('Phone', lead.phone)}
          ${row('Subject', lead.subject)}
        </table>
        <div style="background:#1a1a1a;padding:15px;border-left:3px solid #d4af37;margin-top:16px">
          <p style="color:#ddd">${lead.message}</p>
        </div>
        <div style="margin-top:20px;text-align:center">
          <a href="mailto:${lead.email}" style="background:#d4af37;color:#0a0a0a;padding:12px 28px;text-decoration:none;font-weight:bold;font-size:12px;letter-spacing:2px;text-transform:uppercase">Reply</a>
        </div>
      </div>`,
  })
}

const sendContactAutoReply = async (lead) => {
  const t = getTransporter()
  await t.sendMail({
    from: `"Flashchic Photobooth" <${process.env.EMAIL_FROM}>`,
    to: lead.email,
    subject: `Message Received — Flashchic Photobooth`,
    html: `
      <div style="${baseStyle}">
        <div style="${headerStyle}"><h1 style="${h1Style}">Flashchic Photobooth</h1></div>
        <hr style="${hrStyle}"/>
        <p style="color:#ddd">Hi ${lead.name},</p>
        <p style="color:#ddd;line-height:1.7">Thank you for reaching out! We've received your message and will reply within <strong style="${goldStyle}">24 hours</strong>.</p>
        <p style="color:#ddd">Call/text: <a href="tel:5148318409" style="${goldStyle}">(514) 831-8409</a></p>
        <hr style="${hrStyle}"/>
        <p style="color:#555;font-size:11px;text-align:center">Flashchic Photobooth · Laval, Québec</p>
      </div>`,
  })
}

module.exports = {
  sendBookingNotification,
  sendBookingConfirmation,
  sendPaymentConfirmation,
  sendContactNotification,
  sendContactAutoReply,
}