import { useState, useMemo } from 'react';
import type { Listing, ReferencePoint, EnrichedListing } from '../../types/listing';
import { haversineDistance } from '../../utils/distance';
import { computeOptimalityScore } from '../../utils/scoring';
import ListingCard from '../dashboard/ListingCard';
import ListingDetailModal from '../dashboard/ListingDetailModal';
import { Heart, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  allListings: Listing[];
  referencePoint: ReferencePoint;
  savedIds: Set<string>;
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
}

export default function SavedListingsView({
  allListings,
  referencePoint,
  savedIds,
  toggleSaved,
  isSaved,
}: Props) {
  const [selectedListing, setSelectedListing] = useState<EnrichedListing | null>(null);

  const savedListings: EnrichedListing[] = useMemo(() => {
    return allListings
      .filter((l) => savedIds.has(l.id))
      .map((listing) => {
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
      })
      .sort((a, b) => b.score - a.score);
  }, [allListings, referencePoint, savedIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center gap-3">
        <Heart size={28} className="text-red-500" fill="currentColor" />
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-dark italic">Saved Listings</h1>
          <p className="text-base text-dark/50 mt-1">
            {savedListings.length} listing{savedListings.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </div>

      {savedListings.length === 0 ? (
        <div className="text-center py-20">
          <SearchX size={48} className="text-dark/20 mx-auto mb-4" />
          <p className="text-dark/50 font-medium text-lg">
            You haven't saved any listings yet
          </p>
          <p className="text-dark/40 text-sm mt-2 mb-6">
            Browse listings and tap the heart icon to save them here
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-gold text-dark px-8 py-3 rounded-xl text-base font-semibold hover:bg-gold-dark transition-colors no-underline"
          >
            Browse Listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {savedListings.map((listing, index) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              rank={index + 1}
              onClick={() => setSelectedListing(listing)}
              isSaved={isSaved(listing.id)}
              onToggleSaved={toggleSaved}
            />
          ))}
        </div>
      )}

      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          isSaved={isSaved(selectedListing.id)}
          onToggleSaved={toggleSaved}
        />
      )}
    </div>
  );
}
