'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setStatus(null)

    if (!name.trim() || !contact.trim() || !message.trim()) {
      setError('Please fill in all fields before submitting.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), contact: contact.trim(), message: message.trim() }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Unable to send your message.')
      }

      setStatus('Your message has been sent! We will get back to you soon.')
      setName('')
      setContact('')
      setMessage('')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card-dark rounded-[1.5rem] p-5 sm:p-6">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className="w-full bg-[#111] border border-[#c9a84c]/20 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/60 text-sm transition"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Phone or Email</label>
          <input
            type="text"
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            placeholder="Your phone number or email"
            className="w-full bg-[#111] border border-[#c9a84c]/20 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/60 text-sm transition"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Message</label>
          <textarea
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Tell us how we can help you"
            className="w-full bg-[#111] border border-[#c9a84c]/20 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/60 text-sm transition resize-none min-h-[160px]"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-center">
          <button
            type="submit"
            className="w-full sm:w-auto btn-gold px-6 py-3 rounded-2xl font-semibold disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
          <p className="text-sm text-gray-500">We usually reply within 24 hours.</p>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {status && <p className="text-sm text-green-400">{status}</p>}
      </form>
    </div>
  )
}
