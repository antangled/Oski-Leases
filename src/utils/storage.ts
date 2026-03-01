import type { Listing } from '../types/listing';

const STORAGE_KEY = 'oskilease_listings';

export function loadUserListings(): Listing[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Listing[];
  } catch {
    return [];
  }
}

export function saveUserListings(listings: Listing[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
}
