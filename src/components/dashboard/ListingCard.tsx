import type { EnrichedListing } from '../../types/listing';
import { formatDistance } from '../../utils/distance';
import { getSemester, getSemesterColors } from '../../utils/semester';
import { MapPin, Calendar, Star, GraduationCap, User } from 'lucide-react';

interface Props {
  listing: EnrichedListing;
  rank: number;
  onClick?: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ListingCard({ listing, rank, onClick }: Props) {
  const isBestMatch = rank <= 3;
  const scorePercent = Math.round(listing.score * 100);
  const semester = getSemester(listing.availability.start);
  const semColors = getSemesterColors(semester);

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-md border border-dark/10 hover:shadow-xl hover:shadow-teal/10 hover:-translate-y-1 transition-all duration-200 animate-fade-in-up overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Semester banner */}
      <div className={`px-4 py-2 text-xs font-bold tracking-wide uppercase flex items-center gap-2 ${semColors.bg} ${semColors.text} border-b ${semColors.border}`}>
        <GraduationCap size={13} />
        {semester}
      </div>

      {/* Image */}
      <div className="relative h-48 bg-mint">
        <img
          src={listing.imageUrl}
          alt={listing.location.address}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {isBestMatch && (
          <span className="absolute top-3 right-3 flex items-center gap-2 bg-dark/70 text-teal text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-sm">
            <Star size={14} fill="currentColor" />
            Best Match
          </span>
        )}
      </div>

      <div className="p-6">
        {/* Price + score row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-3xl font-extrabold text-dark">
              ${listing.price.toLocaleString()}
            </span>
            <span className="text-sm text-dark/40 ml-1.5">/mo</span>
          </div>
          <span className="bg-teal/15 text-teal-dark text-sm font-bold px-4 py-1.5 rounded-full">
            {scorePercent}% match
          </span>
        </div>

        {/* Address */}
        <div className="flex items-center gap-2.5 text-sm text-dark/70 mb-3">
          <MapPin size={15} className="text-teal shrink-0" />
          <span className="truncate">{listing.location.address}</span>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-2.5 text-sm text-dark/70 mb-5">
          <Calendar size={15} className="text-teal shrink-0" />
          <span>
            {formatDate(listing.availability.start)} &ndash; {formatDate(listing.availability.end)}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-mint">
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
