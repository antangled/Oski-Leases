import { supabase } from './supabase';
import { seedListings } from '../data/seedListings';
import type { Listing } from '../types/listing';

/**
 * Seeds the Supabase database with the static seed listings
 * if the table is currently empty. Idempotent — safe to call multiple times.
 */
export async function seedDatabaseIfEmpty(): Promise<void> {
  if (!supabase) return;

  // Check if there are any listings already
  const { count, error: countError } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true });

  if (countError || (count != null && count > 0)) return;

  // Map seed listings to flat DB rows
  const rows = seedListings.map((l: Listing) => ({
    id: l.id,
    title: l.title,
    price: l.price,
    bedrooms: l.bedrooms,
    bathrooms: l.bathrooms,
    address: l.location.address,
    lat: l.location.lat,
    lng: l.location.lng,
    availability_start: l.availability.start,
    availability_end: l.availability.end,
    image_url: l.imageUrl,
    images: l.images,
    lister_name: l.listerName,
    lister_relationship: l.listerRelationship,
    description: l.description,
    rental_requirements: l.rentalRequirements,
    contact_email: l.contactEmail,
    contact_phone: l.contactPhone,
    created_at: l.createdAt,
    furnished: l.furnished,
    utilities_included: l.utilitiesIncluded,
    roommates: l.roommates,
    is_boosted: l.isBoosted,
    is_verified: l.isVerified,
  }));

  await supabase.from('listings').insert(rows);
}
