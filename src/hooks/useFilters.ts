import { useState, useMemo } from 'react';
import type { Listing, EnrichedListing, FilterState, SortOption, ReferencePoint } from '../types/listing';
import { haversineDistance } from '../utils/distance';
import { computeOptimalityScore, getSortComparator } from '../utils/scoring';

const defaultFilters: FilterState = {
  priceMin: null,
  priceMax: null,
  distanceMin: null,
  distanceMax: null,
  dateStart: null,
  dateEnd: null,
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
      if (filters.priceMin !== null && listing.price < filters.priceMin) return false;
      if (filters.priceMax !== null && listing.price > filters.priceMax) return false;
      if (filters.distanceMin !== null && listing.distance < filters.distanceMin) return false;
      if (filters.distanceMax !== null && listing.distance > filters.distanceMax) return false;
      if (filters.dateStart && listing.availability.end < filters.dateStart) return false;
      if (filters.dateEnd && listing.availability.start > filters.dateEnd) return false;
      return true;
    });
  }, [enrichedListings, filters]);

  const sorted = useMemo(() => {
    return [...filtered].sort(getSortComparator(sortOption));
  }, [filtered, sortOption]);

  const resetFilters = () => setFilters(defaultFilters);

  return { listings: sorted, filters, setFilters, sortOption, setSortOption, resetFilters };
}
