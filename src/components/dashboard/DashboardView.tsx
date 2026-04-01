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
  isSaved?: (id: string) => boolean;
  toggleSaved?: (id: string) => void;
}

export default function DashboardView({ allListings, referencePoint, isSaved, toggleSaved }: Props) {
  const { listings, filters, setFilters, sortOption, setSortOption, resetFilters } =
    useFilters(allListings, referencePoint);
  const [selectedListing, setSelectedListing] = useState<EnrichedListing | null>(null);

  // Separate boosted listings for featured treatment (first 2 max)
  const boostedListings = listings.filter((l) => l.isBoosted).slice(0, 2);
  const boostedIds = new Set(boostedListings.map((l) => l.id));
  const regularListings = listings.filter((l) => !boostedIds.has(l.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-display text-3xl md:text-4xl text-dark italic">Browse Listings</h1>
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
            className="mt-3 text-sm text-gold hover:text-gold-dark transition-colors bg-transparent border-none cursor-pointer underline font-semibold"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Featured / boosted cards — full width */}
          {boostedListings.map((listing, index) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              rank={listings.indexOf(listing) + 1}
              variant="featured"
              onClick={() => setSelectedListing(listing)}
              isSaved={isSaved?.(listing.id)}
              onToggleSaved={toggleSaved}
            />
          ))}

          {/* Regular cards — 2 columns */}
          {regularListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              rank={listings.indexOf(listing) + 1}
              onClick={() => setSelectedListing(listing)}
              isSaved={isSaved?.(listing.id)}
              onToggleSaved={toggleSaved}
            />
          ))}
        </div>
      )}

      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          isSaved={isSaved?.(selectedListing.id)}
          onToggleSaved={toggleSaved}
        />
      )}
    </div>
  );
}
