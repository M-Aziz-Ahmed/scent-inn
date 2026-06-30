"use client"
import React, { useState, useEffect } from 'react'

export default function UserProfileClient() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gullkarUser')
      if (stored) {
        const obj = JSON.parse(stored)
        setName(obj.name || '')
        setEmail(obj.email || '')
      }
    } catch {}
  }, [])

  function save() {
    const obj = { name, email }
    try {
      localStorage.setItem('gullkarUser', JSON.stringify(obj))
      alert('Profile saved locally')
    } catch {
      alert('Unable to save profile')
    }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h1>Your Profile</h1>
      <div style={{ display: 'grid', gap: 8 }}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%' }} />
        </label>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%' }} />
        </label>
        <div>
          <button onClick={save}>Save</button>
        </div>
      </div>
    </div>
  )
}
