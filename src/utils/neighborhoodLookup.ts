import type { NeighborhoodInfo } from '../types/user';
import { berkeleyNeighborhoods } from '../data/berkeleyNeighborhoods';

export function getNeighborhood(lat: number, lng: number): NeighborhoodInfo | null {
  for (const n of berkeleyNeighborhoods) {
    if (
      lat >= n.bounds.minLat &&
      lat <= n.bounds.maxLat &&
      lng >= n.bounds.minLng &&
      lng <= n.bounds.maxLng
    ) {
      return n;
    }
  }
  // Fallback: find closest neighborhood by center distance
  let closest: NeighborhoodInfo | null = null;
  let minDist = Infinity;
  for (const n of berkeleyNeighborhoods) {
    const centerLat = (n.bounds.minLat + n.bounds.maxLat) / 2;
    const centerLng = (n.bounds.minLng + n.bounds.maxLng) / 2;
    const dist = Math.sqrt((lat - centerLat) ** 2 + (lng - centerLng) ** 2);
    if (dist < minDist) {
      minDist = dist;
      closest = n;
    }
  }
  return closest;
}

export function getNeighborhoodBySlug(slug: string): NeighborhoodInfo | null {
  return berkeleyNeighborhoods.find(n => n.slug === slug) ?? null;
}
