import { connectDB } from '@/lib/db'
import Admin from '@/models/Admin'

// One-time setup route to create the first admin
// Disable this after first use by setting SETUP_DISABLED=true in env
export async function POST(request) {
  if (process.env.SETUP_DISABLED === 'true') {
    return Response.json({ error: 'Setup is disabled' }, { status: 403 })
  }

  try {
    await connectDB()
    const existing = await Admin.countDocuments()
    if (existing > 0) {
      return Response.json({ error: 'Admin already exists. Use login instead.' }, { status: 400 })
    }

    const { name, email, password } = await request.json()
    if (!name || !email || !password) {
      return Response.json({ error: 'Name, email, and password are required' }, { status: 400 })
    }

    const admin = await Admin.create({ name, email, password, role: 'superadmin' })
    return Response.json({
      message: 'Admin created successfully',
      admin: { id: admin._id, name: admin.name, email: admin.email },
    })
  } catch (error) {
    console.error('Setup error:', error)
    return Response.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
