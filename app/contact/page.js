import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ContactForm from './ContactForm'
import { connectDB } from '@/lib/db'
import Settings from '@/models/Settings'

export const metadata = {
  title: 'Contact Us — Gullkar',
  description: 'Get in touch with Gullkar. We\'re here to help with your order or any questions.',
}

async function getSocialLinks() {
  try {
    await connectDB()
    const settings = await Settings.findOne({ key: 'socialLinks' }).lean()
    return settings?.value || {}
  } catch { return {} }
}

export default async function ContactPage() {
  const socialLinks = await getSocialLinks()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0f0d]">
        <section className="bg-[radial-gradient(circle_at_top,_rgba(201,168,76,0.12),transparent_45%),linear-gradient(180deg,#0f2318_0%,#0a0f0d_100%)] py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="inline-flex rounded-full border border-[#c9a84c]/20 bg-white/5 px-4 py-1.5 text-sm uppercase tracking-[0.28em] text-[#f5f5f5] mb-6">
              Reach out anytime
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              Let&apos;s talk style.
            </h1>
            <p className="mx-auto max-w-2xl text-gray-300 text-base sm:text-lg">
              Questions about sizing, orders, or custom requests — our team replies fast.
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12">
              {/* Contact Info */}
              <div className="card-dark rounded-[2rem] border border-[#c9a84c]/10 p-6 sm:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Contact Information</h2>
                    <p className="text-gray-400 max-w-xl">
                      Reach us directly or follow our social channels for new drops and updates.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {[
                      { icon: '📞', title: 'Phone & WhatsApp', value: '+92 300 0000000', link: 'tel:+923000000000' },
                      { icon: '📧', title: 'Email', value: 'hello@gullkar.com', link: 'mailto:hello@gullkar.com' },
                      { icon: '📍', title: 'Location', value: 'Pakistan', link: null },
                      { icon: '🕐', title: 'Business Hours', value: 'Mon–Sat: 9am – 9pm', link: null },
                    ].map((item) => (
                      <div key={item.title} className="flex flex-col gap-2 rounded-3xl bg-[#0f1a13] border border-[#c9a84c]/10 p-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#182218] text-xl">
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs uppercase tracking-[0.2em]">{item.title}</p>
                            {item.link ? (
                              <a href={item.link} className="text-white text-base font-medium transition hover:text-[#c9a84c]">
                                {item.value}
                              </a>
                            ) : (
                              <p className="text-white text-base font-medium">{item.value}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-3xl border border-[#c9a84c]/10 bg-[#0f1a13] p-5">
                    <h3 className="text-xl font-semibold text-white mb-3">Follow Us</h3>
                    <div className="flex flex-wrap gap-3">
                      {['facebook', 'instagram', 'tiktok'].map((key) => {
                        const label = key.charAt(0).toUpperCase() + key.slice(1)
                        const url = socialLinks[key]
                        return (
                          <a
                            key={key}
                            href={url || '#'}
                            target={url ? '_blank' : undefined}
                            rel={url ? 'noreferrer' : undefined}
                            className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                              url
                                ? 'border-[#c9a84c]/20 bg-[#182218] text-gray-200 hover:border-[#c9a84c] hover:text-[#c9a84c]'
                                : 'border-[#333] bg-[#0a0f0d] text-gray-500 cursor-not-allowed opacity-70'
                            }`}
                            aria-disabled={!url}
                          >
                            {label}
                          </a>
                        )
                      })}
                    </div>
                    {!socialLinks.facebook && !socialLinks.instagram && !socialLinks.tiktok && (
                      <p className="mt-4 text-xs text-gray-500">Social links not configured yet. Add them in admin settings.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="rounded-[2rem] p-1 bg-linear-to-br from-[#c9a84c]/20 via-transparent to-[#c9a84c]/10">
                <div className="card-dark rounded-[1.85rem] p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.24)] border border-[#c9a84c]/15">
                  <div className="mb-6">
                    <p className="text-sm uppercase tracking-[0.3em] text-[#c9a84c] mb-3">Message Us</p>
                    <h2 className="text-3xl font-bold text-white sm:text-4xl">Send us a message</h2>
                    <p className="mt-3 text-gray-400">
                      Tell us about your order, sizing question, or anything else. We&apos;ll respond quickly.
                    </p>
                  </div>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
