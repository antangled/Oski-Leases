import type { TrustPath } from '../../types/user';
import { getConnectionLabel, getConnectionColor } from '../../utils/trustPath';
import { ArrowRight, Users, Link2, Globe } from 'lucide-react';

interface Props {
  trustPath: TrustPath;
  compact?: boolean;
}

export default function TrustPathDisplay({ trustPath, compact = false }: Props) {
  if (trustPath.strength === 'none') {
    if (compact) return null;
    return (
      <div className="flex items-center gap-1.5 text-[11px] text-dark/35">
        <Globe size={11} />
        <span>No connections yet</span>
      </div>
    );
  }

  const colorClasses = getConnectionColor(trustPath.strength);

  // Compact mode: just show the indicator pill
  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colorClasses}`}>
        {trustPath.strength === 'mutual' && <Users size={9} />}
        {trustPath.strength === 'connected' && <Link2 size={9} />}
        {trustPath.strength === 'community' && <Users size={9} />}
        {getConnectionLabel(trustPath.strength)}
      </span>
    );
  }

  // Full mode: show the trust path chain
  return (
    <div className={`rounded-xl p-3 border ${colorClasses}`}>
      {/* Connection label */}
      <div className="flex items-center gap-1.5 mb-2">
        {trustPath.strength === 'mutual' && <Users size={13} />}
        {trustPath.strength === 'connected' && <Link2 size={13} />}
        {trustPath.strength === 'community' && <Users size={13} />}
        <span className="text-xs font-bold">{getConnectionLabel(trustPath.strength)}</span>
      </div>

      {/* Visual trust chain */}
      {trustPath.path.length > 0 && (
        <div className="flex items-center gap-1.5 mb-2">
          {trustPath.path.map((person, i) => (
            <div key={person.id} className="flex items-center gap-1.5">
              {i > 0 && <ArrowRight size={10} className="text-dark/30 shrink-0" />}
              <div className="flex items-center gap-1">
                {person.profilePic && (
                  <img
                    src={person.profilePic}
                    alt={person.name}
                    className="w-5 h-5 rounded-full shrink-0"
                  />
                )}
                <span className="text-[11px] font-medium text-dark/70 whitespace-nowrap">
                  {i === 0 ? 'You' : person.name.split(' ')[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Shared groups */}
      {trustPath.sharedGroups.length > 0 && (
        <p className="text-[10px] text-dark/50">
          Both in {trustPath.sharedGroups.slice(0, 2).join(' and ')}
          {trustPath.sharedGroups.length > 2 && ` +${trustPath.sharedGroups.length - 2} more`}
        </p>
      )}
    </div>
  );
}
