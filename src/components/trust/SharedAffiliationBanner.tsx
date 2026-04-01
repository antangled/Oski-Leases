import { Users } from 'lucide-react';
import type { CommunityAffiliation } from '../../types/user';
import { findSharedAffiliations, formatSharedAffiliations } from '../../utils/affiliationMatching';

interface Props {
  userAffiliations: CommunityAffiliation[];
  listerAffiliations: string[];
}

export default function SharedAffiliationBanner({ userAffiliations, listerAffiliations }: Props) {
  // Convert lister affiliation strings to CommunityAffiliation objects by matching against user affiliations
  const listerAffiliationObjects: CommunityAffiliation[] = userAffiliations
    .filter((ua) => listerAffiliations.includes(ua.name))
    .map((ua) => ({ type: ua.type, name: ua.name }));

  // Also include lister affiliations that weren't matched via user affiliations
  // (match by name alone, default type to 'club')
  for (const name of listerAffiliations) {
    if (!listerAffiliationObjects.some((la) => la.name === name)) {
      const userMatch = userAffiliations.find((ua) => ua.name === name);
      if (userMatch) {
        listerAffiliationObjects.push({ type: userMatch.type, name });
      } else {
        listerAffiliationObjects.push({ type: 'club', name });
      }
    }
  }

  const shared = findSharedAffiliations(userAffiliations, listerAffiliationObjects);

  if (shared.length === 0) return null;

  const formatted = formatSharedAffiliations(shared);

  return (
    <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gold/8 border border-gold/15">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/15 shrink-0">
        <Users size={14} className="text-gold" />
      </div>
      <p className="text-sm text-dark/80">
        <span className="font-semibold">You&apos;re both in {formatted}</span>
      </p>
    </div>
  );
}
