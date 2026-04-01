import type { NarrativeReference } from '../../types/user';
import { ThumbsUp, ThumbsDown, Quote } from 'lucide-react';

interface Props {
  refs: NarrativeReference[];
  listerName: string;
}

export default function NarrativeRefSection({ refs, listerName }: Props) {
  if (!refs || refs.length === 0) return null;

  const wouldAgainCount = refs.filter(r => r.wouldSubletAgain).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-dark/50 uppercase tracking-wide flex items-center gap-1.5">
          <Quote size={11} className="text-gold" />
          What past subleasees say
        </h4>
        <span className="text-[11px] text-emerald-600 font-medium">
          {wouldAgainCount}/{refs.length} would sublet again
        </span>
      </div>

      {refs.map((ref) => (
        <div key={ref.id} className="bg-cream rounded-xl p-4 border border-dark/5">
          <div className="flex items-center gap-2 mb-2">
            {ref.fromProfilePic && (
              <img src={ref.fromProfilePic} alt={ref.fromName} className="w-7 h-7 rounded-full" />
            )}
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-dark">{ref.fromName}</span>
              <span className="text-[10px] text-dark/30 ml-2">
                {new Date(ref.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              ref.wouldSubletAgain
                ? 'text-emerald-600 bg-emerald-50 border border-emerald-200'
                : 'text-red-500 bg-red-50 border border-red-200'
            }`}>
              {ref.wouldSubletAgain ? <ThumbsUp size={9} /> : <ThumbsDown size={9} />}
              {ref.wouldSubletAgain ? 'Would sublet again' : 'Would not sublet again'}
            </span>
          </div>
          <p className="text-sm text-dark/60 leading-relaxed italic">"{ref.narrative}"</p>
        </div>
      ))}
    </div>
  );
}
