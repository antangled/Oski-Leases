import type { Listing } from '../types/listing';

export function isExpired(listing: Listing): boolean {
  const today = new Date().toISOString().split('T')[0];
  // Expired if the availability start date has passed
  return listing.availability.start < today;
}

export function daysUntilExpiry(listing: Listing): number {
  const today = new Date();
  const start = new Date(listing.availability.start + 'T00:00:00');
  const diff = start.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function isExpiringSoon(listing: Listing, daysThreshold: number = 7): boolean {
  const days = daysUntilExpiry(listing);
  return days > 0 && days <= daysThreshold;
}
