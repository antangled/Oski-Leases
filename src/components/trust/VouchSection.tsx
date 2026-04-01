import { useState } from 'react';
import { ChevronDown, ChevronUp, Award, Send } from 'lucide-react';
import type { Vouch } from '../../types/user';
import { useUserProfile } from '../../contexts/UserProfileContext';

interface Props {
  vouches: Vouch[];
  listerName: string;
  listerId: string;
}

export default function VouchSection({ vouches, listerName, listerId }: Props) {
  const { profile, addVouch } = useUserProfile();
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [note, setNote] = useState('');

  const isOwnListing = profile?.id === listerId;
  const alreadyVouched = vouches.some((v) => v.fromUserId === profile?.id);
  const displayVouches = expanded ? vouches : vouches.slice(0, 2);

  function handleSubmitVouch() {
    if (!profile || !note.trim()) return;
    const vouch: Vouch = {
      fromUserId: profile.id,
      fromName: profile.displayName,
      fromProfilePic: profile.profilePic,
      note: note.trim(),
      createdAt: new Date().toISOString(),
    };
    addVouch(listerId, vouch);
    setNote('');
    setShowForm(false);
  }

  return (
    <div className="rounded-2xl border border-dark/8 bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-dark/5">
        <Award size={16} className="text-gold shrink-0" />
        <span className="text-sm font-semibold text-dark">
          Vouched for by {vouches.length} Cal student{vouches.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Vouch list */}
      {vouches.length > 0 && (
        <div className="px-4 py-3 space-y-3">
          {displayVouches.map((v, i) => (
            <div key={`${v.fromUserId}-${i}`} className="flex items-start gap-2.5">
              {v.fromProfilePic ? (
                <img src={v.fromProfilePic} alt={v.fromName} className="w-7 h-7 rounded-full object-cover border border-dark/10 shrink-0 mt-0.5" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-dark/10 shrink-0 mt-0.5" />
              )}
              <div className="min-w-0">
                <span className="text-xs font-semibold text-dark">{v.fromName}</span>
                <p className="text-xs text-dark/60 leading-relaxed mt-0.5">{v.note}</p>
              </div>
            </div>
          ))}

          {vouches.length > 2 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs font-medium text-dark/50 hover:text-dark/70 transition-colors bg-transparent border-none cursor-pointer px-0"
            >
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {expanded ? 'Show less' : `Show all ${vouches.length} vouches`}
            </button>
          )}
        </div>
      )}

      {/* Vouch form / button */}
      {!isOwnListing && profile && (
        <div className="px-4 py-3 border-t border-dark/5">
          {showForm ? (
            <div className="space-y-2">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={`Why do you vouch for ${listerName}?`}
                className="w-full text-sm px-3 py-2 rounded-xl border border-dark/10 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 placeholder:text-dark/30"
                maxLength={200}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitVouch()}
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSubmitVouch}
                  disabled={!note.trim()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gold text-dark border-none cursor-pointer hover:bg-gold/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send size={11} />
                  Submit
                </button>
                <button
                  onClick={() => { setShowForm(false); setNote(''); }}
                  className="text-xs text-dark/50 hover:text-dark/70 bg-transparent border-none cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              disabled={alreadyVouched}
              className="text-xs font-semibold text-dark/60 hover:text-dark bg-dark/5 hover:bg-dark/8 px-3 py-1.5 rounded-full border-none cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {alreadyVouched ? 'You vouched for this person' : `Vouch for ${listerName}`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
