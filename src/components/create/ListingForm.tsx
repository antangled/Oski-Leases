import { useState, useEffect } from 'react';
import type { Listing } from '../../types/listing';
import { DollarSign, MapPin, Calendar, User, FileText, Home, Briefcase, ClipboardList, Type, Sofa, Plug, Users } from 'lucide-react';
import LocationPicker from './LocationPicker';
import { DEFAULT_LISTING_IMAGE, DEFAULT_LISTING_IMAGES } from '../../data/seedListings';
import { SEMESTER_DATES, getMatchingSemesters, getCombinedDateRange } from '../../utils/semesterDates';
import { getSemesterColors } from '../../utils/semester';

interface Props {
  onSubmit: (listing: Listing) => void;
}

export default function ListingForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [listerName, setListerName] = useState('');
  const [listerRelationship, setListerRelationship] = useState('Tenant');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('1');
  const [bathrooms, setBathrooms] = useState('1');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSemesters, setSelectedSemesters] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [rentalRequirements, setRentalRequirements] = useState('');
  const [furnished, setFurnished] = useState(false);
  const [utilitiesIncluded, setUtilitiesIncluded] = useState(false);
  const [roommates, setRoommates] = useState('0');
  const [showPicker, setShowPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [geocoding, setGeocoding] = useState(false);

  useEffect(() => {
    if (startDate && endDate) {
      const matching = getMatchingSemesters(startDate, endDate);
      setSelectedSemesters(matching);
    }
  }, [startDate, endDate]);

  const handleSemesterToggle = (label: string) => {
    setSelectedSemesters((prev) => {
      const next = prev.includes(label)
        ? prev.filter((s) => s !== label)
        : [...prev, label];

      const range = getCombinedDateRange(next);
      if (range) {
        setStartDate(range.start);
        setEndDate(range.end);
      } else {
        setStartDate('');
        setEndDate('');
      }
      return next;
    });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Enter a title for your listing';
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
      title: title.trim(),
      price: parseFloat(price),
      bedrooms: parseInt(bedrooms),
      bathrooms: parseFloat(bathrooms),
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
      listerRelationship,
      description: description.trim(),
      rentalRequirements: rentalRequirements.trim(),
      contactEmail: '',
      contactPhone: '',
      createdAt: new Date().toISOString(),
      furnished,
      utilitiesIncluded,
      roommates: parseInt(roommates),
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

  const inputClasses = "w-full pl-9 pr-4 py-3 text-base border border-dark/12 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 bg-white text-dark";
  const selectClasses = "w-full pl-9 pr-4 py-3 text-base border border-dark/12 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 bg-white text-dark appearance-none cursor-pointer";

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">Listing Title</label>
          <div className="relative">
            <Type size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30" />
            <input type="text" placeholder="e.g. Sunny 1BR near Sather Gate" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClasses} />
          </div>
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Your Name */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">Your Name</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30" />
            <input type="text" placeholder="e.g. Sarah Chen" value={listerName} onChange={(e) => setListerName(e.target.value)} className={inputClasses} />
          </div>
          {errors.listerName && <p className="text-red-500 text-xs mt-1">{errors.listerName}</p>}
        </div>

        {/* Lister Relationship */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">I am a...</label>
          <div className="relative">
            <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30" />
            <select value={listerRelationship} onChange={(e) => setListerRelationship(e.target.value)} className={selectClasses}>
              <option value="Tenant">Tenant</option>
              <option value="Landlord">Landlord</option>
              <option value="Property Manager">Property Manager</option>
            </select>
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">Monthly Rent</label>
          <div className="relative">
            <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30" />
            <input type="number" placeholder="1200" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full pl-9 pr-16 py-3 text-base border border-dark/12 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 bg-white text-dark" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-dark/40">/month</span>
          </div>
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">Bedrooms</label>
            <div className="relative">
              <Home size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30" />
              <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={selectClasses}>
                <option value="0">Studio</option>
                <option value="1">1 BD</option>
                <option value="2">2 BD</option>
                <option value="3">3 BD</option>
                <option value="4">4+ BD</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">Bathrooms</label>
            <div className="relative">
              <Home size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30" />
              <select value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className={selectClasses}>
                <option value="1">1 BA</option>
                <option value="1.5">1.5 BA</option>
                <option value="2">2 BA</option>
                <option value="2.5">2.5 BA</option>
                <option value="3">3+ BA</option>
              </select>
            </div>
          </div>
        </div>

        {/* Amenities Row */}
        <div className="bg-cream rounded-xl p-4 border border-dark/5">
          <label className="block text-sm font-medium text-dark mb-3">Amenities</label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={furnished}
                onChange={(e) => setFurnished(e.target.checked)}
                className="w-4 h-4 rounded border-dark/20 text-gold focus:ring-gold/30 accent-gold"
              />
              <Sofa size={16} className="text-dark/50" />
              <span className="text-sm text-dark">Furnished</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={utilitiesIncluded}
                onChange={(e) => setUtilitiesIncluded(e.target.checked)}
                className="w-4 h-4 rounded border-dark/20 text-gold focus:ring-gold/30 accent-gold"
              />
              <Plug size={16} className="text-dark/50" />
              <span className="text-sm text-dark">Utilities Included</span>
            </label>
          </div>
          <div className="mt-3">
            <label className="block text-sm text-dark mb-1.5">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-dark/50" />
                <span>Number of roommates</span>
              </div>
            </label>
            <select
              value={roommates}
              onChange={(e) => setRoommates(e.target.value)}
              className="px-3 py-2 text-sm border border-dark/12 rounded-lg focus:outline-none focus:border-gold bg-white text-dark cursor-pointer"
            >
              <option value="0">No roommates (living alone)</option>
              <option value="1">1 roommate</option>
              <option value="2">2 roommates</option>
              <option value="3">3 roommates</option>
              <option value="4">4+ roommates</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">Location</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30" />
            <input
              type="text"
              placeholder="2534 Durant Ave, Berkeley, CA"
              value={address}
              onChange={(e) => { setAddress(e.target.value); setCoords(null); }}
              className={inputClasses}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="mt-1.5 text-xs text-gold hover:text-gold-dark transition-colors bg-transparent border-none cursor-pointer underline font-semibold"
          >
            Or drop a pin on the map
          </button>
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        {/* Semester Tags */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">
            Semester
            <span className="text-dark/40 font-normal ml-1">(click to auto-fill dates)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {SEMESTER_DATES.map((sem) => {
              const isSelected = selectedSemesters.includes(sem.label);
              const colors = getSemesterColors(sem.label);
              return (
                <button
                  key={sem.label}
                  type="button"
                  onClick={() => handleSemesterToggle(sem.label)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-all cursor-pointer ${
                    isSelected
                      ? `${colors.bg} ${colors.text} ${colors.border} font-semibold`
                      : 'bg-white text-dark/50 border-dark/15 hover:border-dark/30'
                  }`}
                >
                  {sem.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dates */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">Available Dates</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30 pointer-events-none" />
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClasses} />
              {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
            </div>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30 pointer-events-none" />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClasses} />
              {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">
            Description <span className="text-dark/40 font-normal ml-1">(optional)</span>
          </label>
          <div className="relative">
            <FileText size={16} className="absolute left-3 top-3.5 text-dark/30" />
            <textarea
              placeholder="Describe your place — apartment specs, roommate requirements, amenities, move-in details, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full pl-9 pr-4 py-3 text-base border border-dark/12 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 bg-white text-dark resize-y"
            />
          </div>
        </div>

        {/* Rental Requirements */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">
            Rental Requirements <span className="text-dark/40 font-normal ml-1">(optional)</span>
          </label>
          <div className="relative">
            <ClipboardList size={16} className="absolute left-3 top-3.5 text-dark/30" />
            <textarea
              placeholder="e.g. Minimum credit score, lease transfer required, no pets, quiet hours..."
              value={rentalRequirements}
              onChange={(e) => setRentalRequirements(e.target.value)}
              rows={3}
              className="w-full pl-9 pr-4 py-3 text-base border border-dark/12 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 bg-white text-dark resize-y"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={geocoding}
          className="w-full py-3 text-base font-semibold text-dark bg-gold rounded-xl hover:bg-gold-dark transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
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
