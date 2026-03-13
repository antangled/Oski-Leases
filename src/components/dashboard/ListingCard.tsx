import type { EnrichedListing } from '../../types/listing';
import { formatDistance } from '../../utils/distance';
import { getSemester, getSemesterColors } from '../../utils/semester';
import { MapPin, Calendar, Star, GraduationCap, User, Heart, Bed, Bath, Zap, Shield, Sofa, Plug, Users } from 'lucide-react';

interface Props {
  listing: EnrichedListing;
  rank: number;
  onClick?: () => void;
  isSaved?: boolean;
  onToggleSaved?: (id: string) => void;
}

function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ListingCard({ listing, rank, onClick, isSaved, onToggleSaved }: Props) {
  const isBestMatch = rank <= 3;
  const scorePercent = Math.round(listing.score * 100);
  const semester = getSemester(listing.availability.start);
  const semColors = getSemesterColors(semester);

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-md border border-dark/8 hover:shadow-xl hover:shadow-dark/8 hover:-translate-y-1 transition-all duration-200 animate-fade-in-up overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Semester banner */}
      <div className={`px-4 py-2 text-xs font-bold tracking-wide uppercase flex items-center gap-2 ${semColors.bg} ${semColors.text} border-b ${semColors.border}`}>
        <GraduationCap size={13} />
        {semester}
        {/* Featured / Verified badges */}
        <div className="flex items-center gap-1.5 ml-auto">
          {listing.isBoosted && (
            <span className="inline-flex items-center gap-1 bg-gold text-dark text-[10px] font-bold px-2 py-0.5 rounded-full animate-shimmer" style={{ backgroundImage: 'linear-gradient(90deg, #FDB515, #FFD466, #FDB515)' }}>
              <Zap size={10} />
              Featured
            </span>
          )}
          {listing.isVerified && (
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              <Shield size={10} />
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Image */}
      <div className="relative h-48 bg-cream">
        <img
          src={listing.imageUrl}
          alt={listing.title || listing.location.address}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {isBestMatch && (
          <span className="absolute top-3 left-3 flex items-center gap-2 bg-dark/80 text-gold text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-sm">
            <Star size={14} fill="currentColor" />
            Best Match
          </span>
        )}
        {/* Heart icon */}
        {onToggleSaved && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSaved(listing.id);
            }}
            className="absolute top-3 right-3 bg-dark/40 backdrop-blur-sm p-2 rounded-full border-none cursor-pointer hover:bg-dark/60 transition-colors"
          >
            <Heart
              size={16}
              className={isSaved ? 'text-red-500' : 'text-white'}
              fill={isSaved ? 'currentColor' : 'none'}
            />
          </button>
        )}
      </div>

      <div className="p-5">
        {/* Title */}
        {listing.title && (
          <h3 className="text-lg font-bold text-dark mb-1.5 truncate">{listing.title}</h3>
        )}

        {/* Tags row: BD/BA + amenities */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="flex items-center gap-1 text-xs text-dark/60 bg-dark/5 px-2 py-1 rounded-full">
            <Bed size={12} />
            {listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} BD`}
          </span>
          <span className="flex items-center gap-1 text-xs text-dark/60 bg-dark/5 px-2 py-1 rounded-full">
            <Bath size={12} />
            {listing.bathrooms} BA
          </span>
          {listing.furnished && (
            <span className="flex items-center gap-1 text-xs text-dark/60 bg-gold/10 px-2 py-1 rounded-full">
              <Sofa size={11} />
              Furnished
            </span>
          )}
          {listing.utilitiesIncluded && (
            <span className="flex items-center gap-1 text-xs text-dark/60 bg-gold/10 px-2 py-1 rounded-full">
              <Plug size={11} />
              Utilities
            </span>
          )}
          {listing.roommates != null && listing.roommates > 0 && (
            <span className="flex items-center gap-1 text-xs text-dark/60 bg-dark/5 px-2 py-1 rounded-full">
              <Users size={11} />
              {listing.roommates} roommate{listing.roommates !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Price + score row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-3xl font-extrabold text-dark">
              ${listing.price.toLocaleString()}
            </span>
            <span className="text-sm text-dark/40 ml-1.5">/mo</span>
          </div>
          <span className="bg-gold/15 text-dark text-sm font-bold px-4 py-1.5 rounded-full border border-gold/20">
            {scorePercent}% match
          </span>
        </div>

        {/* Address */}
        <div className="flex items-center gap-2.5 text-sm text-dark/70 mb-3">
          <MapPin size={15} className="text-gold shrink-0" />
          <span className="truncate">{listing.location.address}</span>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-2.5 text-sm text-dark/70 mb-5">
          <Calendar size={15} className="text-gold shrink-0" />
          <span>
            {formatDate(listing.availability.start)} &ndash; {formatDate(listing.availability.end)}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-dark/8">
          <span className="text-xs text-dark/50">
            {formatDistance(listing.distance)} from reference
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-dark/60">
            <User size={12} />
            {listing.listerName}
          </span>
        </div>
      </div>
    </div>
  );
}
