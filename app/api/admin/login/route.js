import { connectDB } from '@/lib/db'
import Admin from '@/models/Admin'
import { signToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    await connectDB()
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const admin = await Admin.findOne({ email: email.toLowerCase(), isActive: true })
    if (!admin) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isValid = await admin.comparePassword(password)
    if (!isValid) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signToken({ id: admin._id, email: admin.email, role: admin.role })

    const cookieStore = await cookies()
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return Response.json({
      message: 'Login successful',
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    return Response.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
