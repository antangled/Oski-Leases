import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Listing, ReferencePoint, EnrichedListing } from '../../types/listing';
import { haversineDistance } from '../../utils/distance';
import { computeOptimalityScore } from '../../utils/scoring';
import MapView from '../map/MapView';
import ListingCard from '../dashboard/ListingCard';
import ListingDetailModal from '../dashboard/ListingDetailModal';
import { Sparkles, ArrowRight, Shield, Zap, FileText, Search } from 'lucide-react';

interface Props {
  listings: Listing[];
  referencePoint: ReferencePoint;
  onReferencePointChange: (point: ReferencePoint) => void;
  isSaved?: (id: string) => boolean;
  toggleSaved?: (id: string) => void;
}

export default function HomePage({ listings, referencePoint, onReferencePointChange, isSaved, toggleSaved }: Props) {
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
    <div className="space-y-0">
      {/* Hero Section */}
      <div className="relative bg-dark overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FDB515' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left — Copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-3 py-1.5 rounded-full text-xs font-semibold mb-5 border border-gold/20">
                <Shield size={13} />
                Berkeley Students Only
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-4">
                Find your next{' '}
                <span className="text-gold italic">semester home</span>{' '}
                near campus
              </h1>

              <p className="text-base md:text-lg text-white/60 max-w-lg mb-8 leading-relaxed">
                The trusted sublease marketplace for Cal students. Browse verified listings,
                connect directly with subletters, and move in fast.
              </p>

              {/* Quick Filter Chips */}
              <div className="flex flex-wrap gap-2 mb-8">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-gold hover:text-dark text-white/80 px-4 py-2 rounded-full text-sm font-medium transition-all no-underline border border-white/10 hover:border-gold"
                >
                  <Search size={14} />
                  Summer 2026
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-gold hover:text-dark text-white/80 px-4 py-2 rounded-full text-sm font-medium transition-all no-underline border border-white/10 hover:border-gold"
                >
                  Under $1,500
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-gold hover:text-dark text-white/80 px-4 py-2 rounded-full text-sm font-medium transition-all no-underline border border-white/10 hover:border-gold"
                >
                  Near Campus
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-gold hover:text-dark text-white/80 px-4 py-2 rounded-full text-sm font-medium transition-all no-underline border border-white/10 hover:border-gold"
                >
                  Furnished
                </Link>
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 bg-gold text-dark px-7 py-3.5 rounded-xl text-base font-bold hover:bg-gold-dark transition-colors no-underline shadow-lg shadow-gold/20"
                >
                  Browse Listings
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/create"
                  className="inline-flex items-center gap-2 bg-white/10 text-white px-7 py-3.5 rounded-xl text-base font-semibold hover:bg-white/20 transition-colors no-underline border border-white/15"
                >
                  List Your Place
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 max-w-md">
                <div>
                  <p className="font-display text-2xl md:text-3xl text-gold italic">{listings.length}+</p>
                  <p className="text-xs text-white/40 mt-1">Active Listings</p>
                </div>
                <div>
                  <p className="font-display text-2xl md:text-3xl text-gold italic">Free</p>
                  <p className="text-xs text-white/40 mt-1">To Browse & Post</p>
                </div>
                <div>
                  <p className="font-display text-2xl md:text-3xl text-gold italic">@cal</p>
                  <p className="text-xs text-white/40 mt-1">Verified Students</p>
                </div>
              </div>
            </div>

            {/* Right — Campanile Image */}
            <div className="hidden lg:block relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/40 aspect-[4/5] max-h-[540px]">
                {/* Gradient overlay for blending into dark bg */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-dark via-dark/20 to-transparent" />
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-dark/40 to-transparent" />
                {/* Gold accent glow */}
                <div className="absolute -inset-1 z-0 rounded-2xl bg-gradient-to-br from-gold/20 via-transparent to-gold/10 blur-sm" />
                <img
                  src="/campanile.jpg"
                  alt="UC Berkeley Campanile at sunset"
                  className="w-full h-full object-cover object-[50%_30%] animate-drone-reveal"
                />
              </div>
              {/* Caption */}
              <p className="text-[10px] text-white/25 mt-2 text-right italic">
                Sather Tower · CC BY-SA 2.5
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Value Props */}
      <div className="bg-white border-b border-dark/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
                <Shield size={20} className="text-gold" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-dark">Verified & Trusted</h3>
                <p className="text-xs text-dark/50 mt-0.5">Berkeley email required. Free landlord verification badges.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
                <FileText size={20} className="text-gold" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-dark">Free Sublease Templates</h3>
                <p className="text-xs text-dark/50 mt-0.5">CA-compliant agreement templates at no cost.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
                <Zap size={20} className="text-gold" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-dark">Semester-Aligned</h3>
                <p className="text-xs text-dark/50 mt-0.5">Listings match Berkeley's academic calendar automatically.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Top Picks */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Sparkles size={22} className="text-gold" />
            <div>
              <h2 className="text-2xl font-bold text-dark">Best Deals Available Now</h2>
              <p className="text-sm text-dark/50 mt-0.5">Curated picks based on price, distance, and availability</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[420px]">
            {topListings.map((listing, index) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                rank={index + 1}
                onClick={() => setSelectedListing(listing)}
                isSaved={isSaved?.(listing.id)}
                onToggleSaved={toggleSaved}
              />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-dark text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-berkeley-blue-light transition-colors no-underline shadow-md hover:shadow-lg"
            >
              See all listings
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Map card */}
        <MapView
          listings={listings}
          referencePoint={referencePoint}
          onReferencePointChange={onReferencePointChange}
        />

        {selectedListing && (
          <ListingDetailModal
            listing={selectedListing}
            onClose={() => setSelectedListing(null)}
            isSaved={isSaved?.(selectedListing.id)}
            onToggleSaved={toggleSaved}
          />
        )}
      </div>
    </div>
  );
}
