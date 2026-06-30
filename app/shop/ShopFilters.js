'use client'
import { useRouter } from 'next/navigation'

const GENDERS = [
  { label: 'All', value: '' },
  { label: 'Men', value: 'men' },
  { label: 'Women', value: 'women' },
  { label: 'Kids', value: 'kids' },
  { label: 'Unisex', value: 'unisex' },
]

const SORTS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Best Selling', value: 'bestselling' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
]

function buildUrl({ category, gender, sort }, overrides = {}) {
  const p = { category, gender, sort, page: '1', ...overrides }
  const qs = Object.entries(p)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')
  return `/shop${qs ? '?' + qs : ''}`
}

export default function ShopFilters({ currentCategory, currentGender, currentSort, categories = [] }) {
  const router = useRouter()

  return (
    <div className="space-y-3 mb-8">
      {/* Gender filter */}
      <div className="flex flex-wrap gap-2">
        {GENDERS.map((g) => (
          <button
            key={g.value}
            onClick={() => router.push(buildUrl({ category: currentCategory, gender: g.value, sort: currentSort }))}
            className={`px-4 py-2 rounded-full text-sm transition ${
              currentGender === g.value
                ? 'bg-[#c9a84c] text-black font-semibold'
                : 'border border-[#c9a84c]/30 text-gray-300 hover:border-[#c9a84c]'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Category filter — dynamic */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => router.push(buildUrl({ category: '', gender: currentGender, sort: currentSort }))}
            className={`px-4 py-1.5 rounded-full text-xs transition ${
              !currentCategory
                ? 'bg-[#1a3c2e] text-[#c9a84c] border border-[#c9a84c]/40'
                : 'border border-gray-700 text-gray-500 hover:border-[#c9a84c]/40'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => router.push(buildUrl({ category: cat, gender: currentGender, sort: currentSort }))}
              className={`px-4 py-1.5 rounded-full text-xs transition capitalize ${
                currentCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#1a3c2e] text-[#c9a84c] border border-[#c9a84c]/40'
                  : 'border border-gray-700 text-gray-500 hover:border-[#c9a84c]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Sort */}
      <div className="flex justify-end">
        <select
          className="bg-[#101a14] border border-[#c9a84c]/30 text-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer"
          value={currentSort}
          onChange={(e) => router.push(buildUrl({ category: currentCategory, gender: currentGender, sort: e.target.value }))}
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
