import type { Listing } from '../types/listing';
import { haversineDistance } from './distance';

export interface PriceSuggestion {
  low: number;
  median: number;
  high: number;
  sampleSize: number;
}

export function computePriceSuggestion(
  listings: Listing[],
  bedrooms: number,
  lat: number,
  lng: number,
  radiusMiles: number = 0.5,
): PriceSuggestion | null {
  // Filter to similar listings nearby
  const similar = listings.filter((l) => {
    if (l.bedrooms !== bedrooms) return false;
    const dist = haversineDistance(lat, lng, l.location.lat, l.location.lng);
    return dist <= radiusMiles;
  });

  if (similar.length < 2) {
    // Expand radius and relax bedroom constraint
    const relaxed = listings.filter((l) => {
      const bedroomClose = Math.abs(l.bedrooms - bedrooms) <= 1;
      if (!bedroomClose) return false;
      const dist = haversineDistance(lat, lng, l.location.lat, l.location.lng);
      return dist <= radiusMiles * 2;
    });
    if (relaxed.length < 2) return null;
    return computePercentiles(relaxed);
  }

  return computePercentiles(similar);
}

function computePercentiles(listings: Listing[]): PriceSuggestion {
  const prices = listings.map((l) => l.price).sort((a, b) => a - b);
  const n = prices.length;
  return {
    low: prices[Math.floor(n * 0.25)] ?? prices[0],
    median: prices[Math.floor(n * 0.5)] ?? prices[0],
    high: prices[Math.floor(n * 0.75)] ?? prices[n - 1],
    sampleSize: n,
  };
}

export function getPriceIndicator(price: number, suggestion: PriceSuggestion): 'below' | 'within' | 'above' {
  if (price < suggestion.low) return 'below';
  if (price > suggestion.high) return 'above';
  return 'within';
}
