import type { EnrichedListing } from '../../types/listing';
import { getSemester, getSemesterColors } from '../../utils/semester';
import { Heart, Star, Zap, MapPin, Calendar, Sparkles, ShieldCheck, ShieldAlert, Award } from 'lucide-react';

interface Props {
  listing: EnrichedListing;
  rank: number;
  onClick?: () => void;
  isSaved?: boolean;
  onToggleSaved?: (id: string) => void;
  variant?: 'default' | 'featured';
}

function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function GenderBadge({ pref }: { pref?: string }) {
  if (!pref || pref === 'any') return null;
  if (pref === 'women-only')
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
        Women Only
      </span>
    );
  if (pref === 'men-only')
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
        Men Only
      </span>
    );
  return null;
}

function VerificationPill({ tier }: { tier?: string; verified?: boolean }) {
  if (tier === 'gold') return (
    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
      <Award size={9} className="text-amber-500" />
      Gold
    </span>
  );
  if (tier === 'silver') return (
    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded-full border border-slate-200">
      <ShieldCheck size={9} className="text-slate-500" />
      Verified
    </span>
  );
  if (tier === 'bronze') return (
    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-dark/40 bg-dark/5 px-1.5 py-0.5 rounded-full">
      <ShieldAlert size={9} />
      Basic
    </span>
  );
  return null;
}

function ReviewStars({ rating, count }: { rating: number; count: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-dark/50">
      <Star size={10} className="text-amber-400" fill="currentColor" />
      <span className="font-semibold text-dark/70">{rating.toFixed(1)}</span>
      <span>({count})</span>
    </span>
  );
}

