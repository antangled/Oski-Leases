import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Listing, ReferencePoint, EnrichedListing } from '../../types/listing';
import { haversineDistance } from '../../utils/distance';
import { computeOptimalityScore } from '../../utils/scoring';
import MapView from '../map/MapView';
import ListingCard from '../dashboard/ListingCard';
import ListingDetailModal from '../dashboard/ListingDetailModal';
import { Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  listings: Listing[];
  referencePoint: ReferencePoint;
  onReferencePointChange: (point: ReferencePoint) => void;
}

export default function HomePage({ listings, referencePoint, onReferencePointChange }: Props) {
  const [selectedListing, setSelectedListing] = useState<EnrichedListing | null>(null);

  const topListings: EnrichedListing[] = useMemo(() => {
    return listings
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
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [listings, referencePoint]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Picks — ABOVE the map */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Sparkles size={24} className="text-teal" />
          <div>
            <h2 className="text-2xl font-bold text-dark">Best Deals Available Now</h2>
            <p className="text-sm text-dark/50 mt-1">Curated picks based on price, distance, and availability</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topListings.map((listing, index) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              rank={index + 1}
              onClick={() => setSelectedListing(listing)}
            />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-teal text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-teal-dark transition-colors no-underline shadow-md hover:shadow-lg"
          >
            See all listings
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Map card — BELOW top picks */}
      <MapView
        listings={listings}
        referencePoint={referencePoint}
        onReferencePointChange={onReferencePointChange}
      />

      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </div>
  );
}
