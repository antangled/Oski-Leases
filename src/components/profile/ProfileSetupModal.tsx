import { useState, useMemo } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Search } from 'lucide-react';
import { useUserProfile } from '../../contexts/UserProfileContext';
import {
  MAJORS,
  getAffiliationsByType,
  AFFILIATION_TYPE_LABELS,
} from '../../data/berkeleyAffiliations';
import type { AffiliationType, CommunityAffiliation } from '../../types/user';

interface Props {
  onClose: () => void;
}

const YEARS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];
const AFFILIATION_TYPES: AffiliationType[] = ['greek', 'coop', 'club', 'major', 'dorm', 'sport'];

export default function ProfileSetupModal({ onClose }: Props) {
  const { profile, updateProfile } = useUserProfile();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(profile?.displayName || '');
  const [year, setYear] = useState(profile?.year || '');
  const [major, setMajor] = useState(profile?.major || '');
  const [majorSearch, setMajorSearch] = useState('');
  const [affiliations, setAffiliations] = useState<CommunityAffiliation[]>(
    profile?.affiliations || [],
  );
  const [bio, setBio] = useState(profile?.bio || '');

  const filteredMajors = useMemo(
    () =>
      majorSearch
        ? MAJORS.filter((m) => m.toLowerCase().includes(majorSearch.toLowerCase()))
        : MAJORS,
    [majorSearch],
  );

  function toggleAffiliation(type: AffiliationType, affiliationName: string) {
    setAffiliations((prev) => {
      const exists = prev.some((a) => a.type === type && a.name === affiliationName);
      if (exists) return prev.filter((a) => !(a.type === type && a.name === affiliationName));
      return [...prev, { type, name: affiliationName }];
    });
  }

  function handleComplete() {
    updateProfile({
      displayName: name.trim(),
      year,
      major,
      affiliations,
      bio: bio.trim() || undefined,
    });
    onClose();
  }

  const canProceedStep1 = name.trim() && year && major;
  const canProceedStep2 = affiliations.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/40 backdrop-blur-sm">
      <div className="animate-modal-in bg-cream rounded-2xl shadow-xl border border-dark/8 w-full max-w-lg mx-4 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark/8">
          <div>
            <h2 className="text-lg font-bold text-dark">Complete Your Profile</h2>
            <p className="text-xs text-dark/50 mt-0.5">Step {step} of 3</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-dark/5 transition-colors bg-transparent border-none cursor-pointer"
          >
            <X size={18} className="text-dark/50" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex gap-1.5 px-5 pt-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-gold' : 'bg-dark/10'
              }`}
            />
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {step === 1 && (
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-dark/10 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 placeholder:text-dark/30"
                />
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-dark/10 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 text-dark"
                >
                  <option value="">Select your year</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Major — searchable */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">Major</label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30" />
                  <input
                    type="text"
                    value={major || majorSearch}
                    onChange={(e) => {
                      setMajorSearch(e.target.value);
                      if (major) setMajor('');
                    }}
                    placeholder="Search majors..."
                    className="w-full text-sm pl-8 pr-3.5 py-2.5 rounded-xl border border-dark/10 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 placeholder:text-dark/30"
                  />
                </div>
                {!major && majorSearch && (
                  <div className="mt-1.5 max-h-36 overflow-y-auto rounded-xl border border-dark/10 bg-white shadow-md">
                    {filteredMajors.map((m) => (
                      <button
                        key={m}
                        onClick={() => { setMajor(m); setMajorSearch(''); }}
                        className="w-full text-left text-sm px-3.5 py-2 hover:bg-gold/10 transition-colors bg-transparent border-none cursor-pointer text-dark"
                      >
                        {m}
                      </button>
                    ))}
                    {filteredMajors.length === 0 && (
                      <p className="text-xs text-dark/40 px-3.5 py-2">No majors found</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {/* Selected pills */}
              {affiliations.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {affiliations.map((a) => (
                    <button
                      key={`${a.type}-${a.name}`}
                      onClick={() => toggleAffiliation(a.type, a.name)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gold/15 text-dark border border-gold/30 cursor-pointer hover:bg-gold/25 transition-colors"
                    >
                      {a.name}
                      <X size={10} />
                    </button>
                  ))}
                </div>
              )}

              {/* Grouped affiliations */}
              {AFFILIATION_TYPES.map((type) => {
                const options = getAffiliationsByType(type);
                return (
                  <div key={type}>
                    <h3 className="text-xs font-bold text-dark/60 uppercase tracking-wide mb-2">
                      {AFFILIATION_TYPE_LABELS[type]}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {options.map((opt) => {
                        const isSelected = affiliations.some(
                          (a) => a.type === type && a.name === opt,
                        );
                        return (
                          <button
                            key={opt}
                            onClick={() => toggleAffiliation(type, opt)}
                            className={`text-[11px] font-medium px-2.5 py-1 rounded-full border cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-dark text-white border-dark'
                                : 'bg-white text-dark/70 border-dark/10 hover:border-dark/20 hover:bg-dark/5'
                            }`}
                          >
                            {isSelected && <Check size={10} className="inline mr-0.5" />}
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {step === 3 && (
            <div>
              <label className="block text-sm font-semibold text-dark mb-1.5">
                Short Bio
              </label>
              <p className="text-xs text-dark/50 mb-2">
                Tell other Bears a bit about yourself. This shows on your listing profile.
              </p>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Junior, Data Science. Going on study abroad this fall..."
                maxLength={300}
                rows={4}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-dark/10 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 placeholder:text-dark/30 resize-none"
              />
              <p className="text-[10px] text-dark/30 mt-1 text-right">{bio.length}/300</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-dark/8">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1 text-sm font-medium text-dark/60 hover:text-dark bg-transparent border-none cursor-pointer transition-colors"
            >
              <ChevronLeft size={15} />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
              className="inline-flex items-center gap-1.5 text-sm font-bold px-5 py-2.5 rounded-full bg-gold text-dark border-none cursor-pointer hover:bg-gold/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={15} />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="inline-flex items-center gap-1.5 text-sm font-bold px-5 py-2.5 rounded-full bg-gold text-dark border-none cursor-pointer hover:bg-gold/80 transition-colors"
            >
              <Check size={15} />
              Complete Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
