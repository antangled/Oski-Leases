import type { ConversationStarter } from '../../types/user';
import { MessageCircle } from 'lucide-react';

interface Props {
  starters: ConversationStarter[];
  listerName: string;
}

export default function ConversationStarters({ starters, listerName }: Props) {
  if (!starters || starters.length === 0) return null;

  return (
    <div>
      <h4 className="text-xs font-semibold text-dark/50 uppercase tracking-wide mb-2 flex items-center gap-1.5">
        <MessageCircle size={11} className="text-gold" />
        Get to know {listerName.split(' ')[0]}
      </h4>
      <div className="space-y-1.5">
        {starters.map((s, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span className="text-dark/40 text-xs font-medium shrink-0 mt-0.5">{s.prompt}:</span>
            <span className="text-dark/70 italic">{s.answer}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
