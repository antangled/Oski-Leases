import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { UserProfile, CommunityAffiliation, Vouch } from '../types/user';
import { useAuth } from './AuthContext';
import { seedProfiles, getProfileByEmail } from '../data/seedProfiles';

interface UserProfileContextType {
  profile: UserProfile | null;
  allProfiles: UserProfile[];
  updateProfile: (updates: Partial<UserProfile>) => void;
  isProfileComplete: boolean;
  getProfileById: (id: string) => UserProfile | undefined;
  addVouch: (toUserId: string, vouch: Vouch) => void;
}

const PROFILE_KEY = 'oskilease_user_profile';
const ALL_PROFILES_KEY = 'oskilease_all_profiles';

const UserProfileContext = createContext<UserProfileContextType>({
  profile: null,
  allProfiles: [],
  updateProfile: () => {},
  isProfileComplete: false,
  getProfileById: () => undefined,
  addVouch: () => {},
});

export function useUserProfile() {
  return useContext(UserProfileContext);
}

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>(() => {
    try {
      const raw = localStorage.getItem(ALL_PROFILES_KEY);
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return seedProfiles;
  });

  // Load/create profile when user changes
  useEffect(() => {
    if (!user?.email) {
      setProfile(null);
      return;
    }

    // Try localStorage first
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UserProfile;
        if (parsed.email === user.email) {
          setProfile(parsed);
          return;
        }
      }
    } catch { /* ignore */ }

    // Try seed profiles
    const seedProfile = getProfileByEmail(user.email);
    if (seedProfile) {
      setProfile(seedProfile);
      localStorage.setItem(PROFILE_KEY, JSON.stringify(seedProfile));
      return;
    }

    // Create new profile
    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      email: user.email,
      displayName: user.email.split('@')[0],
      verificationTier: 'bronze',
      trustLevel: 'new-bear',
      affiliations: [],
      vouches: [],
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };
    setProfile(newProfile);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
  }, [user?.email]);

  // Persist allProfiles
  useEffect(() => {
    localStorage.setItem(ALL_PROFILES_KEY, JSON.stringify(allProfiles));
  }, [allProfiles]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
      // Also update in allProfiles
      setAllProfiles((all) => {
        const idx = all.findIndex((p) => p.id === updated.id);
        if (idx >= 0) {
          const copy = [...all];
          copy[idx] = updated;
          return copy;
        }
        return [...all, updated];
      });
      return updated;
    });
  }, []);

  const getProfileById = useCallback(
    (id: string) => allProfiles.find((p) => p.id === id),
    [allProfiles],
  );

  const addVouch = useCallback((toUserId: string, vouch: Vouch) => {
    setAllProfiles((all) => {
      return all.map((p) => {
        if (p.id !== toUserId) return p;
        return { ...p, vouches: [...p.vouches, vouch] };
      });
    });
  }, []);

  const isProfileComplete = !!(
    profile?.displayName &&
    profile?.year &&
    profile?.major &&
    profile.affiliations.length > 0
  );

  return (
    <UserProfileContext.Provider
      value={{ profile, allProfiles, updateProfile, isProfileComplete, getProfileById, addVouch }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}
