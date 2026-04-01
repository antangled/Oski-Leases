import { useMemo } from 'react';
import type { Listing } from '../../types/listing';
import { computePriceSuggestion, getPriceIndicator } from '../../utils/smartPricing';
import { TrendingUp } from 'lucide-react';

interface Props {
  price: number | null;
  bedrooms: number;
  lat: number;
  lng: number;
  listings: Listing[];
}

export default function PriceSuggestion({ price, bedrooms, lat, lng, listings }: Props) {
  const suggestion = useMemo(
    () => computePriceSuggestion(listings, bedrooms, lat, lng),
    [listings, bedrooms, lat, lng],
  );

  if (!suggestion) {
    return (
      <div className="mt-2 px-3 py-2 bg-cream rounded-lg border border-dark/8 text-xs text-dark/50">
        Not enough data for price suggestion
      </div>
    );
  }

  const indicator = price !== null ? getPriceIndicator(price, suggestion) : null;

  const colorMap = {
    within: { text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', label: 'Great price' },
    above: { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Above range' },
    below: { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Below range' },
  };

  const colors = indicator ? colorMap[indicator] : null;

  // Bar visualization: map price range to a 0-100 scale
  const rangeMin = suggestion.low * 0.8;
  const rangeMax = suggestion.high * 1.2;
  const scale = (v: number) => Math.max(0, Math.min(100, ((v - rangeMin) / (rangeMax - rangeMin)) * 100));

  const greenLeft = scale(suggestion.low);
  const greenRight = scale(suggestion.high);
  const markerPos = price !== null ? scale(price) : null;

  return (
    <div className={`mt-2 px-3 py-2.5 rounded-lg border text-xs ${colors ? `${colors.bg} ${colors.border}` : 'bg-cream border-dark/8'}`}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 text-dark/70">
          <TrendingUp size={12} />
          <span>
            Similar rooms nearby: <span className="font-semibold">${suggestion.low.toLocaleString()} - ${suggestion.high.toLocaleString()}/mo</span>
          </span>
        </div>
        <span className="text-dark/40">{suggestion.sampleSize} listings</span>
      </div>

      {/* Bar visualization */}
      <div className="relative h-2 bg-dark/10 rounded-full overflow-hidden">
        {/* Green suggested zone */}
        <div
          className="absolute top-0 h-full bg-green-400/60 rounded-full"
          style={{ left: `${greenLeft}%`, width: `${greenRight - greenLeft}%` }}
        />
        {/* Price marker */}
        {markerPos !== null && (
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${
              indicator === 'within' ? 'bg-green-600' : indicator === 'above' ? 'bg-red-500' : 'bg-amber-500'
            }`}
            style={{ left: `calc(${markerPos}% - 5px)` }}
          />
        )}
      </div>

      {/* Indicator label */}
      {colors && price !== null && (
        <div className={`mt-1.5 font-medium ${colors.text}`}>
          {colors.label} — ${price.toLocaleString()}/mo
        </div>
      )}
    </div>
  );
}
