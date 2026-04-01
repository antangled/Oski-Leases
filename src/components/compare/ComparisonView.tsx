import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, Trophy, ArrowLeft } from 'lucide-react';
import type { Listing, ReferencePoint, EnrichedListing } from '../../types/listing';
import { haversineDistance, formatDistance } from '../../utils/distance';
import { computeOptimalityScore } from '../../utils/scoring';

interface Props {
  allListings: Listing[];
  referencePoint: ReferencePoint;
}

type RowDef = {
  label: string;
  getValue: (l: EnrichedListing) => string | number;
  bestFn?: 'min' | 'max';
  format?: (v: string | number) => string;
};

export default function ComparisonView({ allListings, referencePoint }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const idsParam = searchParams.get('ids') ?? '';
  const [selectedIds, setSelectedIds] = useState<string[]>(
    idsParam ? idsParam.split(',').slice(0, 3) : []
  );

  const enriched = useMemo(() => {
    return selectedIds
      .map((id) => {
        const listing = allListings.find((l) => l.id === id);
        if (!listing) return null;
        const distance = haversineDistance(
          referencePoint.lat,
          referencePoint.lng,
          listing.location.lat,
          listing.location.lng
        );
        const score = computeOptimalityScore({ ...listing, distance });
        return { ...listing, distance, score } as EnrichedListing;
      })
      .filter((l): l is EnrichedListing => l !== null);
  }, [selectedIds, allListings, referencePoint]);

  function removeListing(id: string) {
    const next = selectedIds.filter((i) => i !== id);
    setSelectedIds(next);
    setSearchParams(next.length > 0 ? { ids: next.join(',') } : {});
  }

  const rows: RowDef[] = [
    {
      label: 'Price',
      getValue: (l) => l.price,
      bestFn: 'min',
      format: (v) => `$${Number(v).toLocaleString()}/mo`,
    },
    {
      label: 'Location',
      getValue: (l) => l.location.address,
    },
    {
      label: 'Dates',
      getValue: (l) =>
        `${fmtDate(l.availability.start)} - ${fmtDate(l.availability.end)}`,
    },
    {
      label: 'Bedrooms',
      getValue: (l) => (l.bedrooms === 0 ? 'Studio' : l.bedrooms),
    },
    {
      label: 'Bathrooms',
      getValue: (l) => l.bathrooms,
    },
    {
      label: 'Furnished',
      getValue: (l) => (l.furnished ? 'Yes' : 'No'),
    },
    {
      label: 'Utilities',
      getValue: (l) => (l.utilitiesIncluded ? 'Included' : 'Not included'),
    },
    {
      label: 'Pet Policy',
      getValue: (l) =>
        l.petPolicy === 'allowed'
          ? 'Pets OK'
          : l.petPolicy === 'negotiable'
            ? 'Negotiable'
            : 'No pets',
    },
    {
      label: 'Distance',
      getValue: (l) => l.distance,
      bestFn: 'min',
      format: (v) => formatDistance(Number(v)),
    },
    {
      label: 'Match Score',
      getValue: (l) => l.score,
      bestFn: 'max',
      format: (v) => `${Math.round(Number(v) * 100)}%`,
    },
    {
      label: 'Verification',
      getValue: (l) => l.verificationTier ?? 'none',
    },
    {
      label: 'Rating',
      getValue: (l) => l.reviewSummary?.averageRating ?? 0,
      bestFn: 'max',
      format: (v) => (Number(v) > 0 ? `${Number(v).toFixed(1)} / 5` : 'No reviews'),
    },
  ];

  if (enriched.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Trophy size={48} className="text-gold/40 mb-4" />
        <h2 className="font-display text-xl font-bold text-dark mb-2">
          No Listings to Compare
        </h2>
        <p className="text-sm text-dark/50 max-w-sm">
          Save some listings and add them to compare. You can compare up to 3
          listings side by side.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => window.history.back()}
          className="p-2 rounded-lg hover:bg-dark/5 transition-colors"
        >
          <ArrowLeft size={18} className="text-dark/60" />
        </button>
        <h1 className="font-display text-2xl font-bold text-dark">
          Compare Listings
        </h1>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-dark/8 shadow-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream">
              <th className="text-left px-4 py-3 font-display text-xs font-bold text-dark/60 w-36">
                &nbsp;
              </th>
              {enriched.map((l) => (
                <th key={l.id} className="px-3 py-3 min-w-[200px]">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                      <img
                        src={l.images?.[0] ?? l.imageUrl}
                        alt={l.title}
                        className="w-full h-28 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeListing(l.id)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={11} />
                      </button>
                    </div>
                    <span className="text-xs font-semibold text-dark truncate max-w-[180px]">
                      {l.title || l.location.address}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => {
              const values = enriched.map((l) => row.getValue(l));
              const bestIdx = getBestIndex(values, row.bestFn);

              return (
                <tr
                  key={row.label}
                  className={ri % 2 === 0 ? 'bg-white' : 'bg-cream/30'}
                >
                  <td className="px-4 py-2.5 text-xs font-semibold text-dark/60 whitespace-nowrap">
                    {row.label}
                  </td>
                  {values.map((v, ci) => {
                    const display = row.format ? row.format(v) : String(v);
                    const isBest = bestIdx === ci && enriched.length > 1;
                    return (
                      <td
                        key={enriched[ci].id}
                        className={`px-3 py-2.5 text-xs text-center ${
                          isBest
                            ? 'bg-emerald-50 text-emerald-700 font-semibold'
                            : 'text-dark/70'
                        }`}
                      >
                        {display}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function fmtDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function getBestIndex(
  values: (string | number)[],
  fn?: 'min' | 'max'
): number | null {
  if (!fn) return null;
  const nums = values.map((v) => (typeof v === 'number' ? v : NaN));
  if (nums.every(isNaN)) return null;
  const valid = nums.filter((n) => !isNaN(n));
  if (valid.length < 2) return null;
  const target = fn === 'min' ? Math.min(...valid) : Math.max(...valid);
  return nums.indexOf(target);
}
