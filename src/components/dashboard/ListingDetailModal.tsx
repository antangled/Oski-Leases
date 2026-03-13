import { useState, useEffect } from 'react';
import type { EnrichedListing } from '../../types/listing';
import { formatDistance } from '../../utils/distance';
import { getSemester, getSemesterColors } from '../../utils/semester';
import {
  X, ChevronLeft, ChevronRight, MapPin, Calendar,
  GraduationCap, Mail, Phone, User, Star, ChevronDown, ChevronUp,
  Heart, Bed, Bath, ClipboardList, Sofa, Plug, Users, Zap, Shield, Send,
} from 'lucide-react';

interface Props {
  listing: EnrichedListing;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSaved?: (id: string) => void;
}

function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function ListingDetailModal({ listing, onClose, isSaved, onToggleSaved }: Props) {
  const [currentImage, setCurrentImage] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);
  const [reqsExpanded, setReqsExpanded] = useState(false);

  const images = listing.images.length > 0 ? listing.images : [listing.imageUrl];
  const semester = getSemester(listing.availability.start);
  const semColors = getSemesterColors(semester);
  const scorePercent = Math.round(listing.score * 100);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const prevImage = () => setCurrentImage((i) => (i - 1 + images.length) % images.length);
  const nextImage = () => setCurrentImage((i) => (i + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm flex items-start justify-center p-4 pt-16 pb-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[calc(100vh-6rem)] overflow-y-auto animate-modal-in shadow-2xl">
        {/* Image carousel */}
        <div className="relative">
          <img
            src={images[currentImage]}
            alt={listing.title || listing.location.address}
            className="w-full h-72 object-cover"
          />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-dark/60 text-white p-2 rounded-full backdrop-blur-sm hover:bg-dark/80 transition-colors cursor-pointer border-none"
          >
            <X size={18} />
          </button>

          {onToggleSaved && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleSaved(listing.id); }}
              className="absolute top-3 right-14 bg-dark/60 backdrop-blur-sm p-2 rounded-full border-none cursor-pointer hover:bg-dark/80 transition-colors"
            >
              <Heart
                size={18}
                className={isSaved ? 'text-red-500' : 'text-white'}
                fill={isSaved ? 'currentColor' : 'none'}
              />
            </button>
          )}

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-dark/50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-dark/70 transition-colors cursor-pointer border-none"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-dark/50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-dark/70 transition-colors cursor-pointer border-none"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrentImage(i); }}
                  className={`w-2 h-2 rounded-full border-none cursor-pointer transition-all ${
                    i === currentImage ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {scorePercent >= 70 && (
            <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-dark/80 text-gold text-sm font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Star size={14} fill="currentColor" />
              Best Match
            </span>
          )}
        </div>

        {/* Semester banner + badges */}
        <div className={`px-6 py-2.5 text-xs font-bold tracking-wide uppercase flex items-center gap-2 ${semColors.bg} ${semColors.text} border-b ${semColors.border}`}>
          <GraduationCap size={14} />
          {semester}
          <div className="flex items-center gap-1.5 ml-auto">
            {listing.isBoosted && (
              <span className="inline-flex items-center gap-1 bg-gold text-dark text-[10px] font-bold px-2 py-0.5 rounded-full">
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

        {/* Content */}
        <div className="p-6">
          {listing.title && (
            <h2 className="text-xl font-bold text-dark mb-2">{listing.title}</h2>
          )}

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="flex items-center gap-1 text-xs text-dark/60 bg-dark/5 px-2.5 py-1 rounded-full">
              <Bed size={13} />
              {listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} BD`}
            </span>
            <span className="flex items-center gap-1 text-xs text-dark/60 bg-dark/5 px-2.5 py-1 rounded-full">
              <Bath size={13} />
              {listing.bathrooms} BA
            </span>
            {listing.furnished && (
              <span className="flex items-center gap-1 text-xs text-dark/60 bg-gold/10 px-2.5 py-1 rounded-full border border-gold/15">
                <Sofa size={12} />
                Furnished
              </span>
            )}
            {listing.utilitiesIncluded && (
              <span className="flex items-center gap-1 text-xs text-dark/60 bg-gold/10 px-2.5 py-1 rounded-full border border-gold/15">
                <Plug size={12} />
                Utilities Included
              </span>
            )}
            {listing.roommates != null && listing.roommates > 0 && (
              <span className="flex items-center gap-1 text-xs text-dark/60 bg-dark/5 px-2.5 py-1 rounded-full">
                <Users size={12} />
                {listing.roommates} roommate{listing.roommates !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Price + score row */}
          <div className="flex items-center justify-between mb-5">
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
            <MapPin size={16} className="text-gold shrink-0" />
            <span>{listing.location.address}</span>
          </div>

          <div className="text-xs text-dark/50 ml-[26px] mb-4">
            {formatDistance(listing.distance)} from reference point
          </div>

          {/* Dates */}
          <div className="flex items-center gap-2.5 text-sm text-dark/70 mb-5">
            <Calendar size={16} className="text-gold shrink-0" />
            <span>
              {formatDate(listing.availability.start)} &ndash; {formatDate(listing.availability.end)}
            </span>
          </div>

          {/* Contact info */}
          <div className="bg-cream rounded-xl p-4 mb-5 border border-dark/5">
            <div className="flex items-center gap-2 mb-3">
              <User size={16} className="text-dark" />
              <span className="text-sm font-semibold text-dark">{listing.listerName}</span>
              {listing.listerRelationship && (
                <span className="text-[10px] font-semibold text-dark bg-gold/20 px-2 py-0.5 rounded-full">
                  {listing.listerRelationship}
                </span>
              )}
            </div>
            {listing.contactEmail && (
              <div className="flex items-center gap-2.5 text-sm text-dark/70 mb-2">
                <Mail size={14} className="text-gold shrink-0" />
                <span>{listing.contactEmail}</span>
              </div>
            )}
            {listing.contactPhone && (
              <div className="flex items-center gap-2.5 text-sm text-dark/70">
                <Phone size={14} className="text-gold shrink-0" />
                <span>{listing.contactPhone}</span>
              </div>
            )}
          </div>

          {/* Inquiry Button */}
          {listing.contactEmail && (
            <a
              href={`mailto:${listing.contactEmail}?subject=Interested in: ${listing.title || listing.location.address}&body=Hi ${listing.listerName},%0D%0A%0D%0AI'm interested in your listing "${listing.title || listing.location.address}" on OskiLease.%0D%0A%0D%0ACould we arrange a viewing?%0D%0A%0D%0AThanks!`}
              className="flex items-center justify-center gap-2 w-full py-3 bg-gold text-dark font-semibold rounded-xl hover:bg-gold-dark transition-colors no-underline mb-5"
              onClick={(e) => e.stopPropagation()}
            >
              <Send size={16} />
              I'm Interested — Contact Lister
            </a>
          )}

          {/* Description */}
          {listing.description && (
            <div className="border border-dark/10 rounded-xl overflow-hidden mb-3">
              <button
                onClick={() => setDescExpanded(!descExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 bg-dark/[0.02] hover:bg-dark/[0.04] transition-colors cursor-pointer border-none text-left"
              >
                <span className="text-sm font-semibold text-dark">Details & Specs</span>
                {descExpanded ? <ChevronUp size={16} className="text-dark/40" /> : <ChevronDown size={16} className="text-dark/40" />}
              </button>
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  descExpanded ? 'max-h-64' : 'max-h-0'
                }`}
              >
                <div className="px-4 py-3 overflow-y-auto max-h-56">
                  <p className="text-sm text-dark/70 leading-relaxed whitespace-pre-wrap">
                    {listing.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rental Requirements */}
          {listing.rentalRequirements && (
            <div className="border border-dark/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setReqsExpanded(!reqsExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 bg-dark/[0.02] hover:bg-dark/[0.04] transition-colors cursor-pointer border-none text-left"
              >
                <span className="text-sm font-semibold text-dark flex items-center gap-2">
                  <ClipboardList size={14} className="text-gold" />
                  Rental Requirements
                </span>
                {reqsExpanded ? <ChevronUp size={16} className="text-dark/40" /> : <ChevronDown size={16} className="text-dark/40" />}
              </button>
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  reqsExpanded ? 'max-h-64' : 'max-h-0'
                }`}
              >
                <div className="px-4 py-3 overflow-y-auto max-h-56">
                  <p className="text-sm text-dark/70 leading-relaxed whitespace-pre-wrap">
                    {listing.rentalRequirements}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
