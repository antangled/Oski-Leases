import { Clock, Send, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  status: 'pending' | 'approved' | 'not-required';
  onChange: (status: string) => void;
}

const STEPS = [
  { key: 'pending', label: 'Not Started / Pending', icon: Clock },
  { key: 'requested', label: 'Requested', icon: Send },
  { key: 'approved', label: 'Approved', icon: CheckCircle },
] as const;

function stepIndex(status: string): number {
  if (status === 'pending') return 0;
  if (status === 'requested') return 1;
  if (status === 'approved') return 2;
  return -1;
}

export default function LandlordApprovalTracker({ status, onChange }: Props) {
  const isNotRequired = status === 'not-required';
  const activeIdx = stepIndex(status);

  return (
    <div className="rounded-2xl border border-dark/8 bg-cream p-4 shadow-md">
      <h4 className="text-sm font-semibold font-display text-dark mb-1">Landlord Approval</h4>
      <p className="text-xs text-dark/50 mb-3">
        Berkeley law requires landlord written consent for most subleases.
      </p>

      {/* Not Required toggle */}
      <label className="flex items-center gap-2 mb-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isNotRequired}
          onChange={() => onChange(isNotRequired ? 'pending' : 'not-required')}
          className="w-4 h-4 rounded border-dark/20 text-gold focus:ring-gold/30 accent-gold"
        />
        <XCircle size={14} className="text-dark/40" />
        <span className="text-sm text-dark/70">Not required (e.g., landlord listing)</span>
      </label>

      {!isNotRequired && (
        <>
          {/* Progress bar */}
          <div className="flex items-center gap-0 mb-3">
            {STEPS.map((step, i) => {
              const isActive = i <= activeIdx;
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex items-center flex-1">
                  <button
                    type="button"
                    onClick={() => onChange(step.key)}
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gold border-gold text-dark'
                        : 'bg-white border-dark/15 text-dark/30'
                    }`}
                  >
                    <Icon size={14} />
                  </button>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-1 rounded-full mx-1 transition-all ${
                        i < activeIdx ? 'bg-gold' : 'bg-dark/10'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step labels */}
          <div className="flex justify-between text-xs text-dark/50">
            {STEPS.map((step) => (
              <span
                key={step.key}
                className={step.key === status ? 'font-semibold text-gold-dark' : ''}
              >
                {step.label}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
