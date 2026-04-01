export type VerificationTier = 'bronze' | 'silver' | 'gold';
export type TrustLevel = 'new-bear' | 'trusted-bear' | 'golden-bear';

export type AffiliationType = 'greek' | 'coop' | 'club' | 'major' | 'dorm' | 'sport';

export interface CommunityAffiliation {
  type: AffiliationType;
  name: string;
}

export interface Vouch {
  fromUserId: string;
  fromName: string;
  fromProfilePic?: string;
  note: string;
  createdAt: string;
}

export interface RoommateProfile {
  name: string;
  year?: string;
  major?: string;
  habits?: string;
}

export interface FurnishingItem {
  item: string;
  included: boolean;
}

export interface Review {
  id: string;
  listingId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerProfilePic?: string;
  rating: number;
  accuracy: number;
  communication: number;
  cleanliness: number;
  value: number;
  text: string;
  createdAt: string;
}

export interface ReviewSummary {
  averageRating: number;
  count: number;
  accuracy: number;
  communication: number;
  cleanliness: number;
  value: number;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  profilePic?: string;
  bio?: string;
  year?: string;
  major?: string;
  verificationTier: VerificationTier;
  trustLevel: TrustLevel;
  affiliations: CommunityAffiliation[];
  vouches: Vouch[];
  reviewCount: number;
  createdAt: string;
}

export interface NeighborhoodInfo {
  name: string;
  slug: string;
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  walkToCampusMin: number;
  nearestBART: string;
  nearestGrocery: string;
  vibe: string;
  avgRent: number;
}
