import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MAP_CONFIG, CAMPUS_CENTER } from '../../constants/mapConfig';
import type { Listing, ReferencePoint, EnrichedListing } from '../../types/listing';
import { haversineDistance, formatDistance } from '../../utils/distance';
import { computeOptimalityScore } from '../../utils/scoring';
import { getSemester, getSemesterColors, getUniqueSemesters } from '../../utils/semester';
import { MapPin, GraduationCap, ChevronDown } from 'lucide-react';

interface Props {
  listings: Listing[];
  referencePoint: ReferencePoint;
  onReferencePointChange: (point: ReferencePoint) => void;
}

/* ── Color helpers ── */
interface ColorStop { t: number; r: number; g: number; b: number }

const COLOR_STOPS: ColorStop[] = [
  { t: 0.0, r: 23, g: 37, b: 42 },
  { t: 0.35, r: 43, g: 122, b: 120 },
  { t: 0.65, r: 58, g: 175, b: 169 },
  { t: 1.0, r: 222, g: 242, b: 241 },
];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function interpolateColor(t: number): string {
  const c = Math.min(Math.max(t, 0), 1);
  let i = 0;
  for (; i < COLOR_STOPS.length - 2; i++) { if (c <= COLOR_STOPS[i + 1].t) break; }
  const c0 = COLOR_STOPS[i], c1 = COLOR_STOPS[i + 1];
  const lt = (c - c0.t) / (c1.t - c0.t);
  return `rgb(${Math.round(lerp(c0.r, c1.r, lt))},${Math.round(lerp(c0.g, c1.g, lt))},${Math.round(lerp(c0.b, c1.b, lt))})`;
}

function getMarkerColor(distanceMiles: number) {
  const t = Math.min(distanceMiles / 1.5, 1);
  const color = interpolateColor(t);
  const m = color.match(/rgb\((\d+),(\d+),(\d+)\)/);
  const lum = m ? (0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) / 255 : 0;
  return { fill: color, textColor: lum < 0.5 ? '#FEFFFF' : '#17252A' };
}

function getMarkerSize(price: number): number {
  const t = Math.min(Math.max((price - 800) / (2500 - 800), 0), 1);
  return 44 - t * (44 - 26);
}

function createMarkerEl(price: number, distanceMiles: number, listingId: string): HTMLElement {
  const { fill, textColor } = getMarkerColor(distanceMiles);
  const size = getMarkerSize(price);
  const h = size * 1.3;
  const priceLabel = price >= 1000 ? `$${(price / 1000).toFixed(1)}k` : `$${price}`;

  const pad = 4;
  const totalW = size + pad * 2;
  const totalH = h + pad * 2;

  const el = document.createElement('div');
  el.className = 'maplibre-listing-marker';
  el.dataset.listingId = listingId;
  el.style.cursor = 'pointer';
  el.style.width = totalW + 'px';
  el.style.height = totalH + 'px';
  el.innerHTML = `<svg width="${totalW}" height="${totalH}" viewBox="${-pad} ${-pad} ${size + pad * 2} ${h + pad * 2}" xmlns="http://www.w3.org/2000/svg">
    <path d="M${size / 2} 0 C${size * 0.775} 0 ${size} ${size * 0.225} ${size} ${size * 0.5} C${size} ${h * 0.673} ${size / 2} ${h} ${size / 2} ${h} C${size / 2} ${h} 0 ${h * 0.673} 0 ${size * 0.5} C0 ${size * 0.225} ${size * 0.225} 0 ${size / 2} 0Z"
          fill="${fill}" stroke="#17252A" stroke-width="1.5"/>
    <text x="${size / 2}" y="${size * 0.575}" text-anchor="middle" fill="${textColor}"
          font-size="${size * 0.25}" font-weight="700" font-family="Inter,sans-serif">${priceLabel}</text>
  </svg>`;
  return el;
}

