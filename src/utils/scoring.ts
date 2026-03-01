import type { EnrichedListing, SortOption } from '../types/listing';

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return Math.min(Math.max((value - min) / (max - min), 0), 1);
}

function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA).getTime();
  const b = new Date(dateB).getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export function computeOptimalityScore(
  listing: { price: number; distance: number; availability: { start: string } },
): number {
  const W_PRICE = 0.3;
  const W_DISTANCE = 0.3;
  const W_AVAILABILITY = 0.4;

  const priceScore = 1 - normalize(listing.price, 800, 2500);
  const distanceScore = 1 - normalize(listing.distance, 0, 1.5);

  const today = new Date().toISOString().split('T')[0];
  const daysUntil = Math.max(0, daysBetween(today, listing.availability.start));
  const availabilityScore = 1 - normalize(daysUntil, 0, 180);

  return W_PRICE * priceScore + W_DISTANCE * distanceScore + W_AVAILABILITY * availabilityScore;
}

export function getSortComparator(
  option: SortOption,
): (a: EnrichedListing, b: EnrichedListing) => number {
  switch (option) {
    case 'price-asc':
      return (a, b) => a.price - b.price;
    case 'price-desc':
      return (a, b) => b.price - a.price;
    case 'distance-asc':
      return (a, b) => a.distance - b.distance;
    case 'distance-desc':
      return (a, b) => b.distance - a.distance;
    case 'availability-asc':
      return (a, b) => a.availability.start.localeCompare(b.availability.start);
    case 'best-match':
      return (a, b) => b.score - a.score;
  }
}
