import { useState, useCallback, useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MAP_CONFIG, CAMPUS_CENTER } from '../../constants/mapConfig';

interface Props {
  onSelect: (coords: { lat: number; lng: number; address: string }) => void;
  onClose: () => void;
}

export default function LocationPicker({ onSelect, onClose }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

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
            attribution: '&copy; OpenStreetMap',
          },
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
      },
      center: [CAMPUS_CENTER.lng, CAMPUS_CENTER.lat],
      zoom: MAP_CONFIG.zoom,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      setPin({ lat, lng });

      if (markerRef.current) markerRef.current.remove();

      const el = document.createElement('div');
      el.innerHTML = `<svg width="28" height="36" viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 0 C31 0 40 9 40 20 C40 35 20 52 20 52 C20 52 0 35 0 20 C0 9 9 0 20 0Z"
              fill="#3AAFA9" stroke="#17252A" stroke-width="2"/>
        <circle cx="20" cy="18" r="6" fill="#17252A"/>
      </svg>`;

      markerRef.current = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([lng, lat])
        .addTo(map);

      // Reverse geocode
      setLoading(true);
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`,
        { headers: { 'User-Agent': 'OskiLease/1.0' } },
      )
        .then((r) => r.json())
        .then((data) => setAddress(data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`))
        .catch(() => setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`))
        .finally(() => setLoading(false));
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const handleConfirm = useCallback(() => {
    if (pin) {
      onSelect({ ...pin, address });
    }
  }, [pin, address, onSelect]);

  return (
    <div className="fixed inset-0 z-[2000] bg-dark/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="p-5 border-b border-mint">
          <h3 className="font-semibold text-dark text-lg">Drop a pin on the map</h3>
          <p className="text-sm text-dark/50 mt-1">Click anywhere on the map to place your listing</p>
        </div>
        <div className="h-72" ref={mapContainerRef} />
        {pin && (
          <div className="px-5 py-3 bg-mint/50 text-sm text-dark/70 truncate">
            {loading ? 'Looking up address...' : address}
          </div>
        )}
        <div className="p-5 flex items-center justify-end gap-3 border-t border-mint">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm text-dark/60 hover:text-dark bg-transparent border border-mint rounded-lg cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!pin || loading}
            className="px-5 py-2.5 text-sm font-medium text-white bg-teal rounded-lg hover:bg-teal-dark transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border-none"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}
