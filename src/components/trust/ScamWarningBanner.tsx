import { useState } from 'react';
import { AlertTriangle, AlertOctagon, ChevronDown, ChevronUp } from 'lucide-react';
import type { ScamFlag } from '../../utils/scamDetection';

interface Props {
  flags: ScamFlag[];
}

export default function ScamWarningBanner({ flags }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (flags.length === 0) return null;

  const hasDanger = flags.some((f) => f.severity === 'danger');
  const borderColor = hasDanger ? 'border-red-300' : 'border-amber-300';
  const bgColor = hasDanger ? 'bg-red-50' : 'bg-amber-50';
  const headerTextColor = hasDanger ? 'text-red-800' : 'text-amber-800';

  return (
    <div className={`rounded-2xl border ${borderColor} ${bgColor} overflow-hidden`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center gap-2.5 px-4 py-3 bg-transparent border-none cursor-pointer ${headerTextColor}`}
      >
        {hasDanger ? (
          <AlertOctagon size={16} className="text-red-500 shrink-0" />
        ) : (
          <AlertTriangle size={16} className="text-amber-500 shrink-0" />
        )}
        <span className="text-sm font-semibold flex-1 text-left">
          This listing has {flags.length} potential concern{flags.length !== 1 ? 's' : ''}
        </span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Expandable details */}
      {expanded && (
        <div className="px-4 pb-3 space-y-2.5">
          {flags.map((flag, i) => {
            const isDanger = flag.severity === 'danger';
            return (
              <div
                key={i}
                className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl ${isDanger ? 'bg-red-100/60' : 'bg-amber-100/60'}`}
              >
                {isDanger ? (
                  <AlertOctagon size={13} className="text-red-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle size={13} className="text-amber-500 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <p className={`text-xs font-semibold ${isDanger ? 'text-red-800' : 'text-amber-800'}`}>
                    {flag.message}
                  </p>
                  <p className={`text-[11px] leading-relaxed mt-0.5 ${isDanger ? 'text-red-700/70' : 'text-amber-700/70'}`}>
                    {flag.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
