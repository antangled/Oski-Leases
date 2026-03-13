import type { Listing } from '../types/listing';
import { supabase } from './supabase';
import { seedListings } from '../data/seedListings';
import { loadUserListings, saveUserListings } from '../utils/storage';

/** Flat DB row shape (no nested objects) */
interface ListingRow {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  lat: number;
  lng: number;
  availability_start: string;
  availability_end: string;
  image_url: string;
  images: string[];
  lister_name: string;
  lister_relationship: string;
  description: string;
  rental_requirements: string;
  contact_email: string;
  contact_phone: string;
  created_at: string;
  user_id?: string;
  furnished?: boolean;
  utilities_included?: boolean;
  roommates?: number;
  is_boosted?: boolean;
  is_verified?: boolean;
}

/** Convert a DB row → Listing interface */
function rowToListing(row: ListingRow): Listing {
  return {
    id: row.id,
    title: row.title ?? '',
    price: Number(row.price),
    bedrooms: row.bedrooms ?? 1,
    bathrooms: Number(row.bathrooms ?? 1),
    location: {
      address: row.address,
      lat: row.lat,
      lng: row.lng,
    },
    availability: {
      start: row.availability_start,
      end: row.availability_end,
    },
    imageUrl: row.image_url,
    images: row.images ?? [],
    listerName: row.lister_name,
    listerRelationship: row.lister_relationship ?? 'Tenant',
    description: row.description,
    rentalRequirements: row.rental_requirements ?? '',
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    createdAt: row.created_at,
    furnished: row.furnished,
    utilitiesIncluded: row.utilities_included,
    roommates: row.roommates,
    isBoosted: row.is_boosted,
    isVerified: row.is_verified,
  };
}

/** Convert a Listing → flat DB row */
function listingToRow(listing: Listing): ListingRow {
  return {
    id: listing.id,
    title: listing.title,
    price: listing.price,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    address: listing.location.address,
    lat: listing.location.lat,
    lng: listing.location.lng,
    availability_start: listing.availability.start,
    availability_end: listing.availability.end,
    image_url: listing.imageUrl,
    images: listing.images,
    lister_name: listing.listerName,
    lister_relationship: listing.listerRelationship,
    description: listing.description,
    rental_requirements: listing.rentalRequirements,
    contact_email: listing.contactEmail,
    contact_phone: listing.contactPhone,
    created_at: listing.createdAt,
    furnished: listing.furnished,
    utilities_included: listing.utilitiesIncluded,
    roommates: listing.roommates,
    is_boosted: listing.isBoosted,
    is_verified: listing.isVerified,
  };
}

/**
 * Fetch all listings from Supabase.
 * Falls back to seed + localStorage if Supabase is not configured.
 */
export async function fetchAllListings(): Promise<Listing[]> {
  if (!supabase) {
    return [...seedListings, ...loadUserListings()];
  }

  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  const listings = (data as ListingRow[]).map(rowToListing);

  // Merge new fields from seed data for listings that match by ID
  // (handles the case where DB was seeded before new columns were added)
  const seedMap = new Map(seedListings.map((s) => [s.id, s]));
  for (const listing of listings) {
    const seed = seedMap.get(listing.id);
    if (seed) {
      listing.furnished ??= seed.furnished;
      listing.utilitiesIncluded ??= seed.utilitiesIncluded;
      listing.roommates ??= seed.roommates;
      listing.isBoosted ??= seed.isBoosted;
      listing.isVerified ??= seed.isVerified;
    }
  }

  return listings;
}

/**
 * Insert a single listing into Supabase.
 * Falls back to localStorage if Supabase is not configured.
 */
export async function insertListing(listing: Listing): Promise<Listing> {
  if (!supabase) {
    const existing = loadUserListings();
    saveUserListings([...existing, listing]);
    return listing;
  }

  const row = listingToRow(listing);

  // Attach authenticated user's ID if available
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    row.user_id = user.id;
  }

  const { data, error } = await supabase
    .from('listings')
    .insert(row)
    .select()
    .single();

  if (error) throw error;
  return rowToListing(data as ListingRow);
}
