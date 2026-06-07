import { connectDB } from '@/lib/db'
import Admin from '@/models/Admin'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const admins = await Admin.find().select('name email role isActive createdAt').lean()
  return Response.json({ admins })
}

export async function POST(request) {
  const admin = await getAdminFromRequest(request)
  if (!admin || admin.role !== 'superadmin') return Response.json({ error: 'Forbidden' }, { status: 403 })

  await connectDB()
  const { name, email, password, role = 'admin' } = await request.json()
  if (!name || !email || !password) return Response.json({ error: 'Missing fields' }, { status: 400 })

  try {
    const existing = await Admin.findOne({ email: email.toLowerCase() })
    if (existing) return Response.json({ error: 'Email already exists' }, { status: 400 })
    const newAdmin = await Admin.create({ name, email: email.toLowerCase(), password, role })
    return Response.json({ admin: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email, role: newAdmin.role } }, { status: 201 })
  } catch (err) {
    return Response.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}

export async function PUT(request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const { id, name, email, role, isActive, password } = await request.json()
  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 })

  const target = await Admin.findById(id)
  if (!target) return Response.json({ error: 'Not found' }, { status: 404 })

  if (name) target.name = name
  if (email) target.email = email.toLowerCase()
  if (typeof isActive === 'boolean') target.isActive = isActive
  if (password) target.password = password
  // Only superadmin can change roles
  if (role && admin.role === 'superadmin') target.role = role

  await target.save()
  return Response.json({ admin: { id: target._id, name: target.name, email: target.email, role: target.role, isActive: target.isActive } })
}

export async function DELETE(request) {
  const admin = await getAdminFromRequest(request)
  if (!admin || admin.role !== 'superadmin') return Response.json({ error: 'Forbidden' }, { status: 403 })

  await connectDB()
  const { id } = await request.json()
  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 })

  if (String(admin.id) === String(id)) return Response.json({ error: 'Cannot delete yourself' }, { status: 400 })

  await Admin.findByIdAndDelete(id)
  return Response.json({ message: 'Deleted' })
}
