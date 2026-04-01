import { useState, useMemo } from 'react';
import type { Listing, EnrichedListing, FilterState, SortOption, ReferencePoint } from '../types/listing';
import { haversineDistance } from '../utils/distance';
import { computeOptimalityScore, getSortComparator } from '../utils/scoring';
import { isExpired } from '../utils/listingExpiration';

const defaultFilters: FilterState = {
  priceMin: null,
  priceMax: null,
  distanceMin: null,
  distanceMax: null,
  dateStart: null,
  dateEnd: null,
  genderPreference: null,
  furnished: null,
  verifiedOnly: false,
  petFriendly: false,
  neighborhood: null,
};

export function useFilters(listings: Listing[], referencePoint: ReferencePoint) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sortOption, setSortOption] = useState<SortOption>('best-match');

  const enrichedListings: EnrichedListing[] = useMemo(() => {
    return listings.map((listing) => {
      const distance = haversineDistance(
        referencePoint.lat,
        referencePoint.lng,
        listing.location.lat,
        listing.location.lng,
      );
      return {
        ...listing,
        distance,
        score: computeOptimalityScore({ ...listing, distance }),
      };
    });
  }, [listings, referencePoint]);

  const filtered = useMemo(() => {
    return enrichedListings.filter((listing) => {
      // Filter out expired listings
      if (isExpired(listing)) return false;

      if (filters.priceMin !== null && listing.price < filters.priceMin) return false;
      if (filters.priceMax !== null && listing.price > filters.priceMax) return false;
      if (filters.distanceMin !== null && listing.distance < filters.distanceMin) return false;
      if (filters.distanceMax !== null && listing.distance > filters.distanceMax) return false;
      if (filters.dateStart && listing.availability.end < filters.dateStart) return false;
      if (filters.dateEnd && listing.availability.start > filters.dateEnd) return false;
      if (filters.genderPreference !== null) {
        const pref = listing.genderPreference || 'any';
        if (filters.genderPreference !== pref && pref !== 'any') return false;
      }
      if (filters.furnished !== null && listing.furnished !== filters.furnished) return false;
      if (filters.verifiedOnly && !listing.isVerified && listing.verificationTier !== 'gold' && listing.verificationTier !== 'silver') return false;
      if (filters.petFriendly && listing.petPolicy !== 'allowed' && listing.petPolicy !== 'negotiable') return false;
      if (filters.neighborhood && listing.neighborhoodSlug !== filters.neighborhood) return false;
      return true;
    });
  }, [enrichedListings, filters]);

  const sorted = useMemo(() => {
    return [...filtered].sort(getSortComparator(sortOption));
  }, [filtered, sortOption]);

  const resetFilters = () => setFilters(defaultFilters);

  return { listings: sorted, filters, setFilters, sortOption, setSortOption, resetFilters };
}
