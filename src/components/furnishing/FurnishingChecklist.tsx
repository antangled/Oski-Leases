import {
  Bed,
  Monitor,
  Lamp,
  Sofa,
  Refrigerator,
  WashingMachine,
  Wifi,
  AirVent,
  Armchair,
  BookOpen,
  Check,
  X,
} from 'lucide-react';
import type { FurnishingItem } from '../../types/user';
import type { LucideIcon } from 'lucide-react';

interface Props {
  checklist: FurnishingItem[];
}

const iconMap: Record<string, LucideIcon> = {
  'bed-frame': Bed,
  bed: Bed,
  mattress: Bed,
  desk: Monitor,
  monitor: Monitor,
  lamp: Lamp,
  'desk-lamp': Lamp,
  sofa: Sofa,
  couch: Sofa,
  fridge: Refrigerator,
  refrigerator: Refrigerator,
  washer: WashingMachine,
  dryer: WashingMachine,
  'washer-dryer': WashingMachine,
  wifi: Wifi,
  internet: Wifi,
  ac: AirVent,
  'air-conditioning': AirVent,
  heater: AirVent,
  chair: Armchair,
  'desk-chair': Armchair,
  bookshelf: BookOpen,
  shelves: BookOpen,
};

function getIcon(item: string): LucideIcon {
  const key = item.toLowerCase().replace(/\s+/g, '-');
  return iconMap[key] ?? BookOpen;
}

export default function FurnishingChecklist({ checklist }: Props) {
  if (!checklist || checklist.length === 0) return null;

  return (
    <div className="bg-cream/50 rounded-xl border border-dark/5 p-4">
      <h4 className="font-display text-sm font-bold text-dark mb-3">
        What's Included
      </h4>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {checklist.map(({ item, included }) => {
          const Icon = getIcon(item);
          return (
            <div
              key={item}
              className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs ${
                included
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-400'
              }`}
            >
              <Icon size={13} className="shrink-0" />
              <span className="truncate">{item}</span>
              {included ? (
                <Check size={11} className="ml-auto shrink-0 text-emerald-500" />
              ) : (
                <X size={11} className="ml-auto shrink-0 text-red-400" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
