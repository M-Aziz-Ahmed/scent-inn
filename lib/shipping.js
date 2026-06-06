export const FREE_SHIPPING_THRESHOLD = 3000

export const DEFAULT_SHIPPING_RATES = {
  karachi: 150,
  lahore: 150,
  islamabad: 200,
  peshawar: 250,
  quetta: 300,
  default: 300,
}

export function normalizeCity(city) {
  return (city || '').trim().toLowerCase()
}

export function getShippingCost(city, rates = DEFAULT_SHIPPING_RATES) {
  const normalized = normalizeCity(city)
  if (normalized && rates?.[normalized] != null) {
    return Number(rates[normalized])
  }
  if (rates?.default != null) {
    return Number(rates.default)
  }
  return Number(DEFAULT_SHIPPING_RATES.default)
}

export function formatCityLabel(city) {
  return city
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
