'use client'
import Link from 'next/link'
import Script from 'next/script'

/**
 * AdBanner — renders the EffectiveCPM banner unit inside a contained,
 * clearly-labelled section so it never overlaps site content.
 */
export default function AdBanner() {
  return (
    <div className="w-full bg-[#0d0d0d] border-y border-[#c9a84c]/10 py-3 px-4">
      <Link href={'https://www.effectivecpmnetwork.com/ihcemgthh5?key=b7f5fff8ef51f47fcbd582a4cea4465d'} target='_blank' className="text-[10px] uppercase tracking-widest text-gray-600 text-center mb-2 select-none">
        Advertisement
      </Link>
      <div className="max-w-4xl mx-auto flex justify-center overflow-hidden">
        <div id="container-e0150043b5296aa985aea3be5b687fc8" />
      </div>
      <Script
        async
        data-cfasync="false"
        src="https://pl29826312.effectivecpmnetwork.com/e0150043b5296aa985aea3be5b687fc8/invoke.js"
        strategy="lazyOnload"
      />
      <Script src="https://pl29828232.effectivecpmnetwork.com/dc/78/80/dc78805e7d949da4c522942bd15e1eb3.js" />
      <Script>
        {`
        atOptions = {
          'key' : '4e7454b86c07859b454da78eb32e109f',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : { }
  };
        `}
      </Script>
      <script src="https://www.highperformanceformat.com/4e7454b86c07859b454da78eb32e109f/invoke.js"></script>

    </div>
  )
}
