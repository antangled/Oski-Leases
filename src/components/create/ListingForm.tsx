import { useState } from 'react';
import type { Listing } from '../../types/listing';
import { DollarSign, MapPin, Calendar, User, FileText } from 'lucide-react';
import LocationPicker from './LocationPicker';
import { DEFAULT_LISTING_IMAGE, DEFAULT_LISTING_IMAGES } from '../../data/seedListings';

interface Props {
  onSubmit: (listing: Listing) => void;
}

export default function ListingForm({ onSubmit }: Props) {
  const [listerName, setListerName] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [geocoding, setGeocoding] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!listerName.trim()) errs.listerName = 'Enter your name';
    if (!price || parseFloat(price) <= 0) errs.price = 'Enter a valid price';
    if (!address.trim()) errs.address = 'Enter an address or drop a pin';
    if (!startDate) errs.startDate = 'Select a start date';
    if (!endDate) errs.endDate = 'Select an end date';
    if (startDate && endDate && endDate <= startDate)
      errs.endDate = 'End date must be after start date';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const geocodeAddress = async (addr: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      setGeocoding(true);
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}&limit=1`,
        { headers: { 'User-Agent': 'OskiLease/1.0' } },
      );
      const data = await resp.json();
      if (data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
      return null;
    } catch {
      return null;
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let finalCoords = coords;
    if (!finalCoords) {
      finalCoords = await geocodeAddress(address);
      if (!finalCoords) {
        setErrors((prev) => ({ ...prev, address: 'Could not find this address. Try dropping a pin instead.' }));
        return;
      }
    }

    const listing: Listing = {
      id: crypto.randomUUID(),
      price: parseFloat(price),
      location: {
        address: address.trim(),
        lat: finalCoords.lat,
        lng: finalCoords.lng,
      },
      availability: {
        start: startDate,
        end: endDate,
      },
      imageUrl: DEFAULT_LISTING_IMAGE,
      images: DEFAULT_LISTING_IMAGES,
      listerName: listerName.trim(),
      description: description.trim(),
      contactEmail: '',
      contactPhone: '',
      createdAt: new Date().toISOString(),
    };

    onSubmit(listing);
  };

  const handlePickerSelect = (result: { lat: number; lng: number; address: string }) => {
    setCoords({ lat: result.lat, lng: result.lng });
    setAddress(result.address);
    setShowPicker(false);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.address;
      return next;
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Your Name */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">
            Your Name
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30" />
            <input
              type="text"
              placeholder="e.g. Sarah Chen"
              value={listerName}
              onChange={(e) => setListerName(e.target.value)}
              className="w-full pl-9 pr-4 py-3 text-base border border-mint rounded-xl focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 bg-white text-dark"
            />
          </div>
          {errors.listerName && <p className="text-red-500 text-xs mt-1">{errors.listerName}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">
            Monthly Rent
          </label>
          <div className="relative">
            <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30" />
            <input
              type="number"
              placeholder="1200"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full pl-9 pr-16 py-3 text-base border border-mint rounded-xl focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 bg-white text-dark"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-dark/40">/month</span>
          </div>
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">
            Location
          </label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30" />
            <input
              type="text"
              placeholder="2534 Durant Ave, Berkeley, CA"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setCoords(null);
              }}
              className="w-full pl-9 pr-4 py-3 text-base border border-mint rounded-xl focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 bg-white text-dark"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="mt-1.5 text-xs text-teal hover:text-teal-dark transition-colors bg-transparent border-none cursor-pointer underline"
          >
            Or drop a pin on the map
          </button>
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        {/* Dates */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">
            Available Dates
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30 pointer-events-none" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-9 pr-3 py-3 text-base border border-mint rounded-xl focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 bg-white text-dark"
              />
              {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
            </div>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30 pointer-events-none" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-9 pr-3 py-3 text-base border border-mint rounded-xl focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 bg-white text-dark"
              />
              {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
            </div>
          </div>
        </div>

        {/* Specs / Additional Info */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">
            Specs / Additional Info
            <span className="text-dark/40 font-normal ml-1">(optional)</span>
          </label>
          <div className="relative">
            <FileText size={16} className="absolute left-3 top-3.5 text-dark/30" />
            <textarea
              placeholder="Describe your place — apartment specs, roommate requirements, amenities, move-in details, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full pl-9 pr-4 py-3 text-base border border-mint rounded-xl focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 bg-white text-dark resize-y"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={geocoding}
          className="w-full py-3 text-base font-semibold text-white bg-teal rounded-xl hover:bg-teal-dark transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {geocoding ? 'Looking up address...' : 'Post Listing'}
        </button>
      </form>

      {showPicker && (
        <LocationPicker
          onSelect={handlePickerSelect}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}
