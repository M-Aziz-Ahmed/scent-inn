import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { connectDB } from '@/lib/db'
import Settings from '@/models/Settings'

export const metadata = {
  title: 'Contact Us — Scent Inn',
  description: 'Get in touch with Scent Inn. We\'re here to help you find your perfect fragrance.',
}

async function getSocialLinks() {
  await connectDB()
  const settings = await Settings.findOne({ key: 'socialLinks' }).lean()
  return settings?.value || {}
}

export default async function ContactPage() {
  const socialLinks = await getSocialLinks()

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="bg-gradient-to-b from-[#1a0e00] to-[#0a0a0a] py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Get in <span className="gold-text">Touch</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Have a question? We'd love to hear from you.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                <div className="space-y-6">
                  {[
                    { icon: '📞', title: 'Phone / WhatsApp', value: '+92 313 4221609', link: 'tel:+923134221609' },
                    { icon: '📧', title: 'Email', value: 'Scentinnperfumes@gmail.com', link: 'mailto:Scentinnperfumes@gmail.com' },
                    { icon: '📍', title: 'Location', value: 'Pakistan', link: null },
                    { icon: '🕐', title: 'Business Hours', value: 'Mon–Sat: 9am – 9pm', link: null },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="text-gray-400 text-sm">{item.title}</p>
                        {item.link ? (
                          <a href={item.link} className="text-white hover:text-[#c9a84c] transition">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-white">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="text-[#c9a84c] font-semibold mb-3">Follow Us</h3>
                  <div className="flex gap-4">
                    {['facebook', 'instagram', 'tiktok'].map((key) => {
                      const label = key.charAt(0).toUpperCase() + key.slice(1)
                      const url = socialLinks[key]
                      return (
                        <a
                          key={key}
                          href={url || '#'}
                          target={url ? '_blank' : undefined}
                          rel={url ? 'noreferrer' : undefined}
                          className={`card-dark px-4 py-2 rounded-lg text-sm transition ${
                            url ? 'text-gray-400 hover:text-[#c9a84c]' : 'text-gray-500 cursor-not-allowed opacity-60'
                          }`}
                          aria-disabled={!url}
                        >
                          {label}
                        </a>
                      )
                    })}
                  </div>
                  {!socialLinks.facebook && !socialLinks.instagram && !socialLinks.tiktok && (
                    <p className="mt-3 text-xs text-gray-500">Set your social media URLs in the admin settings page to enable these links.</p>
                  )}
                </div>
              </div>

              {/* Contact Form */}
              <div className="card-dark rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-[#c9a84c] mb-5">Send a Message</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a84c]/60 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Phone / Email</label>
                    <input
                      type="text"
                      placeholder="Your contact"
                      className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a84c]/60 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Message</label>
                    <textarea
                      rows={4}
                      placeholder="How can we help you?"
                      className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a84c]/60 text-sm resize-none"
                    />
                  </div>
                  <button type="submit" className="w-full btn-gold py-3 rounded-lg font-semibold">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
