'use client'

import { useState, useMemo } from 'react'
import ListingCard from '@/components/website/ListingCard'
import { MOCK_LISTINGS, ListingCategory, ListingCondition, ListingRoute } from '@/lib/sgd-listings'

const CATEGORIES: ListingCategory[] = ['Furniture', 'Appliances', 'Electronics']
const CONDITIONS: ListingCondition[] = ['Clean', 'Near-New']
const ROUTES: ListingRoute[] = ['Point & Kill', 'Self Inspection']
const SORT_OPTIONS = ['Newest First', 'Price: Low to High', 'Price: High to Low']

export default function ListingsPage() {
  const [category, setCategory] = useState<ListingCategory | ''>('')
  const [condition, setCondition] = useState<ListingCondition | ''>('')
  const [route, setRoute] = useState<ListingRoute | ''>('')
  const [sort, setSort] = useState('Newest First')

  const filtered = useMemo(() => {
    let list = MOCK_LISTINGS.filter((l) => l.status === 'available')
    if (category) list = list.filter((l) => l.category === category)
    if (condition) list = list.filter((l) => l.condition === condition)
    if (route) list = list.filter((l) => l.available_routes === route || l.available_routes === 'Both')
    if (sort === 'Price: Low to High') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'Price: High to Low') list = [...list].sort((a, b) => b.price - a.price)
    return list
  }, [category, condition, route, sort])

  const hasFilters = category || condition || route

  return (
    <>
      {/* Header */}
      <section className="bg-bg pt-20 pb-12">
        <div className="max-w-site mx-auto px-6">
          <p className="font-ui text-xs tracking-[0.3em] uppercase text-gold mb-4">Inventory</p>
          <h1 className="font-display text-5xl md:text-6xl text-warm font-semibold mb-4">
            Available Items
          </h1>
          <div className="w-9 h-0.5 bg-gold mb-6" />
          <p className="font-ui text-body leading-relaxed max-w-xl">
            All items are verified clean or near-new condition. Fixed prices. No haggling.
          </p>
        </div>
      </section>

      <section
        className="bg-surface py-12"
        style={{ borderTop: '1.5px solid #C9924A' }}
      >
        <div className="max-w-site mx-auto px-6">
          {/* Filter bar */}
          <div className="flex flex-wrap gap-3 mb-10 items-center">
            {/* Category */}
            <div className="flex gap-2">
              <button
                onClick={() => setCategory('')}
                className="font-ui text-xs tracking-[0.1em] uppercase px-4 py-2 transition-colors"
                style={{
                  background: !category ? '#C9924A' : 'transparent',
                  color: !category ? '#0C0C0C' : '#888888',
                  border: '1px solid rgba(201,146,74,0.4)',
                  borderRadius: '2px',
                }}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat === category ? '' : cat)}
                  className="font-ui text-xs tracking-[0.1em] uppercase px-4 py-2 transition-colors"
                  style={{
                    background: category === cat ? '#C9924A' : 'transparent',
                    color: category === cat ? '#0C0C0C' : '#888888',
                    border: '1px solid rgba(201,146,74,0.4)',
                    borderRadius: '2px',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div
              className="w-px h-6 hidden md:block"
              style={{ background: 'rgba(201,146,74,0.2)' }}
            />

            {/* Condition */}
            {CONDITIONS.map((cond) => (
              <button
                key={cond}
                onClick={() => setCondition(cond === condition ? '' : cond)}
                className="font-ui text-xs tracking-[0.1em] uppercase px-4 py-2 transition-colors"
                style={{
                  background: condition === cond ? '#1A1A1A' : 'transparent',
                  color: condition === cond ? '#C9924A' : '#555555',
                  border: `1px solid ${condition === cond ? '#C9924A' : 'rgba(201,146,74,0.2)'}`,
                  borderRadius: '2px',
                }}
              >
                {cond}
              </button>
            ))}

            <div
              className="w-px h-6 hidden md:block"
              style={{ background: 'rgba(201,146,74,0.2)' }}
            />

            {/* Route */}
            {ROUTES.map((r) => (
              <button
                key={r}
                onClick={() => setRoute(r === route ? '' : r)}
                className="font-ui text-xs tracking-[0.1em] uppercase px-4 py-2 transition-colors"
                style={{
                  background: route === r ? '#1A1A1A' : 'transparent',
                  color: route === r ? '#C9924A' : '#555555',
                  border: `1px solid ${route === r ? '#C9924A' : 'rgba(201,146,74,0.2)'}`,
                  borderRadius: '2px',
                }}
              >
                {r}
              </button>
            ))}

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="ml-auto font-ui text-xs text-muted bg-surface border px-3 py-2 focus:outline-none focus:border-gold transition-colors"
              style={{
                border: '1px solid rgba(201,146,74,0.2)',
                borderRadius: '2px',
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="font-ui text-xs text-muted tracking-wider">
              {filtered.length} item{filtered.length !== 1 ? 's' : ''} available
              {hasFilters && ' (filtered)'}
            </p>
            {hasFilters && (
              <button
                onClick={() => { setCategory(''); setCondition(''); setRoute('') }}
                className="font-ui text-xs text-gold hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div
              className="text-center py-20 px-6"
              style={{
                border: '1px solid rgba(201,146,74,0.15)',
                borderRadius: '4px',
                background: '#111111',
              }}
            >
              <p className="font-display text-2xl text-warm mb-3">Nothing here right now.</p>
              <p className="font-ui text-sm text-muted mb-6">New items drop frequently.</p>
              <a
                href="https://instagram.com/sufficientgracedeclutter"
                target="_blank"
                rel="noopener noreferrer"
                className="font-ui text-xs text-gold hover:underline"
              >
                Follow @sufficientgracedeclutter for drops →
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
