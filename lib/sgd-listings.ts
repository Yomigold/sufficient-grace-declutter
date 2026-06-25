export type ListingCondition = 'Clean' | 'Near-New'
export type ListingCategory = 'Furniture' | 'Appliances' | 'Electronics'
export type ListingRoute = 'Point & Kill' | 'Self Inspection' | 'Both'
export type ListingStatus = 'available' | 'sold' | 'reserved'

export interface Listing {
  id: string
  ref_code: string
  name: string
  category: ListingCategory
  condition: ListingCondition
  price: number
  location: string
  available_routes: ListingRoute
  status: ListingStatus
  description: string
  photos: string[]
  created_at: string
}

export const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    ref_code: 'SGD-001',
    name: 'LG Double-Door Refrigerator (570L)',
    category: 'Appliances',
    condition: 'Near-New',
    price: 285000,
    location: 'Lekki Phase 1',
    available_routes: 'Both',
    status: 'available',
    description: 'LG side-by-side fridge, 570L capacity. Working perfectly. Barely used — owner relocated. Frost-free, water dispenser functional.',
    photos: [],
    created_at: '2026-06-20T10:00:00Z',
  },
  {
    id: '2',
    ref_code: 'SGD-002',
    name: '7-Seater L-Shaped Sofa Set',
    category: 'Furniture',
    condition: 'Clean',
    price: 195000,
    location: 'Victoria Island',
    available_routes: 'Both',
    status: 'available',
    description: 'Full L-shaped leather sofa, dark brown. No tears, no stains. Complete set with throw cushions. Selling due to relocation.',
    photos: [],
    created_at: '2026-06-18T10:00:00Z',
  },
  {
    id: '3',
    ref_code: 'SGD-003',
    name: 'Samsung 55" Smart TV (4K UHD)',
    category: 'Electronics',
    condition: 'Near-New',
    price: 230000,
    location: 'Ikoyi',
    available_routes: 'Self Inspection',
    status: 'available',
    description: 'Samsung 55 inch 4K smart TV. Works flawlessly, comes with original remote and stand. No dead pixels. Minor cosmetic scratch on stand only.',
    photos: [],
    created_at: '2026-06-17T10:00:00Z',
  },
  {
    id: '4',
    ref_code: 'SGD-004',
    name: 'Samsung Washing Machine (8kg Front Load)',
    category: 'Appliances',
    condition: 'Clean',
    price: 145000,
    location: 'Ajah',
    available_routes: 'Point & Kill',
    status: 'available',
    description: 'Samsung 8kg front-loading washing machine. All cycles working. Clean drum, no mold. Previous owner upgraded to a larger unit.',
    photos: [],
    created_at: '2026-06-15T10:00:00Z',
  },
  {
    id: '5',
    ref_code: 'SGD-005',
    name: 'Apple MacBook Pro 14" (M1 Pro, 2021)',
    category: 'Electronics',
    condition: 'Near-New',
    price: 580000,
    location: 'Surulere',
    available_routes: 'Both',
    status: 'available',
    description: 'MacBook Pro 14-inch, M1 Pro chip, 16GB RAM, 512GB SSD. Battery health 91%. Comes with original charger. Minor hairline on lid — not visible during use.',
    photos: [],
    created_at: '2026-06-14T10:00:00Z',
  },
  {
    id: '6',
    ref_code: 'SGD-006',
    name: 'King Size Bed Frame + Mattress',
    category: 'Furniture',
    condition: 'Clean',
    price: 120000,
    location: 'Gbagada',
    available_routes: 'Point & Kill',
    status: 'available',
    description: 'Solid wood king size bed frame with orthopaedic mattress. Clean, no stains, no sag. Complete with headboard. Dismantled for easy transport.',
    photos: [],
    created_at: '2026-06-12T10:00:00Z',
  },
]

export function formatPrice(price: number): string {
  return price.toLocaleString('en-NG')
}

export const WHATSAPP_NUMBER = '2348000000000'

export function buildWhatsAppLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

export function buildListingWhatsAppLink(listing: Listing): string {
  const msg = `Hi SGD, I'm interested in: ${listing.name} (Ref: ${listing.ref_code}) — ₦${formatPrice(listing.price)}. Is it still available?`
  return buildWhatsAppLink(msg)
}