function createRefMarkerEl(): HTMLElement {
  const size = 36;
  const h = size * 1.3;
  const pad = 4;
  const totalW = size + pad * 2;
  const totalH = h + pad * 2;

  const el = document.createElement('div');
  el.className = 'maplibre-ref-marker';
  el.style.width = totalW + 'px';
  el.style.height = totalH + 'px';
  el.innerHTML = `<svg width="${totalW}" height="${totalH}" viewBox="${-pad} ${-pad} ${size + pad * 2} ${h + pad * 2}" xmlns="http://www.w3.org/2000/svg">
    <path d="M${size / 2} 0 C${size * 0.775} 0 ${size} ${size * 0.225} ${size} ${size * 0.5} C${size} ${h * 0.673} ${size / 2} ${h} ${size / 2} ${h} C${size / 2} ${h} 0 ${h * 0.673} 0 ${size * 0.5} C0 ${size * 0.225} ${size * 0.225} 0 ${size / 2} 0Z"
          fill="#E53E3E" stroke="#17252A" stroke-width="2"/>
    <circle cx="${size / 2}" cy="${size * 0.45}" r="${size * 0.18}" fill="#17252A"/>
    <circle cx="${size / 2}" cy="${size * 0.45}" r="${size * 0.08}" fill="#E53E3E"/>
  </svg>`;
  return el;
}

