import type { SortOption } from '../../types/listing';
import { ArrowUpDown } from 'lucide-react';

interface Props {
  sortOption: SortOption;
  onChange: (option: SortOption) => void;
  resultCount: number;
}

const sortLabels: Record<SortOption, string> = {
  'best-match': 'Best Match',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  'distance-asc': 'Distance: Near to Far',
  'distance-desc': 'Distance: Far to Near',
  'availability-asc': 'Available Soonest',
};

export default function SortControls({ sortOption, onChange, resultCount }: Props) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-dark/60">
        <span className="font-semibold text-dark">{resultCount}</span> listing{resultCount !== 1 ? 's' : ''} found
      </p>
      <div className="flex items-center gap-2">
        <ArrowUpDown size={14} className="text-dark/40" />
        <select
          value={sortOption}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className="text-sm bg-white border border-mint rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal text-dark cursor-pointer"
        >
          {Object.entries(sortLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
