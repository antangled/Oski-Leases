export interface Listing {
  id: string;
  price: number;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  availability: {
    start: string;
    end: string;
  };
  imageUrl: string;
  images: string[];
  listerName: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
}

export interface EnrichedListing extends Listing {
  distance: number;
  score: number;
}

export interface FilterState {
  priceMin: number | null;
  priceMax: number | null;
  distanceMin: number | null;
  distanceMax: number | null;
  dateStart: string | null;
  dateEnd: string | null;
}

export type SortOption =
  | 'price-asc'
  | 'price-desc'
  | 'distance-asc'
  | 'distance-desc'
  | 'availability-asc'
  | 'best-match';

export interface ReferencePoint {
  lat: number;
  lng: number;
}
