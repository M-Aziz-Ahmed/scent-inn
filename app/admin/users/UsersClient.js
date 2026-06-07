'use client'
import { useEffect, useState } from 'react'

export default function UsersClient() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' })
  const [editing, setEditing] = useState(null)

  const fetchAdmins = async () => {
    setLoading(true)
    const token = localStorage.getItem('admin_token')
    const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setAdmins(data.admins || [])
    setLoading(false)
  }

  useEffect(() => { fetchAdmins() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('admin_token')
    await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    })
    setForm({ name: '', email: '', password: '', role: 'admin' })
    fetchAdmins()
  }

  const startEdit = (a) => setEditing({ ...a })

  const saveEdit = async () => {
    const token = localStorage.getItem('admin_token')
    await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(editing),
    })
    setEditing(null)
    fetchAdmins()
  }

  const remove = async (id) => {
    if (!confirm('Delete this admin?')) return
    const token = localStorage.getItem('admin_token')
    await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    })
    fetchAdmins()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Admin Users</h1>

      <div className="card-dark p-4 mb-6">
        <h2 className="text-lg text-gray-300 mb-2">Create new admin</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input className="input" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
          <input className="input" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
          <input className="input" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} />
          <div className="flex gap-2">
            <select className="input" value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})}>
              <option value="admin">admin</option>
              <option value="superadmin">superadmin</option>
            </select>
            <button className="btn-gold" type="submit">Create</button>
          </div>
        </form>
      </div>

      {loading ? <div className="text-gray-400">Loading...</div> : (
        <div className="card-dark p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400">
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(a => (
                <tr key={a._id} className="border-t border-[#c9a84c]/10">
                  <td>{a.name}</td>
                  <td>{a.email}</td>
                  <td>{a.role}</td>
                  <td>{a.isActive ? 'Yes' : 'No'}</td>
                  <td className="flex gap-2">
                    <button onClick={()=>startEdit(a)} className="btn-outline-gold text-xs">Edit</button>
                    <button onClick={()=>remove(a._id)} className="btn-outline-red text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#111] p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg text-gray-300 mb-3">Edit Admin</h3>
            <div className="space-y-2">
              <input className="input" value={editing.name} onChange={(e)=>setEditing({...editing,name:e.target.value})} />
              <input className="input" value={editing.email} onChange={(e)=>setEditing({...editing,email:e.target.value})} />
              <input className="input" placeholder="Password (leave blank to keep)" value={editing.password || ''} onChange={(e)=>setEditing({...editing,password:e.target.value})} />
              <div className="flex gap-2">
                <select className="input" value={editing.role} onChange={(e)=>setEditing({...editing,role:e.target.value})}>
                  <option value="admin">admin</option>
                  <option value="superadmin">superadmin</option>
                </select>
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" checked={editing.isActive} onChange={(e)=>setEditing({...editing,isActive:e.target.checked})} /> Active
                </label>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button className="btn-outline-gold" onClick={()=>setEditing(null)}>Cancel</button>
                <button className="btn-gold" onClick={saveEdit}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
