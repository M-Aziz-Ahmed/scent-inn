'use client'
import Script from 'next/script'

/**
 * AdBanner — renders the EffectiveCPM banner unit inside a contained,
 * clearly-labelled section so it never overlaps site content.
 */
export default function AdBanner() {
  return (
    <div className="w-full bg-[#0d0d0d] border-y border-[#c9a84c]/10 py-3 px-4">
      <p className="text-[10px] uppercase tracking-widest text-gray-600 text-center mb-2 select-none">
        Advertisement
      </p>
      <div className="max-w-4xl mx-auto flex justify-center overflow-hidden">
        <div id="container-e0150043b5296aa985aea3be5b687fc8" />
      </div>
      <Script
        async
        data-cfasync="false"
        src="https://pl29826312.effectivecpmnetwork.com/e0150043b5296aa985aea3be5b687fc8/invoke.js"
        strategy="lazyOnload"
      />
    </div>
  )
}
