'use client'
import Script from 'next/script'

export default function AdBanner() {
  return (
    <div className="w-full bg-[#f9f9f9] border-t border-[#e5e5e5] py-3 px-4">
      <p className="text-[10px] uppercase tracking-widest text-[#bbb] text-center mb-2 select-none">
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
