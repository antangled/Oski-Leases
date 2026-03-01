import { useState, useCallback, useEffect, useRef } from 'react';
import type { Listing } from '../types/listing';
import { seedListings } from '../data/seedListings';
import { loadUserListings, saveUserListings } from '../utils/storage';
import { fetchAllListings, insertListing } from '../lib/listings-api';
import { seedDatabaseIfEmpty } from '../lib/seed-db';

export function useListings() {
  // Show seed data immediately for instant render
  const [listings, setListings] = useState<Listing[]>(seedListings);
  const [loading, setLoading] = useState(true);
  const seededRef = useRef(false);

  // Load from Supabase on mount (falls back to localStorage)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // Seed the DB if it's empty (no-op if already seeded or no Supabase)
        if (!seededRef.current) {
          seededRef.current = true;
          await seedDatabaseIfEmpty();
        }

        const dbListings = await fetchAllListings();
        if (!cancelled) {
          setListings(dbListings.length > 0 ? dbListings : seedListings);
          setLoading(false);
        }
      } catch {
        // Fallback to seed + localStorage
        if (!cancelled) {
          setListings([...seedListings, ...loadUserListings()]);
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const addListing = useCallback((listing: Listing) => {
    // Optimistic update — shows instantly in UI
    setListings((prev) => [...prev, listing]);

    // Persist to DB in background
    insertListing(listing).catch(() => {
      // Fallback: save to localStorage
      saveUserListings([...loadUserListings(), listing]);
    });
  }, []);

  return { listings, addListing, loading };
}
