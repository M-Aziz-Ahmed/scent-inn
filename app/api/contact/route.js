import { connectDB } from '@/lib/db'
import Contact from '@/models/Contact'

export async function POST(request) {
  const body = await request.json()
  const { name, contact, message } = body || {}

  if (!name || !contact || !message) {
    return Response.json({ error: 'Name, contact, and message are all required.' }, { status: 400 })
  }

  await connectDB()

  try {
    const contactMessage = await Contact.create({ name, contact, message })
    return Response.json({ message: 'Message sent successfully.', data: { id: contactMessage._id } }, { status: 201 })
  } catch (error) {
    return Response.json({ error: error.message || 'Unable to save message.' }, { status: 500 })
  }
}
