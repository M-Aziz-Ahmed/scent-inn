'use client'
import { useState } from 'react'

const INPUT = 'w-full border border-[#e5e5e5] px-3 py-2.5 text-sm text-[#1a1a1a] placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition bg-white'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setStatus(null)
    if (!name.trim() || !contact.trim() || !message.trim()) {
      setError('Please fill in all fields.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), contact: contact.trim(), message: message.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Unable to send message.')
      setStatus('Message sent! We\'ll get back to you soon.')
      setName(''); setContact(''); setMessage('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-xs text-[#555] mb-1">Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={INPUT} />
      </div>
      <div>
        <label className="block text-xs text-[#555] mb-1">Phone or Email</label>
        <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="0300-0000000 or email" className={INPUT} />
      </div>
      <div>
        <label className="block text-xs text-[#555] mb-1">Message</label>
        <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?" className={`${INPUT} resize-none`} />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {status && <p className="text-xs text-green-600">{status}</p>}
      <button type="submit" disabled={submitting}
        className="w-full bg-[#1a1a1a] text-white text-sm py-3 hover:bg-[#333] transition disabled:opacity-50">
        {submitting ? 'Sending…' : 'Send Message'}
      </button>
      <p className="text-[11px] text-[#bbb]">We usually reply within 24 hours.</p>
    </form>
  )
}
