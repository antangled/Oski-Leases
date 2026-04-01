export interface FurnishingItemDef {
  key: string;
  label: string;
  icon: string; // Lucide icon name
}

export const FURNISHING_ITEMS: FurnishingItemDef[] = [
  { key: 'bed-frame', label: 'Bed Frame', icon: 'Bed' },
  { key: 'mattress', label: 'Mattress', icon: 'Bed' },
  { key: 'desk', label: 'Desk', icon: 'Monitor' },
  { key: 'desk-chair', label: 'Desk Chair', icon: 'Armchair' },
  { key: 'dresser', label: 'Dresser', icon: 'Archive' },
  { key: 'closet', label: 'Closet / Wardrobe', icon: 'DoorOpen' },
  { key: 'bookshelf', label: 'Bookshelf', icon: 'BookOpen' },
  { key: 'lamp', label: 'Lamp', icon: 'Lightbulb' },
  { key: 'linens', label: 'Bed Linens', icon: 'Layers' },
  { key: 'towels', label: 'Towels', icon: 'Droplets' },
  { key: 'kitchen', label: 'Kitchen Essentials', icon: 'UtensilsCrossed' },
  { key: 'wifi', label: 'WiFi Router', icon: 'Wifi' },
  { key: 'tv', label: 'TV', icon: 'Tv' },
  { key: 'ac', label: 'A/C Unit', icon: 'Snowflake' },
  { key: 'heater', label: 'Heater', icon: 'Flame' },
  { key: 'microwave', label: 'Microwave', icon: 'Microwave' },
  { key: 'hangers', label: 'Hangers', icon: 'Shirt' },
  { key: 'mirror', label: 'Mirror', icon: 'Scan' },
];