export default function ListingCard({ listing, rank, onClick, isSaved, onToggleSaved, variant = 'default' }: Props) {
  const isBestMatch = rank <= 3;
  const semester = getSemester(listing.availability.start);
  const semColors = getSemesterColors(semester);
  const images = listing.images.length > 0 ? listing.images : [listing.imageUrl];
  const extraCount = images.length > 3 ? images.length - 3 : 0;

  const profilePic = listing.listerProfilePic
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.listerName)}&background=003262&color=FDB515&size=128`;

  if (variant === 'featured') {
    return (
      <div
        onClick={onClick}
        className={`bg-white rounded-2xl shadow-md border border-dark/8 hover:shadow-xl hover:shadow-gold/10 transition-all duration-300 animate-fade-in-up overflow-hidden md:col-span-2 ${onClick ? 'cursor-pointer' : ''}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Image section — 3/5 width */}
          <div className="relative md:col-span-3 h-72 md:h-auto md:min-h-[360px]">
            <ImageGrid images={images} title={listing.title || listing.location.address} />

            {/* Overlays */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${semColors.bg} ${semColors.text} border ${semColors.border}`}>
                {semester}
              </span>
              {isBestMatch && (
                <span className="inline-flex items-center gap-1.5 bg-dark/80 text-gold text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Star size={12} fill="currentColor" />
                  Best Match
                </span>
              )}
            </div>

            {listing.isBoosted && (
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 bg-gold text-dark text-[10px] font-bold px-2.5 py-1 rounded-full animate-shimmer" style={{ backgroundImage: 'linear-gradient(90deg, #FDB515, #FFD466, #FDB515)' }}>
                <Zap size={10} />
                Featured
              </span>
            )}

            {onToggleSaved && (
              <button
                onClick={(e) => { e.stopPropagation(); onToggleSaved(listing.id); }}
                className="absolute top-3 right-3 bg-dark/40 backdrop-blur-sm p-2 rounded-full border-none cursor-pointer hover:bg-dark/60 transition-colors"
              >
                <Heart size={16} className={isSaved ? 'text-red-500' : 'text-white'} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            )}

            {extraCount > 0 && (
              <span className="absolute bottom-3 right-3 bg-dark/70 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                +{extraCount} photos
              </span>
            )}
          </div>

          {/* Info section — 2/5 width */}
          <div className="md:col-span-2 p-5 flex flex-col">
            {/* Title — prominent, above everything */}
            {listing.title && (
              <h3 className="font-display text-xl font-bold text-dark leading-snug mb-3 italic">{listing.title}</h3>
            )}

            {/* Lister strip */}
            <ListerStrip listing={listing} profilePic={profilePic} />

            <div className="mt-3 flex-1">
              {/* Price */}
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-3xl font-extrabold text-dark">${listing.price.toLocaleString()}</span>
                <span className="text-sm text-dark/40">/mo</span>
                {listing.totalEstimatedCost && listing.totalEstimatedCost !== listing.price && (
                  <span className="text-[10px] text-dark/40 ml-1">~${listing.totalEstimatedCost.toLocaleString()} total</span>
                )}
              </div>

              {/* Address */}
              <div className="flex items-center gap-1.5 text-sm text-dark/60 mb-2">
                <MapPin size={13} className="text-gold shrink-0" />
                <span className="truncate">{listing.location.address}</span>
              </div>

              {/* Dates */}
              <div className="flex items-center gap-1.5 text-sm text-dark/50 mb-3">
                <Calendar size={13} className="text-gold shrink-0" />
                <span>{formatDate(listing.availability.start)} – {formatDate(listing.availability.end)}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="text-[11px] text-dark/60 bg-dark/5 px-2 py-0.5 rounded-full">
                  {listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} BD`} · {listing.bathrooms} BA
                </span>
                <GenderBadge pref={listing.genderPreference} />
                {listing.furnished && (
                  <span className="text-[11px] text-dark/60 bg-gold/10 px-2 py-0.5 rounded-full">Furnished</span>
                )}
              </div>

              {/* Bio */}
              {listing.listerBio && (
                <p className="text-xs text-dark/50 italic leading-relaxed line-clamp-2 mb-3">"{listing.listerBio}"</p>
              )}

              {/* Highlights */}
              {listing.highlights && listing.highlights.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {listing.highlights.slice(0, 3).map((h) => (
                    <span key={h} className="inline-flex items-center gap-1 text-[10px] font-medium text-gold-dark bg-gold/10 px-2 py-0.5 rounded-full border border-gold/15">
                      <Sparkles size={9} />
                      {h}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-md border border-dark/8 hover:shadow-xl hover:shadow-dark/8 hover:-translate-y-1 transition-all duration-200 animate-fade-in-up overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Multi-image grid — 65% of card */}
      <div className="relative h-72 bg-cream">
        <ImageGrid images={images} title={listing.title || listing.location.address} />

        {/* Semester pill overlay */}
        <span className={`absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${semColors.bg} ${semColors.text} border ${semColors.border}`}>
          {semester}
        </span>

        {isBestMatch && (
          <span className="absolute top-9 left-3 inline-flex items-center gap-1.5 bg-dark/80 text-gold text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
            <Star size={12} fill="currentColor" />
            Best Match
          </span>
        )}

        {listing.isBoosted && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 bg-gold text-dark text-[10px] font-bold px-2.5 py-1 rounded-full animate-shimmer" style={{ backgroundImage: 'linear-gradient(90deg, #FDB515, #FFD466, #FDB515)' }}>
            <Zap size={10} />
            Featured
          </span>
        )}

        {onToggleSaved && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSaved(listing.id); }}
            className="absolute top-3 right-3 bg-dark/40 backdrop-blur-sm p-2 rounded-full border-none cursor-pointer hover:bg-dark/60 transition-colors"
          >
            <Heart size={16} className={isSaved ? 'text-red-500' : 'text-white'} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        )}

        {extraCount > 0 && (
          <span className="absolute bottom-3 right-3 bg-dark/70 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
            +{extraCount} photos
          </span>
        )}
      </div>

      {/* Title — prominent, above profile */}
      {listing.title && (
        <div className="px-4 pt-3 pb-0">
          <h3 className="font-display text-lg font-bold text-dark leading-snug italic line-clamp-1">{listing.title}</h3>
        </div>
      )}

      {/* Lister identity strip */}
      <ListerStrip listing={listing} profilePic={profilePic} />

      {/* Compact info — 35% of card */}
      <div className="px-4 pb-4">
        {/* Price + address */}
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-2xl font-extrabold text-dark">${listing.price.toLocaleString()}</span>
          <span className="text-xs text-dark/40">/mo</span>
          <span className="ml-auto text-xs text-dark/40 truncate max-w-[140px]">
            {listing.location.address.split(',')[0]}
          </span>
        </div>

        {/* Date range */}
        <div className="flex items-center gap-1.5 text-xs text-dark/50 mb-2.5">
          <Calendar size={11} className="text-gold shrink-0" />
          <span>{formatDate(listing.availability.start)} – {formatDate(listing.availability.end)}</span>
        </div>

        {/* Key tags — max 3 */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          <span className="text-[11px] text-dark/60 bg-dark/5 px-2 py-0.5 rounded-full">
            {listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} BD`} · {listing.bathrooms} BA
          </span>
          <GenderBadge pref={listing.genderPreference} />
          {listing.furnished && (
            <span className="text-[11px] text-dark/60 bg-gold/10 px-2 py-0.5 rounded-full">Furnished</span>
          )}
        </div>

        {/* Bio snippet */}
        {listing.listerBio && (
          <p className="text-[11px] text-dark/45 italic truncate mb-2">"{listing.listerBio}"</p>
        )}

        {/* Highlights */}
        {listing.highlights && listing.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {listing.highlights.slice(0, 2).map((h) => (
              <span key={h} className="inline-flex items-center gap-0.5 text-[10px] font-medium text-gold-dark bg-gold/8 px-1.5 py-0.5 rounded-full">
                <Sparkles size={8} />
                {h}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ───────────────────── */

function ListerStrip({ listing, profilePic }: { listing: EnrichedListing; profilePic: string }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-dark/5">
      <img
        src={profilePic}
        alt={listing.listerName}
        className="w-8 h-8 rounded-full object-cover border-2 border-gold/30"
      />
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        <span className="text-sm font-semibold text-dark truncate">{listing.listerName}</span>
        {listing.listerRelationship && (
          <span className="text-[9px] font-semibold text-dark/50 bg-dark/5 px-1.5 py-0.5 rounded-full shrink-0">
            {listing.listerRelationship}
          </span>
        )}
        <VerificationPill tier={listing.verificationTier} verified={listing.isVerified} />
      </div>
      {/* Review rating */}
      {listing.reviewSummary && listing.reviewSummary.count > 0 && (
        <ReviewStars rating={listing.reviewSummary.averageRating} count={listing.reviewSummary.count} />
      )}
      {/* Vouch count */}
      {listing.vouchCount != null && listing.vouchCount > 0 && (
        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full font-medium shrink-0">
          {listing.vouchCount} vouch{listing.vouchCount !== 1 ? 'es' : ''}
        </span>
      )}
    </div>
  );
}

function ImageGrid({ images, title }: { images: string[]; title: string }) {
  if (images.length >= 3) {
    return (
      <div className="grid grid-cols-3 grid-rows-2 gap-0.5 h-full w-full">
        <img src={images[0]} alt={title} className="col-span-2 row-span-2 w-full h-full object-cover" loading="lazy" />
        <img src={images[1]} alt={`${title} 2`} className="col-span-1 row-span-1 w-full h-full object-cover" loading="lazy" />
        <img src={images[2]} alt={`${title} 3`} className="col-span-1 row-span-1 w-full h-full object-cover" loading="lazy" />
      </div>
    );
  }
  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-0.5 h-full w-full">
        <img src={images[0]} alt={title} className="w-full h-full object-cover" loading="lazy" />
        <img src={images[1]} alt={`${title} 2`} className="w-full h-full object-cover" loading="lazy" />
      </div>
    );
  }
  return (
    <img src={images[0]} alt={title} className="w-full h-full object-cover" loading="lazy" />
  );
}
