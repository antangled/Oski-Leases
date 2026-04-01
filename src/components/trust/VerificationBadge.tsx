import { Shield, ShieldCheck, Star } from 'lucide-react';
import type { VerificationTier } from '../../types/user';

interface Props {
  tier: VerificationTier;
}

const tierConfig = {
  bronze: {
    icon: Shield,
    label: 'Verified',
    className: 'text-slate-500 bg-slate-100 border-slate-200',
    iconClassName: 'text-slate-400',
  },
  silver: {
    icon: ShieldCheck,
    label: 'Verified',
    className: 'text-dark/70 bg-dark/5 border-dark/10',
    iconClassName: 'text-dark/50',
  },
  gold: {
    icon: Star,
    label: 'Gold Verified',
    className: 'text-amber-800 bg-gold/15 border-gold/30 animate-shimmer',
    iconClassName: 'text-gold',
  },
} as const;

export default function VerificationBadge({ tier }: Props) {
  const config = tierConfig[tier];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${config.className}`}
      style={tier === 'gold' ? { backgroundImage: 'linear-gradient(90deg, rgba(253,181,21,0.1), rgba(255,212,102,0.2), rgba(253,181,21,0.1))', backgroundSize: '200% 100%' } : undefined}
    >
      <Icon size={11} className={config.iconClassName} fill={tier === 'gold' ? 'currentColor' : 'none'} />
      {config.label}
    </span>
  );
}
