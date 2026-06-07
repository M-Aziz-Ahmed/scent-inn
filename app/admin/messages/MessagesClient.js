'use client'

import { useEffect, useState } from 'react'

export default function MessagesClient() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [statusText, setStatusText] = useState('')

  const fetchMessages = async () => {
    setLoading(true)
    const token = localStorage.getItem('admin_token')
    const res = await fetch('/api/admin/messages', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setMessages(data.messages || [])
    setLoading(false)
  }

  useEffect(() => { fetchMessages() }, [])

  const updateStatus = async (id, newStatus) => {
    const token = localStorage.getItem('admin_token')
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus }),
    })

    if (res.ok) {
      setMessages((prev) => prev.map((message) => (message._id === id ? { ...message, status: newStatus } : message)))
      if (selectedMessage?._id === id) {
        setSelectedMessage((prev) => ({ ...prev, status: newStatus }))
      }
      setStatusText('Message status updated.')
      setTimeout(() => setStatusText(''), 2500)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Contact Messages</h1>
        <p className="mt-2 text-gray-400 max-w-2xl">
          Review messages submitted from the contact form and mark them as read when you’ve replied.
        </p>
      </div>

      {statusText && <div className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-100">{statusText}</div>}

      {loading ? (
        <div className="text-gray-400">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="rounded-3xl border border-[#c9a84c]/15 bg-[#111] p-10 text-center text-gray-400">
          No contact messages yet.
        </div>
      ) : (
        <div className="grid gap-6">
          {messages.map((message) => (
            <div key={message._id} className="card-dark rounded-3xl border border-[#c9a84c]/10 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-white">{message.name}</h2>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${message.status === 'new' ? 'bg-[#c9a84c]/15 text-[#c9a84c]' : 'bg-white/10 text-gray-300'}`}>
                      {message.status}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-400 text-sm">{message.contact}</p>
                  <p className="mt-1 text-xs text-gray-500">{new Date(message.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedMessage(message)}
                    className="btn-outline-gold rounded-2xl px-4 py-2 text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => updateStatus(message._id, message.status === 'new' ? 'read' : 'new')}
                    className="rounded-2xl bg-[#c9a84c]/10 px-4 py-2 text-sm text-[#c9a84c] transition hover:bg-[#c9a84c]/15"
                  >
                    Mark {message.status === 'new' ? 'read' : 'new'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMessage && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4">
          <div className="mx-auto max-w-2xl rounded-[2rem] border border-[#c9a84c]/20 bg-[#111] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#c9a84c]/10">
              <div>
                <h2 className="text-2xl font-semibold text-white">{selectedMessage.name}</h2>
                <p className="text-gray-400 text-sm">{selectedMessage.contact}</p>
              </div>
              <button onClick={() => setSelectedMessage(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>

            <div className="mt-6 space-y-5">
              <div className="rounded-3xl bg-[#0f0f0f] p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-3">Message</p>
                <p className="text-white whitespace-pre-line">{selectedMessage.message}</p>
              </div>

              <div className="rounded-3xl bg-[#0f0f0f] p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="text-white font-medium">{selectedMessage.status}</p>
                </div>
                <button
                  onClick={() => {
                    const nextStatus = selectedMessage.status === 'new' ? 'read' : 'new'
                    updateStatus(selectedMessage._id, nextStatus)
                    setSelectedMessage((prev) => prev ? { ...prev, status: nextStatus } : prev)
                  }}
                  className="btn-gold rounded-2xl px-5 py-3 text-sm"
                >
                  Mark {selectedMessage.status === 'new' ? 'read' : 'new'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
