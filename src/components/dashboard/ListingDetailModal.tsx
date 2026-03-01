import { useState, useEffect } from 'react';
import type { EnrichedListing } from '../../types/listing';
import { formatDistance } from '../../utils/distance';
import { getSemester, getSemesterColors } from '../../utils/semester';
import {
  X, ChevronLeft, ChevronRight, MapPin, Calendar,
  GraduationCap, Mail, Phone, User, Star, ChevronDown, ChevronUp,
} from 'lucide-react';

interface Props {
  listing: EnrichedListing;
  onClose: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function ListingDetailModal({ listing, onClose }: Props) {
  const [currentImage, setCurrentImage] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);

  const images = listing.images.length > 0 ? listing.images : [listing.imageUrl];
  const semester = getSemester(listing.availability.start);
  const semColors = getSemesterColors(semester);
  const scorePercent = Math.round(listing.score * 100);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const prevImage = () => setCurrentImage((i) => (i - 1 + images.length) % images.length);
  const nextImage = () => setCurrentImage((i) => (i + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-50 bg-dark/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-in shadow-2xl">
        {/* Image carousel */}
        <div className="relative">
          <img
            src={images[currentImage]}
            alt={listing.location.address}
            className="w-full h-72 object-cover"
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-dark/60 text-white p-2 rounded-full backdrop-blur-sm hover:bg-dark/80 transition-colors cursor-pointer border-none"
          >
            <X size={18} />
          </button>

          {/* Nav arrows */}
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

          {/* Dot indicators */}
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

          {/* Best match badge */}
          {scorePercent >= 70 && (
            <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-dark/70 text-teal text-sm font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Star size={14} fill="currentColor" />
              Best Match
            </span>
          )}
        </div>

        {/* Semester banner */}
        <div className={`px-6 py-2.5 text-xs font-bold tracking-wide uppercase flex items-center gap-2 ${semColors.bg} ${semColors.text} border-b ${semColors.border}`}>
          <GraduationCap size={14} />
          {semester}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Price + score row */}
          <div className="flex items-center justify-between mb-5">
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
            <MapPin size={16} className="text-teal shrink-0" />
            <span>{listing.location.address}</span>
          </div>

          {/* Distance */}
          <div className="text-xs text-dark/50 ml-[26px] mb-4">
            {formatDistance(listing.distance)} from reference point
          </div>

          {/* Dates */}
          <div className="flex items-center gap-2.5 text-sm text-dark/70 mb-5">
            <Calendar size={16} className="text-teal shrink-0" />
            <span>
              {formatDate(listing.availability.start)} &ndash; {formatDate(listing.availability.end)}
            </span>
          </div>

          {/* Contact info */}
          <div className="bg-mint/50 rounded-xl p-4 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <User size={16} className="text-teal-dark" />
              <span className="text-sm font-semibold text-dark">{listing.listerName}</span>
            </div>
            {listing.contactEmail && (
              <div className="flex items-center gap-2.5 text-sm text-dark/70 mb-2">
                <Mail size={14} className="text-teal shrink-0" />
                <span>{listing.contactEmail}</span>
              </div>
            )}
            {listing.contactPhone && (
              <div className="flex items-center gap-2.5 text-sm text-dark/70">
                <Phone size={14} className="text-teal shrink-0" />
                <span>{listing.contactPhone}</span>
              </div>
            )}
          </div>

          {/* Description / Specs */}
          {listing.description && (
            <div className="border border-dark/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setDescExpanded(!descExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 bg-dark/3 hover:bg-dark/5 transition-colors cursor-pointer border-none text-left"
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
        </div>
      </div>
    </div>
  );
}
