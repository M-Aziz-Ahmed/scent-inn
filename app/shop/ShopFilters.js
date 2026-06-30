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

function buildUrl({ category, gender, sort }) {
  const p = { category, gender, sort, page: '1' }
  const qs = Object.entries(p).filter(([, v]) => v).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')
  return `/shop${qs ? '?' + qs : ''}`
}

export default function ShopFilters({ currentCategory, currentGender, currentSort, categories = [] }) {
  const router = useRouter()

  return (
    <div className="space-y-3 mb-8">
      {/* Gender */}
      <div className="flex flex-wrap gap-2">
        {GENDERS.map((g) => (
          <button key={g.value}
            onClick={() => router.push(buildUrl({ category: currentCategory, gender: g.value, sort: currentSort }))}
            className={`text-xs px-4 py-1.5 border transition ${
              currentGender === g.value
                ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                : 'border-[#e5e5e5] text-[#555] hover:border-[#1a1a1a]'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => router.push(buildUrl({ category: '', gender: currentGender, sort: currentSort }))}
            className={`text-xs px-4 py-1.5 border transition ${
              !currentCategory ? 'border-[#1a1a1a] text-[#1a1a1a] font-medium' : 'border-[#e5e5e5] text-[#999] hover:border-[#aaa]'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button key={cat}
              onClick={() => router.push(buildUrl({ category: cat, gender: currentGender, sort: currentSort }))}
              className={`text-xs px-4 py-1.5 border transition capitalize ${
                currentCategory.toLowerCase() === cat.toLowerCase()
                  ? 'border-[#1a1a1a] text-[#1a1a1a] font-medium'
                  : 'border-[#e5e5e5] text-[#999] hover:border-[#aaa]'
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
          className="border border-[#e5e5e5] text-[#555] text-xs px-3 py-2 bg-white focus:outline-none focus:border-[#1a1a1a]"
          value={currentSort}
          onChange={(e) => router.push(buildUrl({ category: currentCategory, gender: currentGender, sort: e.target.value }))}
        >
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
    </div>
  )
}
