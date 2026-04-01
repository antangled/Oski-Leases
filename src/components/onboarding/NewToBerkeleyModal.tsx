import { useState, useEffect } from 'react';
import {
  X,
  GraduationCap,
  MapPin,
  DollarSign,
  ShieldAlert,
  Footprints,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  BadgeCheck,
  CreditCard,
} from 'lucide-react';
import { berkeleyNeighborhoods } from '../../data/berkeleyNeighborhoods';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'oskilease-hide-welcome';
const TOTAL_STEPS = 4;

export default function NewToBerkeleyModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (isOpen) setStep(0);
  }, [isOpen]);

  function handleClose() {
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
    onClose();
  }

  function next() {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else handleClose();
  }

  function prev() {
    if (step > 0) setStep(step - 1);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-dark/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto animate-modal-in">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-dark/5 transition-colors z-10"
        >
          <X size={18} className="text-dark/50" />
        </button>

        <div className="p-6">
          {step === 0 && <StepWelcome />}
          {step === 1 && <StepNeighborhoods />}
          {step === 2 && <StepExpectations />}
          {step === 3 && <StepSafety />}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={prev}
              disabled={step === 0}
              className={`flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                step === 0
                  ? 'text-dark/20 cursor-not-allowed'
                  : 'text-dark/60 hover:bg-dark/5'
              }`}
            >
              <ChevronLeft size={14} />
              Back
            </button>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === step ? 'bg-gold' : 'bg-dark/15'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="flex items-center gap-1 text-sm font-bold text-dark bg-gold hover:bg-gold/90 px-4 py-1.5 rounded-lg transition-colors"
            >
              {step === TOTAL_STEPS - 1 ? 'Get Started' : 'Next'}
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Don't show again */}
          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-dark/20 accent-gold"
            />
            <span className="text-[11px] text-dark/40">
              Don't show this again
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

function StepWelcome() {
  return (
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/15 flex items-center justify-center">
        <GraduationCap size={32} className="text-gold" />
      </div>
      <h2 className="font-display text-xl font-bold text-dark mb-2">
        Welcome to Berkeley!
      </h2>
      <p className="text-sm text-dark/60 leading-relaxed max-w-sm mx-auto">
        OskiLease is the trusted platform built by Cal students, for Cal
        students. Find your perfect sublease near campus with verified listings
        and a community you can trust.
      </p>
    </div>
  );
}

function StepNeighborhoods() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
          <MapPin size={20} className="text-gold" />
        </div>
        <h2 className="font-display text-lg font-bold text-dark">
          Know Your Neighborhoods
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-[40vh] overflow-y-auto pr-1">
        {berkeleyNeighborhoods.map((n) => (
          <div
            key={n.slug}
            className="bg-cream rounded-xl border border-dark/5 p-3"
          >
            <h4 className="text-xs font-bold text-dark mb-1">{n.name}</h4>
            <p className="text-[10px] text-dark/50 leading-snug line-clamp-2 mb-1.5">
              {n.vibe}
            </p>
            <div className="flex items-center gap-3 text-[10px] text-dark/60">
              <span className="flex items-center gap-1">
                <Footprints size={9} className="text-gold" />
                {n.walkToCampusMin}min
              </span>
              <span className="flex items-center gap-1">
                <DollarSign size={9} className="text-gold" />
                ${n.avgRent}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepExpectations() {
  const tips = [
    { label: 'Studio / shared room', range: '$800 - $1,200/mo' },
    { label: '1BR apartment', range: '$1,200 - $1,800/mo' },
    { label: 'Full apartment', range: '$1,800 - $2,400/mo' },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
          <DollarSign size={20} className="text-gold" />
        </div>
        <h2 className="font-display text-lg font-bold text-dark">
          What to Expect
        </h2>
      </div>

      <div className="bg-cream rounded-xl p-4 mb-3">
        <h4 className="text-xs font-bold text-dark mb-2">Typical Rent Ranges</h4>
        <div className="space-y-1.5">
          {tips.map((t) => (
            <div key={t.label} className="flex items-center justify-between text-xs">
              <span className="text-dark/60">{t.label}</span>
              <span className="font-semibold text-dark">{t.range}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 text-xs text-dark/60 leading-relaxed">
        <p>
          <strong className="text-dark">Semester timing:</strong> Start looking
          1-2 months before the semester. Fall subleases go fast (May-June).
          Summer subleases are more available and cheaper.
        </p>
        <p>
          <strong className="text-dark">Usually included:</strong> Water, trash,
          and sometimes internet. Gas and electric are often separate.
        </p>
        <p>
          <strong className="text-dark">Usually not included:</strong> Furniture
          (unless listed as furnished), parking, laundry.
        </p>
      </div>
    </div>
  );
}

function StepSafety() {
  const redFlags = [
    'Asking for payment before viewing',
    'Price far below market rate',
    'Pressure to sign immediately',
    'Refusing video calls or in-person tours',
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
          <ShieldAlert size={20} className="text-red-500" />
        </div>
        <h2 className="font-display text-lg font-bold text-dark">Stay Safe</h2>
      </div>

      <div className="bg-red-50 rounded-xl p-4 mb-3">
        <h4 className="text-xs font-bold text-red-700 mb-2 flex items-center gap-1.5">
          <AlertTriangle size={12} />
          Red Flags to Watch For
        </h4>
        <ul className="space-y-1">
          {redFlags.map((flag) => (
            <li
              key={flag}
              className="text-xs text-red-600 flex items-start gap-1.5"
            >
              <span className="text-red-400 mt-0.5">-</span>
              {flag}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-start gap-2">
          <BadgeCheck size={14} className="text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-xs text-dark/60">
            <strong className="text-dark">Verification matters:</strong> Look for
            Bronze, Silver, and Gold verified listers. Higher tiers mean more
            identity checks completed.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <CreditCard size={14} className="text-gold shrink-0 mt-0.5" />
          <p className="text-xs text-dark/60">
            <strong className="text-dark">Never pay off-platform.</strong> Use
            OskiLease's secure channels for all communication and payments to
            stay protected.
          </p>
        </div>
      </div>
    </div>
  );
}
