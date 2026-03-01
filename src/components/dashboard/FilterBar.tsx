import type { FilterState } from '../../types/listing';
import { RotateCcw } from 'lucide-react';

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}

export default function FilterBar({ filters, onChange, onReset }: Props) {
  const update = (key: keyof FilterState, value: string) => {
    onChange({
      ...filters,
      [key]: value === '' ? null : key.startsWith('date') ? value : parseFloat(value),
    });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== null);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-dark/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-dark">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-teal-dark hover:text-teal transition-colors bg-transparent border-none cursor-pointer"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}
      </div>
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
              className="w-full px-3 py-2 text-sm border border-dark/15 rounded-lg focus:outline-none focus:border-teal bg-white text-dark"
            />
            <span className="text-dark/30">&ndash;</span>
            <input
              type="number"
              placeholder="$max"
              value={filters.priceMax ?? ''}
              onChange={(e) => update('priceMax', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-dark/15 rounded-lg focus:outline-none focus:border-teal bg-white text-dark"
            />
          </div>
        </div>
        {/* Distance range */}
        <div>
          <label className="block text-xs font-medium text-dark/60 mb-1.5">Distance (mi)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              placeholder="min"
              value={filters.distanceMin ?? ''}
              onChange={(e) => update('distanceMin', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-dark/15 rounded-lg focus:outline-none focus:border-teal bg-white text-dark"
            />
            <span className="text-dark/30">&ndash;</span>
            <input
              type="number"
              step="0.1"
              placeholder="max"
              value={filters.distanceMax ?? ''}
              onChange={(e) => update('distanceMax', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-dark/15 rounded-lg focus:outline-none focus:border-teal bg-white text-dark"
            />
          </div>
        </div>
        {/* Date range */}
        <div>
          <label className="block text-xs font-medium text-dark/60 mb-1.5">Available between</label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.dateStart ?? ''}
              onChange={(e) => update('dateStart', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-dark/15 rounded-lg focus:outline-none focus:border-teal bg-white text-dark"
            />
            <span className="text-dark/30">&ndash;</span>
            <input
              type="date"
              value={filters.dateEnd ?? ''}
              onChange={(e) => update('dateEnd', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-dark/15 rounded-lg focus:outline-none focus:border-teal bg-white text-dark"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
