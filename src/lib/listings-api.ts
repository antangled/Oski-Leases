import type { Listing } from '../types/listing';
import { supabase } from './supabase';
import { seedListings } from '../data/seedListings';
import { loadUserListings, saveUserListings } from '../utils/storage';

/** Flat DB row shape (no nested objects) */
interface ListingRow {
  id: string;
  price: number;
  address: string;
  lat: number;
  lng: number;
  availability_start: string;
  availability_end: string;
  image_url: string;
  images: string[];
  lister_name: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  created_at: string;
}

/** Convert a DB row → Listing interface */
function rowToListing(row: ListingRow): Listing {
  return {
    id: row.id,
    price: Number(row.price),
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
    description: row.description,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    createdAt: row.created_at,
  };
}

/** Convert a Listing → flat DB row */
function listingToRow(listing: Listing): ListingRow {
  return {
    id: listing.id,
    price: listing.price,
    address: listing.location.address,
    lat: listing.location.lat,
    lng: listing.location.lng,
    availability_start: listing.availability.start,
    availability_end: listing.availability.end,
    image_url: listing.imageUrl,
    images: listing.images,
    lister_name: listing.listerName,
    description: listing.description,
    contact_email: listing.contactEmail,
    contact_phone: listing.contactPhone,
    created_at: listing.createdAt,
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
  return (data as ListingRow[]).map(rowToListing);
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
  const { data, error } = await supabase
    .from('listings')
    .insert(row)
    .select()
    .single();

  if (error) throw error;
  return rowToListing(data as ListingRow);
}
