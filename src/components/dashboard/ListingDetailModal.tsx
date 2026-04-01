import { useState, useEffect, lazy, Suspense } from 'react';
import type { EnrichedListing } from '../../types/listing';
import { formatDistance } from '../../utils/distance';
import { getSemester, getSemesterColors } from '../../utils/semester';
import { getScamFlags } from '../../utils/scamDetection';
import { getReviewsForListing, getReviewSummary } from '../../data/seedReviews';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { seedListings } from '../../data/seedListings';
import {
  X, ChevronLeft, ChevronRight, MapPin, Calendar,
  Mail, Phone, Star, ChevronDown, ChevronUp,
  Heart, Bed, Bath, ClipboardList, Sofa, Plug, Users, Zap, Shield, Send,
  Sparkles, PawPrint, Maximize2, ShieldCheck, Award, ShieldAlert,
  AlertTriangle, DollarSign, Footprints, Train, ShoppingCart,
  FileText, UserCheck,
} from 'lucide-react';
import { getNeighborhood } from '../../utils/neighborhoodLookup';
import { computeTrustPath } from '../../utils/trustPath';
import TrustPathDisplay from '../trust/TrustPathDisplay';
import NarrativeRefSection from '../trust/NarrativeRefSection';
import AskForIntroButton from '../trust/AskForIntroButton';
import ConversationStarters from '../trust/ConversationStarters';

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
  const [descExpanded, setDescExpanded] = useState(true);
  const [reqsExpanded, setReqsExpanded] = useState(true);
  const [reviewsExpanded, setReviewsExpanded] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);

  const { profile, allProfiles, getProfileById } = useUserProfile();

  const images = listing.images.length > 0 ? listing.images : [listing.imageUrl];
  const semester = getSemester(listing.availability.start);
  const semColors = getSemesterColors(semester);
  const scorePercent = Math.round(listing.score * 100);

  const profilePic = listing.listerProfilePic
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.listerName)}&background=003262&color=FDB515&size=128`;

  // Trust data
  const listerProfile = listing.listerId ? getProfileById(listing.listerId) : null;
  const trustPath = listing.listerId ? computeTrustPath(profile, listing.listerId, allProfiles) : null;
  const scamFlags = getScamFlags(listing, seedListings);
  const reviews = getReviewsForListing(listing.id);
  const reviewSummary = getReviewSummary(listing.id);
  const neighborhood = getNeighborhood(listing.location.lat, listing.location.lng);

  // Shared affiliations
  const sharedAffiliations = profile?.affiliations && listing.listerAffiliations
    ? profile.affiliations.filter(ua => listing.listerAffiliations!.includes(ua.name))
    : [];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
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
      className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm flex items-start justify-center p-4 pt-12 pb-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[calc(100vh-5rem)] overflow-y-auto animate-modal-in shadow-2xl">
        {/* Main image */}
        <div className="relative">
          <img
            src={images[currentImage]}
            alt={listing.title || listing.location.address}
            className="w-full h-80 object-cover"
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
              <Heart size={18} className={isSaved ? 'text-red-500' : 'text-white'} fill={isSaved ? 'currentColor' : 'none'} />
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

          {scorePercent >= 70 && (
            <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-dark/80 text-gold text-sm font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Star size={14} fill="currentColor" />
              Best Match
            </span>
          )}

          {/* Semester + badges overlay */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${semColors.bg} ${semColors.text} border ${semColors.border}`}>
              {semester}
            </span>
            {listing.isBoosted && (
              <span className="inline-flex items-center gap-1 bg-gold text-dark text-[10px] font-bold px-2 py-0.5 rounded-full">
                <Zap size={10} /> Featured
              </span>
            )}
            {listing.verificationTier === 'gold' && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                <Award size={10} /> Gold Verified
              </span>
            )}
            {listing.verificationTier === 'silver' && (
              <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
                <ShieldCheck size={10} /> Verified
              </span>
            )}
            {!listing.verificationTier && listing.isVerified && (
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <Shield size={10} /> Verified
              </span>
            )}
          </div>
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-1.5 px-4 py-2.5 overflow-x-auto bg-dark/[0.02]">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                  i === currentImage ? 'border-gold ring-1 ring-gold/30' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Scam warnings */}
        {scamFlags.length > 0 && (
          <div className={`mx-6 mt-4 p-3 rounded-xl border ${scamFlags.some(f => f.severity === 'danger') ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={14} className={scamFlags.some(f => f.severity === 'danger') ? 'text-red-500' : 'text-amber-500'} />
              <span className="text-xs font-bold text-dark">
                {scamFlags.length} potential concern{scamFlags.length !== 1 ? 's' : ''}
              </span>
            </div>
            {scamFlags.map((flag, i) => (
              <p key={i} className="text-xs text-dark/60 mt-1">
                <span className="font-semibold">{flag.message}:</span> {flag.detail}
              </p>
            ))}
          </div>
        )}

        {/* Shared affiliation banner */}
        {sharedAffiliations.length > 0 && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-gold/10 border border-gold/20">
            <div className="flex items-center gap-2">
              <Users size={14} className="text-gold shrink-0" />
              <span className="text-xs font-semibold text-dark">
                You and {listing.listerName} are both in{' '}
                <span className="text-gold-dark">
                  {sharedAffiliations.map(a => a.name).join(', ')}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {listing.title && (
            <h2 className="text-xl font-bold text-dark mb-2">{listing.title}</h2>
          )}

          {/* Price + score row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-3xl font-extrabold text-dark">
                ${listing.price.toLocaleString()}
              </span>
              <span className="text-sm text-dark/40 ml-1.5">/mo</span>
              {listing.totalEstimatedCost && listing.totalEstimatedCost !== listing.price && (
                <span className="text-xs text-dark/40 ml-2">~${listing.totalEstimatedCost.toLocaleString()} total/mo</span>
              )}
            </div>
            <span className="bg-gold/15 text-dark text-sm font-bold px-4 py-1.5 rounded-full border border-gold/20">
              {scorePercent}% match
            </span>
          </div>

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
                <Sofa size={12} /> Furnished
              </span>
            )}
            {listing.utilitiesIncluded && (
              <span className="flex items-center gap-1 text-xs text-dark/60 bg-gold/10 px-2.5 py-1 rounded-full border border-gold/15">
                <Plug size={12} /> Utilities Included
              </span>
            )}
            {listing.roommates != null && listing.roommates > 0 && (
              <span className="flex items-center gap-1 text-xs text-dark/60 bg-dark/5 px-2.5 py-1 rounded-full">
                <Users size={12} />
                {listing.roommates} roommate{listing.roommates !== 1 ? 's' : ''}
              </span>
            )}
            {listing.genderPreference && listing.genderPreference !== 'any' && (
              <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                listing.genderPreference === 'women-only'
                  ? 'bg-pink-50 text-pink-700 border-pink-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {listing.genderPreference === 'women-only' ? 'Women Only' : 'Men Only'}
              </span>
            )}
            {listing.petPolicy && listing.petPolicy !== 'no-pets' && (
              <span className="flex items-center gap-1 text-xs text-dark/60 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <PawPrint size={12} />
                {listing.petPolicy === 'allowed' ? 'Pets OK' : 'Pets Negotiable'}
              </span>
            )}
            {listing.landlordApprovalStatus === 'approved' && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <UserCheck size={12} /> Landlord Approved
              </span>
            )}
            {listing.landlordApprovalStatus === 'pending' && (
              <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <AlertTriangle size={12} /> Landlord Approval Pending
              </span>
            )}
          </div>

          {/* Room details grid */}
          {(listing.roomSize || listing.petPolicy) && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {listing.roomSize && (
                <div className="bg-cream rounded-lg p-3 border border-dark/5">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-dark/40 uppercase tracking-wide mb-1">
                    <Maximize2 size={10} /> Room Size
                  </div>
                  <p className="text-sm font-semibold text-dark">{listing.roomSize}</p>
                </div>
              )}
              {listing.petPolicy && (
                <div className="bg-cream rounded-lg p-3 border border-dark/5">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-dark/40 uppercase tracking-wide mb-1">
                    <PawPrint size={10} /> Pet Policy
                  </div>
                  <p className="text-sm font-semibold text-dark capitalize">{listing.petPolicy.replace('-', ' ')}</p>
                </div>
              )}
            </div>
          )}

          {/* Furnishing checklist */}
          {listing.furnishingChecklist && listing.furnishingChecklist.length > 0 && (
            <div className="mb-5">
              <h4 className="text-xs font-semibold text-dark/40 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Sofa size={11} className="text-gold" /> What's Included
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {listing.furnishingChecklist.map((item) => (
                  <div key={item.item} className={`flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg ${item.included ? 'bg-emerald-50 text-emerald-700' : 'bg-dark/3 text-dark/35'}`}>
                    <span>{item.included ? '✓' : '✗'}</span>
                    <span className="capitalize">{item.item.replace('-', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Highlights */}
          {listing.highlights && listing.highlights.length > 0 && (
            <div className="mb-5">
              <h4 className="text-xs font-semibold text-dark/40 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Sparkles size={11} className="text-gold" /> Highlights
              </h4>
              <div className="flex flex-wrap gap-2">
                {listing.highlights.map((h) => (
                  <span key={h} className="inline-flex items-center gap-1 text-xs font-medium text-gold-dark bg-gold/10 px-3 py-1.5 rounded-full border border-gold/15">
                    <Sparkles size={10} />
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Neighborhood info */}
          {neighborhood && (
            <div className="bg-cream rounded-xl p-4 mb-5 border border-dark/5">
              <h4 className="text-xs font-semibold text-dark/40 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <MapPin size={11} className="text-gold" /> {neighborhood.name} Neighborhood
              </h4>
              <p className="text-sm text-dark/60 mb-3">{neighborhood.vibe}</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-xs text-dark/60">
                  <Footprints size={12} className="text-gold shrink-0" />
                  {neighborhood.walkToCampusMin} min walk to campus
                </div>
                <div className="flex items-center gap-2 text-xs text-dark/60">
                  <Train size={12} className="text-gold shrink-0" />
                  {neighborhood.nearestBART}
                </div>
                <div className="flex items-center gap-2 text-xs text-dark/60">
                  <ShoppingCart size={12} className="text-gold shrink-0" />
                  {neighborhood.nearestGrocery}
                </div>
                <div className="flex items-center gap-2 text-xs text-dark/60">
                  <DollarSign size={12} className="text-gold shrink-0" />
                  Avg. ${neighborhood.avgRent}/mo
                </div>
              </div>
            </div>
          )}

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

          {/* Roommate profiles */}
          {listing.roommateProfiles && listing.roommateProfiles.length > 0 && (
            <div className="mb-5">
              <h4 className="text-xs font-semibold text-dark/40 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Users size={11} className="text-gold" /> Current Roommates
              </h4>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {listing.roommateProfiles.map((rm, i) => (
                  <div key={i} className="bg-cream rounded-xl p-3 border border-dark/5 min-w-[180px] shrink-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(rm.name)}&background=003262&color=FDB515&size=64`}
                        alt={rm.name}
                        className="w-7 h-7 rounded-full"
                      />
                      <span className="text-sm font-semibold text-dark">{rm.name}</span>
                    </div>
                    {rm.year && rm.major && (
                      <p className="text-[11px] text-dark/50">{rm.year}, {rm.major}</p>
                    )}
                    {rm.habits && (
                      <p className="text-[11px] text-dark/40 italic mt-1">{rm.habits}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trust path — your connection to this lister */}
          {trustPath && trustPath.strength !== 'none' && (
            <div className="mb-5">
              <TrustPathDisplay trustPath={trustPath} />
            </div>
          )}

          {/* Ask for intro — if friend-of-friend */}
          {trustPath && (
            <div className="mb-5">
              <AskForIntroButton trustPath={trustPath} listerName={listing.listerName} />
            </div>
          )}

          {/* Lister profile section */}
          <div className="bg-cream rounded-xl p-4 mb-5 border border-dark/5">
            <div className="flex items-start gap-3">
              <img
                src={profilePic}
                alt={listing.listerName}
                className={`w-12 h-12 rounded-full object-cover shrink-0 border-2 ${
                  trustPath?.strength === 'mutual' ? 'border-amber-400 ring-2 ring-amber-200/50' :
                  trustPath?.strength === 'connected' ? 'border-amber-300 ring-1 ring-amber-200/30' :
                  'border-gold/30'
                }`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-bold text-dark">{listing.listerName}</span>
                  {listing.listerRelationship && (
                    <span className="text-[10px] font-semibold text-dark bg-gold/20 px-2 py-0.5 rounded-full">
                      {listing.listerRelationship}
                    </span>
                  )}
                </div>
                {/* Affiliations as shared context */}
                {listing.listerAffiliations && listing.listerAffiliations.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {listing.listerAffiliations.map(a => {
                      const isShared = sharedAffiliations.some(sa => sa.name === a);
                      return (
                        <span key={a} className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                          isShared ? 'text-amber-700 bg-amber-50 border border-amber-200' : 'text-dark/40 bg-dark/5'
                        }`}>
                          {isShared && '* '}{a}
                        </span>
                      );
                    })}
                  </div>
                )}
                {/* Named vouches — not just a count */}
                {listerProfile && listerProfile.vouches.length > 0 && (
                  <div className="mb-2">
                    <p className="text-[11px] text-dark/50 mb-1">People who know {listing.listerName.split(' ')[0]}:</p>
                    <div className="flex flex-wrap gap-1">
                      {listerProfile.vouches.map(v => (
                        <span key={v.fromUserId} className="inline-flex items-center gap-1 text-[10px] text-dark/60 bg-white px-2 py-0.5 rounded-full border border-dark/10">
                          <img
                            src={v.fromProfilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(v.fromName)}&background=003262&color=FDB515&size=32`}
                            alt={v.fromName}
                            className="w-3.5 h-3.5 rounded-full"
                          />
                          {v.fromName.split(' ')[0]}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Apartment story — the human narrative */}
                {listerProfile?.apartmentStory && (
                  <div className="mb-2">
                    <p className="text-[10px] font-semibold text-dark/40 uppercase mb-1">About this place</p>
                    <p className="text-sm text-dark/60 leading-relaxed">{listerProfile.apartmentStory}</p>
                  </div>
                )}
                {/* What they're looking for */}
                {listerProfile?.idealSubletter && (
                  <div className="mb-2">
                    <p className="text-[10px] font-semibold text-dark/40 uppercase mb-1">Looking for</p>
                    <p className="text-sm text-dark/60 leading-relaxed italic">"{listerProfile.idealSubletter}"</p>
                  </div>
                )}
                {/* Conversation starters */}
                {listerProfile?.conversationStarters && (
                  <div className="mb-2">
                    <ConversationStarters starters={listerProfile.conversationStarters} listerName={listing.listerName} />
                  </div>
                )}
                <div className="space-y-1.5 mt-3 pt-3 border-t border-dark/5">
                  {listing.contactEmail && (
                    <div className="flex items-center gap-2 text-sm text-dark/70">
                      <Mail size={13} className="text-gold shrink-0" />
                      <span>{listing.contactEmail}</span>
                    </div>
                  )}
                  {listing.contactPhone && (
                    <div className="flex items-center gap-2 text-sm text-dark/70">
                      <Phone size={13} className="text-gold shrink-0" />
                      <span>{listing.contactPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Narrative references — what past subleasees say (replaces star ratings) */}
          {listerProfile?.narrativeRefs && listerProfile.narrativeRefs.length > 0 && (
            <div className="mb-5">
              <NarrativeRefSection refs={listerProfile.narrativeRefs} listerName={listing.listerName} />
            </div>
          )}

          {/* Inquiry Buttons */}
          {listing.contactEmail && (
            <div className="flex gap-3 mb-3">
              <a
                href={`mailto:${listing.contactEmail}?subject=Interested in: ${listing.title || listing.location.address}&body=Hi ${listing.listerName},%0D%0A%0D%0AI'm interested in your listing "${listing.title || listing.location.address}" on OskiLease.%0D%0A%0D%0ACould we arrange a viewing?%0D%0A%0D%0AThanks!`}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gold text-dark font-semibold rounded-xl hover:bg-gold-dark transition-colors no-underline"
                onClick={(e) => e.stopPropagation()}
              >
                <Send size={16} />
                Contact Lister
              </a>
              <a
                href={`mailto:${listing.contactEmail}?subject=Video Tour Request: ${listing.title || listing.location.address}&body=Hi ${listing.listerName},%0D%0A%0D%0AI'm interested in your listing "${listing.title || listing.location.address}" on OskiLease but I'm unable to visit in person.%0D%0A%0D%0AWould you be available for a quick video tour (Zoom/FaceTime/Google Meet)?%0D%0A%0D%0AI'm flexible on timing. Thanks!`}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-dark/5 text-dark font-semibold rounded-xl hover:bg-dark/10 transition-colors no-underline"
                onClick={(e) => e.stopPropagation()}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                Video Tour
              </a>
            </div>
          )}

          {/* Generate Agreement button */}
          <button
            onClick={() => setShowAgreement(true)}
            className="flex items-center justify-center gap-2 w-full py-3 bg-dark/5 text-dark font-semibold rounded-xl hover:bg-dark/10 transition-colors cursor-pointer border-none mb-5"
          >
            <FileText size={16} />
            Generate Sublease Agreement
          </button>

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

      {/* Agreement modal */}
      {showAgreement && (
        <AgreementModalInline listing={listing} onClose={() => setShowAgreement(false)} />
      )}
    </div>
  );
}

/* Inline agreement preview (simplified — full version in separate component) */
function AgreementModalInline({ listing, onClose }: { listing: EnrichedListing; onClose: () => void }) {
  const [sublesseeName, setSublesseeName] = useState('');

  const agreementText = `SUBLEASE AGREEMENT

This Sublease Agreement is entered into on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.

PARTIES:
Sublessor: ${listing.listerName}
Sublessee: ${sublesseeName || '[Sublessee Name]'}

PREMISES:
${listing.location.address}
${listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} Bedroom(s)`}, ${listing.bathrooms} Bathroom(s)

TERM:
From: ${formatDate(listing.availability.start)}
To: ${formatDate(listing.availability.end)}

RENT:
Monthly Rent: $${listing.price.toLocaleString()}
Security Deposit: $${listing.price.toLocaleString()} (one month, per CA Civil Code §1950.5 / AB 12)
${listing.utilitiesIncluded ? 'Utilities: Included in rent' : 'Utilities: Not included — sublessee responsible for proportional share'}

TERMS & CONDITIONS:
1. Sublessee shall comply with all terms of the master lease.
2. No modifications to the premises without sublessor's written consent.
3. ${listing.petPolicy === 'no-pets' ? 'No pets allowed.' : listing.petPolicy === 'allowed' ? 'Pets allowed with prior approval.' : 'Pet policy negotiable — discuss with sublessor.'}
4. Sublessee shall maintain the premises in good condition.
5. Security deposit shall be returned within 21 days of move-out per California law, minus deductions for damages beyond normal wear and tear.

BERKELEY RENT BOARD NOTICE:
This sublease is subject to the City of Berkeley Rent Stabilization Ordinance. The sublessor may not charge the sublessee more than a proportionate share of the rent.

SIGNATURES:

Sublessor: _________________________ Date: _________
${listing.listerName}

Sublessee: _________________________ Date: _________
${sublesseeName || '[Sublessee Name]'}`;

  return (
    <div
      className="fixed inset-0 z-[60] bg-dark/70 backdrop-blur-sm flex items-start justify-center p-4 pt-8 pb-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[calc(100vh-4rem)] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-dark flex items-center gap-2">
              <FileText size={20} className="text-gold" />
              Sublease Agreement
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-dark/5 cursor-pointer border-none bg-transparent">
              <X size={18} className="text-dark/40" />
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-dark/60 mb-1.5">Sublessee Name</label>
            <input
              type="text"
              value={sublesseeName}
              onChange={(e) => setSublesseeName(e.target.value)}
              placeholder="Enter sublessee's full name"
              className="w-full px-3 py-2 text-sm border border-dark/12 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 bg-white text-dark"
            />
          </div>

          <div className="bg-cream rounded-xl p-6 mb-4 border border-dark/5 font-mono text-xs text-dark/70 whitespace-pre-wrap leading-relaxed">
            {agreementText}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                  printWindow.document.write(`<html><head><title>Sublease Agreement</title><style>body { font-family: monospace; font-size: 12px; padding: 40px; white-space: pre-wrap; line-height: 1.8; }</style></head><body>${agreementText}</body></html>`);
                  printWindow.document.close();
                  printWindow.print();
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gold text-dark font-semibold rounded-xl hover:bg-gold-dark transition-colors cursor-pointer border-none"
            >
              Print Agreement
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-dark/5 text-dark font-semibold rounded-xl hover:bg-dark/10 transition-colors cursor-pointer border-none"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
