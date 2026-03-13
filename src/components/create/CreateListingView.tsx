import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Listing } from '../../types/listing';
import ListingForm from './ListingForm';
import { CheckCircle, Home } from 'lucide-react';

interface Props {
  onAddListing: (listing: Listing) => void;
}

export default function CreateListingView({ onAddListing }: Props) {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const handleSubmit = (listing: Listing) => {
    onAddListing(listing);
    setSuccess(true);
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-dark rounded-2xl mb-3">
          <Home size={28} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl text-dark italic">List Your Place</h1>
        <p className="text-sm text-dark/50 mt-1">
          Going abroad? Help someone find a home while you&apos;re away.
        </p>
      </div>

      {success ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-dark/8 animate-fade-in-up">
          <CheckCircle size={48} className="text-emerald-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-dark mb-1">Listing posted!</h2>
          <p className="text-sm text-dark/50">Redirecting you to the map...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-dark/8">
          <ListingForm onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
}
