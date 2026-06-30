import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ContactForm from './ContactForm'
import { connectDB } from '@/lib/db'
import Settings from '@/models/Settings'

export const metadata = {
  title: 'Contact — Gullkar',
  description: 'Get in touch with Gullkar.',
}

async function getSocialLinks() {
  try {
    await connectDB()
    const s = await Settings.findOne({ key: 'socialLinks' }).lean()
    return s?.value || {}
  } catch { return {} }
}

export default async function ContactPage() {
  const social = await getSocialLinks()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <section className="bg-[#f5f5f5] py-14 text-center border-b border-[#e5e5e5]">
          <p className="text-[11px] uppercase tracking-widest text-[#999] mb-3">Reach out anytime</p>
          <h1 className="text-3xl font-semibold text-[#1a1a1a]">Let&apos;s talk style.</h1>
        </section>

        <section className="py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-semibold text-[#1a1a1a] uppercase tracking-wider mb-4">Contact</h2>
                  <div className="space-y-3">
                    {[
                      { label: 'Phone / WhatsApp', value: '+92 300 0000000', href: 'tel:+923000000000' },
                      { label: 'Email', value: 'hello@gullkar.com', href: 'mailto:hello@gullkar.com' },
                      { label: 'Location', value: 'Pakistan', href: null },
                      { label: 'Hours', value: 'Mon–Sat: 9am – 9pm', href: null },
                    ].map((item) => (
                      <div key={item.label} className="flex gap-4 text-sm border-b border-[#f0f0f0] pb-3">
                        <span className="text-[#999] w-32 shrink-0">{item.label}</span>
                        {item.href
                          ? <a href={item.href} className="text-[#1a1a1a] hover:underline">{item.value}</a>
                          : <span className="text-[#1a1a1a]">{item.value}</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-[#1a1a1a] uppercase tracking-wider mb-3">Follow Us</h2>
                  <div className="flex gap-4">
                    {['facebook', 'instagram', 'tiktok'].map((key) => {
                      const url = social[key]
                      return url ? (
                        <a key={key} href={url} target="_blank" rel="noreferrer"
                          className="text-xs text-[#555] underline underline-offset-2 hover:text-[#1a1a1a] capitalize transition">
                          {key}
                        </a>
                      ) : null
                    })}
                    {!social.facebook && !social.instagram && !social.tiktok && (
                      <p className="text-xs text-[#bbb]">No social links configured yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form */}
              <div>
                <h2 className="text-sm font-semibold text-[#1a1a1a] uppercase tracking-wider mb-4">Send a Message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
