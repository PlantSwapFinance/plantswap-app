const { Resend } = require('resend')

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'plantswapfinance@gmail.com'
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Netlify function for the public `/contact-us` form.
 * Sends submissions via Resend. Same-origin only — no CORS headers.
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  let payload
  try {
    payload = JSON.parse(event.body || '{}')
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const { clientName, email, sujet, message, honeypot } = payload || {}

  // Honeypot — silently accept so bots don't retry.
  if (honeypot) {
    return { statusCode: 200, body: JSON.stringify({ ok: true }) }
  }

  if (!clientName || typeof clientName !== 'string' || !clientName.trim()) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Name is required' }) }
  }
  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Valid email is required' }) }
  }
  if (!sujet || typeof sujet !== 'string' || !sujet.trim()) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Subject is required' }) }
  }
  if (!message || typeof message !== 'string' || !message.trim()) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Message is required' }) }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('contact-us: RESEND_API_KEY is not set')
    return { statusCode: 500, body: JSON.stringify({ error: 'Email service not configured' }) }
  }

  const resend = new Resend(apiKey)
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `[Contact] ${sujet}`,
      text: `From: ${clientName} <${email}>\nSubject: ${sujet}\n\n${message}`,
    })
    return { statusCode: 200, body: JSON.stringify({ ok: true }) }
  } catch (error) {
    console.error('contact-us: resend failed', error)
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to send message' }) }
  }
}