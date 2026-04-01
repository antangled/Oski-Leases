import { GraduationCap, BookOpen, Coffee } from 'lucide-react';
import type { RoommateProfile } from '../../types/user';

interface Props {
  profiles: RoommateProfile[];
}

export default function RoommateProfileCard({ profiles }: Props) {
  if (!profiles || profiles.length === 0) return null;

  return (
    <div className="bg-cream rounded-xl border border-dark/5 p-4">
      <h4 className="font-display text-sm font-bold text-dark mb-3">
        Your Roommates
      </h4>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {profiles.map((profile, i) => {
          const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profile.name
          )}&background=003262&color=FDB515&size=128`;

          return (
            <div
              key={`${profile.name}-${i}`}
              className="flex-shrink-0 w-44 bg-white rounded-xl border border-dark/5 p-3"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <img
                  src={avatarUrl}
                  alt={profile.name}
                  className="w-9 h-9 rounded-full border-2 border-gold/30"
                />
                <span className="text-sm font-semibold text-dark truncate">
                  {profile.name}
                </span>
              </div>

              <div className="space-y-1">
                {profile.year && (
                  <div className="flex items-center gap-1.5 text-[11px] text-dark/60">
                    <GraduationCap size={11} className="text-gold shrink-0" />
                    <span>{profile.year}</span>
                  </div>
                )}
                {profile.major && (
                  <div className="flex items-center gap-1.5 text-[11px] text-dark/60">
                    <BookOpen size={11} className="text-gold shrink-0" />
                    <span className="truncate">{profile.major}</span>
                  </div>
                )}
                {profile.habits && (
                  <div className="flex items-center gap-1.5 text-[11px] text-dark/60">
                    <Coffee size={11} className="text-gold shrink-0" />
                    <span className="truncate">{profile.habits}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
