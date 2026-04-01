import type { Listing } from '../types/listing';

export interface ScamFlag {
  severity: 'warning' | 'danger';
  message: string;
  detail: string;
}

export function getScamFlags(listing: Listing, allListings: Listing[]): ScamFlag[] {
  const flags: ScamFlag[] = [];

  // Price suspiciously low
  const sameBedroom = allListings.filter((l) => l.bedrooms === listing.bedrooms && l.id !== listing.id);
  if (sameBedroom.length >= 3) {
    const median = sameBedroom.map((l) => l.price).sort((a, b) => a - b)[Math.floor(sameBedroom.length / 2)];
    if (listing.price < median * 0.55) {
      flags.push({
        severity: 'danger',
        message: 'Price significantly below market',
        detail: `This listing is priced ${Math.round((1 - listing.price / median) * 100)}% below the median for similar units ($${median}/mo). Verify the listing is legitimate before sending any money.`,
      });
    } else if (listing.price < median * 0.7) {
      flags.push({
        severity: 'warning',
        message: 'Price below average',
        detail: `This listing is priced below average for similar units. This could be a great deal — or worth verifying. Median for similar units: $${median}/mo.`,
      });
    }
  }

  // No contact info
  if (!listing.contactEmail && !listing.contactPhone) {
    flags.push({
      severity: 'danger',
      message: 'No contact information',
      detail: 'This listing has no email or phone number. Legitimate listers always provide contact info.',
    });
  }

  // Non-Berkeley email
  if (listing.contactEmail && !listing.contactEmail.endsWith('@berkeley.edu')) {
    flags.push({
      severity: 'warning',
      message: 'Non-Berkeley email',
      detail: 'The contact email is not a @berkeley.edu address. Verify the lister is a current student or affiliated with Cal.',
    });
  }

  // Very short / vague description
  if (listing.description && listing.description.length < 50) {
    flags.push({
      severity: 'warning',
      message: 'Very brief description',
      detail: 'This listing has minimal details. Ask the lister for more information about the unit before committing.',
    });
  }

  // Not verified
  if (!listing.isVerified && !listing.verificationTier) {
    flags.push({
      severity: 'warning',
      message: 'Unverified lister',
      detail: 'This lister has not completed identity verification. Consider requesting verified documentation before proceeding.',
    });
  }

  return flags;
}
