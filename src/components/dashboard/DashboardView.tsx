import { useState } from 'react';
import type { Listing, ReferencePoint, EnrichedListing } from '../../types/listing';
import { useFilters } from '../../hooks/useFilters';
import FilterBar from './FilterBar';
import SortControls from './SortControls';
import ListingCard from './ListingCard';
import ListingDetailModal from './ListingDetailModal';
import { SearchX } from 'lucide-react';

interface Props {
  allListings: Listing[];
  referencePoint: ReferencePoint;
}

export default function DashboardView({ allListings, referencePoint }: Props) {
  const { listings, filters, setFilters, sortOption, setSortOption, resetFilters } =
    useFilters(allListings, referencePoint);
  const [selectedListing, setSelectedListing] = useState<EnrichedListing | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-dark">Browse Listings</h1>
        <p className="text-base text-dark/50 mt-2">
          Find the perfect sublease near campus
        </p>
      </div>

      <FilterBar filters={filters} onChange={setFilters} onReset={resetFilters} />

      <SortControls
        sortOption={sortOption}
        onChange={setSortOption}
        resultCount={listings.length}
      />

      {listings.length === 0 ? (
        <div className="text-center py-20">
          <SearchX size={48} className="text-dark/20 mx-auto mb-4" />
          <p className="text-dark/50 font-medium text-lg">No listings match your filters</p>
          <button
            onClick={resetFilters}
            className="mt-3 text-sm text-teal hover:text-teal-dark transition-colors bg-transparent border-none cursor-pointer underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {listings.map((listing, index) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              rank={index + 1}
              onClick={() => setSelectedListing(listing)}
            />
          ))}
        </div>
      )}

      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </div>
  );
}
