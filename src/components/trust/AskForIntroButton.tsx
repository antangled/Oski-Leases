import { useState } from 'react';
import type { TrustPath } from '../../types/user';
import { UserPlus, Check, Send } from 'lucide-react';

interface Props {
  trustPath: TrustPath;
  listerName: string;
}

export default function AskForIntroButton({ trustPath, listerName }: Props) {
  const [asked, setAsked] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Only show if there's a friend-of-friend connection (2-hop path)
  if (trustPath.strength !== 'connected' || trustPath.path.length < 3) return null;

  const mutualFriend = trustPath.path[1]; // The person in the middle

  if (asked) {
    return (
      <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200">
        <Check size={14} />
        <span className="text-xs font-medium">
          Intro request sent to {mutualFriend.name.split(' ')[0]}
        </span>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/60">
        <p className="text-xs text-dark/60 mb-2">
          Ask <span className="font-semibold">{mutualFriend.name}</span> to introduce you to {listerName}:
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Hey ${mutualFriend.name.split(' ')[0]}, I'm interested in ${listerName}'s place on OskiLease. Could you put in a good word?`}
          rows={2}
          className="w-full px-3 py-2 text-sm border border-dark/12 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 bg-white text-dark resize-none mb-2"
        />
        <div className="flex gap-2">
          <button
            onClick={() => { setAsked(true); setShowForm(false); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gold text-dark text-xs font-semibold rounded-lg hover:bg-gold-dark transition-colors cursor-pointer border-none"
          >
            <Send size={12} />
            Send Request
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="px-4 py-2 bg-dark/5 text-dark/60 text-xs font-medium rounded-lg hover:bg-dark/10 transition-colors cursor-pointer border-none"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="flex items-center gap-2 w-full py-2.5 px-4 bg-amber-50/60 text-amber-700 font-medium rounded-xl hover:bg-amber-50 transition-colors cursor-pointer border border-amber-200/60 text-sm"
    >
      <UserPlus size={15} />
      Ask {mutualFriend.name.split(' ')[0]} to introduce you
    </button>
  );
}