export default function MapView({ listings, referencePoint, onReferencePointChange }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const markerElsRef = useRef<Map<string, HTMLElement>>(new Map());
  const refMarkerRef = useRef<maplibregl.Marker | null>(null);
  const isDraggingRef = useRef(false);
  const onRefChangeRef = useRef(onReferencePointChange);
  onRefChangeRef.current = onReferencePointChange;

  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);
  const [semesterFilter, setSemesterFilter] = useState<string>('all');

  const semesters = useMemo(() => getUniqueSemesters(listings), [listings]);

  const filteredListings = useMemo(() => {
    if (semesterFilter === 'all') return listings;
    return listings.filter((l) => getSemester(l.availability.start) === semesterFilter);
  }, [listings, semesterFilter]);

  // Enrich all filtered listings with distance + score
  const enrichedListings: EnrichedListing[] = useMemo(() => {
    return filteredListings
      .map((listing) => {
        const distance = haversineDistance(referencePoint.lat, referencePoint.lng, listing.location.lat, listing.location.lng);
        return { ...listing, distance, score: computeOptimalityScore({ ...listing, distance }) };
      })
      .sort((a, b) => b.score - a.score);
  }, [filteredListings, referencePoint]);

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          },
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
      },
      center: [CAMPUS_CENTER.lng, CAMPUS_CENTER.lat],
      zoom: MAP_CONFIG.zoom,
      minZoom: MAP_CONFIG.minZoom,
      maxZoom: MAP_CONFIG.maxZoom,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    mapRef.current = map;

    // Create reference marker ONCE here
    const el = createRefMarkerEl();
    const refMarker = new maplibregl.Marker({ element: el, draggable: true, anchor: 'bottom' })
      .setLngLat([CAMPUS_CENTER.lng, CAMPUS_CENTER.lat])
      .addTo(map);

    refMarker.on('dragstart', () => {
      isDraggingRef.current = true;
    });
    refMarker.on('drag', () => {
      const { lng, lat } = refMarker.getLngLat();
      onRefChangeRef.current({ lat, lng });
    });
    refMarker.on('dragend', () => {
      const { lng, lat } = refMarker.getLngLat();
      onRefChangeRef.current({ lat, lng });
      isDraggingRef.current = false;
    });

    refMarkerRef.current = refMarker;

    return () => {
      map.remove();
      mapRef.current = null;
      refMarkerRef.current = null;
    };
  }, []);

  // Sync reference marker position when referencePoint changes externally (not from dragging)
  useEffect(() => {
    if (isDraggingRef.current || !refMarkerRef.current) return;
    refMarkerRef.current.setLngLat([referencePoint.lng, referencePoint.lat]);
  }, [referencePoint]);

  // Update listing markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    markerElsRef.current.clear();

    enrichedListings.forEach((listing) => {
      const el = createMarkerEl(listing.price, listing.distance, listing.id);

      el.addEventListener('mouseenter', () => {
        setHoveredListingId(listing.id);
      });
      el.addEventListener('click', () => {
        setHoveredListingId(listing.id);
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([listing.location.lng, listing.location.lat])
        .addTo(map);

      markersRef.current.push(marker);
      markerElsRef.current.set(listing.id, el);
    });
  }, [enrichedListings]);

  // Highlight map pin when sidebar item is hovered
  const highlightPin = useCallback((id: string | null) => {
    markerElsRef.current.forEach((el, elId) => {
      if (elId === id) {
        el.classList.add('maplibre-marker-active');
      } else {
        el.classList.remove('maplibre-marker-active');
      }
    });
  }, []);

  // Auto-scroll sidebar and highlight pin on hover
  useEffect(() => {
    if (hoveredListingId) {
      const sidebarEl = document.getElementById(`sidebar-${hoveredListingId}`);
      sidebarEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      highlightPin(hoveredListingId);
    } else {
      highlightPin(null);
    }
  }, [hoveredListingId, highlightPin]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-mint overflow-hidden">
      {/* Legend bar */}
      <div className="bg-white border-b border-mint px-6 py-3.5 flex flex-wrap items-center gap-5 text-xs text-dark/70">
        <div className="flex items-center gap-2 font-semibold text-dark text-sm">
          <MapPin size={16} className="text-teal" />
          {enrichedListings.length} listings
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-dark" />
          Closer
          <span className="mx-1">&rarr;</span>
          <span className="inline-block w-3 h-3 rounded-full bg-teal" />
          <span className="inline-block w-3 h-3 rounded-full bg-mint border border-dark/20" />
          Farther
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded-full bg-teal-dark" />
          Bigger = cheaper
          <span className="mx-1">&rarr;</span>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-teal-dark" />
          Smaller = pricier
        </div>

        {/* Semester filter dropdown */}
        <div className="ml-auto flex items-center gap-2">
          <GraduationCap size={14} className="text-teal-dark" />
          <div className="relative">
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="appearance-none bg-white border border-dark/15 rounded-lg px-3 py-1.5 pr-7 text-xs font-medium text-dark cursor-pointer focus:outline-none focus:border-teal"
            >
              <option value="all">All Semesters</option>
              {semesters.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-dark/40 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Map + sidebar */}
      <div className="flex" style={{ height: '55vh' }}>
        <div ref={mapContainerRef} className="flex-1 h-full" />

        {/* Scrollable listing sidebar */}
        <div className="w-80 border-l border-mint bg-white overflow-y-auto shrink-0">
          <div className="p-3 border-b border-mint bg-mint/30">
            <p className="text-xs font-semibold text-dark/60 uppercase tracking-wide">
              All Listings
            </p>
          </div>
          {enrichedListings.map((listing) => {
            const sem = getSemester(listing.availability.start);
            const semColors = getSemesterColors(sem);
            const isHovered = hoveredListingId === listing.id;
            const score = Math.round(listing.score * 100);

            return (
              <div
                key={listing.id}
                id={`sidebar-${listing.id}`}
                className={`p-3 border-b border-dark/5 cursor-pointer transition-all duration-150 ${
                  isHovered ? 'bg-teal/5 border-l-4 border-l-teal' : 'border-l-4 border-l-transparent hover:bg-dark/3'
                }`}
                onMouseEnter={() => {
                  setHoveredListingId(listing.id);
                  highlightPin(listing.id);
                }}
                onMouseLeave={() => {
                  highlightPin(null);
                }}
              >
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  <img
                    src={listing.imageUrl}
                    alt={listing.location.address}
                    className="w-20 h-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-dark">
                        ${listing.price.toLocaleString()}
                        <span className="text-[10px] text-dark/40 font-normal ml-0.5">/mo</span>
                      </span>
                      <span className="text-[10px] font-bold text-teal-dark bg-teal/10 px-1.5 py-0.5 rounded-full">
                        {score}%
                      </span>
                    </div>
                    <p className="text-[11px] text-dark/60 truncate mb-1">{listing.location.address}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${semColors.bg} ${semColors.text}`}>
                        {sem}
                      </span>
                      <span className="text-[10px] text-dark/40">
                        {formatDistance(listing.distance)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
