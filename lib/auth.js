import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'scent-inn-secret-key-change-in-production'

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

/** For admin-only API routes — blocks affiliate tokens */
export async function getAdminFromRequest(request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const payload = verifyToken(token)
    if (!payload || payload.role === 'affiliate') return null
    return payload
  }
  return null
}

/** For affiliate API routes — accepts affiliate tokens only */
export async function getAffiliateFromRequest(request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const payload = verifyToken(token)
    if (!payload) return null
    return payload
  }
  return null
}

/** For server-side admin page auth — blocks affiliate tokens */
export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  if (!token) return null
  const payload = verifyToken(token.value)
  if (!payload || payload.role === 'affiliate') return null
  return payload
}
