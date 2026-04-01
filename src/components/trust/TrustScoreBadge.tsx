import type { TrustLevel } from '../../types/user';

interface Props {
  level: TrustLevel;
}

const levelConfig = {
  'new-bear': {
    label: 'New Bear',
    className: 'text-dark/60 bg-dark/5 border-dark/8 text-[10px]',
  },
  'trusted-bear': {
    label: 'Trusted Bear',
    className: 'text-white bg-dark border-dark text-[10px]',
  },
  'golden-bear': {
    label: 'Golden Bear',
    className: 'text-dark bg-gold border-gold/50 text-[10px] font-bold',
  },
} as const;

export default function TrustScoreBadge({ level }: Props) {
  const config = levelConfig[level];

  return (
    <span className={`inline-flex items-center gap-1 font-semibold px-2.5 py-0.5 rounded-full border ${config.className}`}>
      {level === 'golden-bear' && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
          <path d="M12 2C8 2 5 5 5 5S2 8 2 10c0 2 1.5 3 3 3 .5 0 1-.2 1.5-.5C7 14.5 9.5 16 12 16s5-1.5 5.5-3.5c.5.3 1 .5 1.5.5 1.5 0 3-1 3-3 0-2-3-5-3-5s-3-3-7-3zm-3.5 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm7 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM12 22c-3 0-5.5-1-6.5-2.5C6 21 8.5 22 12 22s6-1 6.5-2.5C17.5 21 15 22 12 22z" />
        </svg>
      )}
      {config.label}
    </span>
  );
}
