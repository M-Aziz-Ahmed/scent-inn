'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: "Men's", value: 'men' },
  { label: "Women's", value: 'women' },
  { label: 'Unisex', value: 'unisex' },
  { label: 'Oud', value: 'oud' },
  { label: 'Floral', value: 'floral' },
  { label: 'Fresh', value: 'fresh' },
  { label: 'Oriental', value: 'oriental' },
  { label: 'Gift Sets', value: 'gift-sets' },
]

const SORTS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Best Selling', value: 'bestselling' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
]

function buildUrl(category, sort, overrides = {}) {
  const p = { category, sort, page: '1', ...overrides }
  const qs = Object.entries(p)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')
  return `/shop${qs ? '?' + qs : ''}`
}

export default function ShopFilters({ currentCategory, currentSort }) {
  const router = useRouter()

  return (
    <div className="flex flex-wrap gap-3 mb-6 items-center justify-between">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.value}
            href={buildUrl(cat.value, currentSort)}
            className={`px-4 py-2 rounded-full text-sm transition ${
              currentCategory === cat.value
                ? 'bg-[#c9a84c] text-black font-semibold'
                : 'border border-[#c9a84c]/30 text-gray-300 hover:border-[#c9a84c]'
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      <select
        className="bg-[#1a1a1a] border border-[#c9a84c]/30 text-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer"
        value={currentSort}
        onChange={(e) => router.push(buildUrl(currentCategory, e.target.value))}
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  )
}
