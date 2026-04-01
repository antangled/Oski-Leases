import type { FilterState } from '../../types/listing';
import { berkeleyNeighborhoods } from '../../data/berkeleyNeighborhoods';
import { RotateCcw } from 'lucide-react';

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}

export default function FilterBar({ filters, onChange, onReset }: Props) {
  const update = (key: keyof FilterState, value: string | boolean) => {
    if (typeof value === 'boolean') {
      onChange({ ...filters, [key]: value });
      return;
    }
    onChange({
      ...filters,
      [key]: value === '' ? null : key.startsWith('date') || key === 'genderPreference' || key === 'neighborhood' ? value : parseFloat(value),
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, v]) => {
    if (key === 'verifiedOnly' || key === 'petFriendly') return v === true;
    if (key === 'furnished') return v !== null;
    return v !== null;
  });

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-dark/8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-dark">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-gold-dark hover:text-gold transition-colors bg-transparent border-none cursor-pointer font-semibold"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}
      </div>

      {/* Primary filters — row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Price range */}
        <div>
          <label className="block text-xs font-medium text-dark/60 mb-1.5">Price range</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="$min"
              value={filters.priceMin ?? ''}
              onChange={(e) => update('priceMin', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-dark/12 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 bg-white text-dark"
            />
            <span className="text-dark/30">&ndash;</span>
            <input
              type="number"
              placeholder="$max"
              value={filters.priceMax ?? ''}
              onChange={(e) => update('priceMax', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-dark/12 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 bg-white text-dark"
            />
          </div>
        </div>
        {/* Neighborhood */}
        <div>
          <label className="block text-xs font-medium text-dark/60 mb-1.5">Neighborhood</label>
          <select
            value={filters.neighborhood ?? ''}
            onChange={(e) => update('neighborhood', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-dark/12 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 bg-white text-dark cursor-pointer appearance-none"
          >
            <option value="">All neighborhoods</option>
            {berkeleyNeighborhoods.map((n) => (
              <option key={n.slug} value={n.slug}>{n.name} ({n.walkToCampusMin} min walk)</option>
            ))}
          </select>
        </div>
        {/* Date range */}
        <div>
          <label className="block text-xs font-medium text-dark/60 mb-1.5">Available between</label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.dateStart ?? ''}
              onChange={(e) => update('dateStart', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-dark/12 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 bg-white text-dark"
            />
            <span className="text-dark/30">&ndash;</span>
            <input
              type="date"
              value={filters.dateEnd ?? ''}
              onChange={(e) => update('dateEnd', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-dark/12 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 bg-white text-dark"
            />
          </div>
        </div>
      </div>

      {/* Primary filters — row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-4">
        {/* Gender preference */}
        <div>
          <label className="block text-xs font-medium text-dark/60 mb-1.5">Gender preference</label>
          <select
            value={filters.genderPreference ?? ''}
            onChange={(e) => update('genderPreference', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-dark/12 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 bg-white text-dark cursor-pointer appearance-none"
          >
            <option value="">Any</option>
            <option value="women-only">Women Only</option>
            <option value="men-only">Men Only</option>
          </select>
        </div>
        {/* Distance */}
        <div>
          <label className="block text-xs font-medium text-dark/60 mb-1.5">Max distance from campus (mi)</label>
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 1.0"
            value={filters.distanceMax ?? ''}
            onChange={(e) => update('distanceMax', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-dark/12 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 bg-white text-dark"
          />
        </div>
        {/* Quick toggles inline */}
        <div className="flex items-end gap-4 pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.furnished === true}
              onChange={(e) => onChange({ ...filters, furnished: e.target.checked ? true : null })}
              className="w-4 h-4 rounded border-dark/20 accent-[#FDB515]"
            />
            <span className="text-sm text-dark/70">Furnished</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.verifiedOnly}
              onChange={(e) => update('verifiedOnly', e.target.checked)}
              className="w-4 h-4 rounded border-dark/20 accent-[#FDB515]"
            />
            <span className="text-sm text-dark/70">Verified</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.petFriendly}
              onChange={(e) => update('petFriendly', e.target.checked)}
              className="w-4 h-4 rounded border-dark/20 accent-[#FDB515]"
            />
            <span className="text-sm text-dark/70">Pets OK</span>
          </label>
        </div>
      </div>

    </div>
  );
}
