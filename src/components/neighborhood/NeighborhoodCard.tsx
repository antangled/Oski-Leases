import { Footprints, Train, ShoppingCart, DollarSign } from 'lucide-react';
import { getNeighborhood } from '../../utils/neighborhoodLookup';

interface Props {
  lat: number;
  lng: number;
}

export default function NeighborhoodCard({ lat, lng }: Props) {
  const neighborhood = getNeighborhood(lat, lng);
  if (!neighborhood) return null;

  return (
    <div className="bg-cream rounded-xl border border-dark/5 p-4">
      <h4 className="font-display text-base font-bold text-dark mb-1">
        {neighborhood.name}
      </h4>
      <p className="text-xs text-dark/50 leading-relaxed mb-3">
        {neighborhood.vibe}
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex items-center gap-2">
          <Footprints size={14} className="text-gold shrink-0" />
          <span className="text-xs text-dark/70">
            {neighborhood.walkToCampusMin} min to campus
          </span>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign size={14} className="text-gold shrink-0" />
          <span className="text-xs text-dark/70">
            ~${neighborhood.avgRent.toLocaleString()}/mo avg
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Train size={14} className="text-gold shrink-0" />
          <span className="text-xs text-dark/70">
            {neighborhood.nearestBART}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ShoppingCart size={14} className="text-gold shrink-0" />
          <span className="text-xs text-dark/70">
            {neighborhood.nearestGrocery}
          </span>
        </div>
      </div>
    </div>
  );
}
