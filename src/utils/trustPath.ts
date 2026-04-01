import type { UserProfile, TrustPath, ConnectionStrength } from '../types/user';

/**
 * Computes the trust path between the current user and a target user
 * through the social graph (friend connections + shared affiliations).
 *
 * Returns up to 2-hop paths (friend-of-friend). Beyond that, trust
 * signal is too weak to be meaningful.
 */
export function computeTrustPath(
  currentUser: UserProfile | null,
  targetUserId: string,
  allProfiles: UserProfile[],
): TrustPath {
  const noConnection: TrustPath = { strength: 'none', path: [], sharedGroups: [] };
  if (!currentUser || currentUser.id === targetUserId) return noConnection;

  const target = allProfiles.find(p => p.id === targetUserId);
  if (!target) return noConnection;

  // Check shared affiliations (community-level trust)
  const sharedGroups = currentUser.affiliations
    .filter(ua => target.affiliations.some(ta => ta.name === ua.name))
    .map(a => a.name);

  // Direct friend (1 hop)
  if (currentUser.friendIds?.includes(targetUserId)) {
    return {
      strength: 'mutual',
      path: [
        { id: currentUser.id, name: currentUser.displayName, profilePic: currentUser.profilePic },
        { id: target.id, name: target.displayName, profilePic: target.profilePic },
      ],
      sharedGroups,
    };
  }

  // Friend-of-friend (2 hops) — check if any of current user's friends are friends with target
  const currentFriends = currentUser.friendIds ?? [];
  for (const friendId of currentFriends) {
    const friend = allProfiles.find(p => p.id === friendId);
    if (!friend) continue;
    if (friend.friendIds?.includes(targetUserId)) {
      return {
        strength: 'connected',
        path: [
          { id: currentUser.id, name: currentUser.displayName, profilePic: currentUser.profilePic },
          { id: friend.id, name: friend.displayName, profilePic: friend.profilePic },
          { id: target.id, name: target.displayName, profilePic: target.profilePic },
        ],
        sharedGroups,
      };
    }
  }

  // Also check vouches as implicit connections
  const vouchedByCurrentUser = target.vouches.some(v => v.fromUserId === currentUser.id);
  if (vouchedByCurrentUser) {
    return {
      strength: 'mutual',
      path: [
        { id: currentUser.id, name: currentUser.displayName, profilePic: currentUser.profilePic },
        { id: target.id, name: target.displayName, profilePic: target.profilePic },
      ],
      sharedGroups,
    };
  }

  // Check if someone who vouched for the target is a friend of current user
  for (const vouch of target.vouches) {
    if (currentFriends.includes(vouch.fromUserId)) {
      const friend = allProfiles.find(p => p.id === vouch.fromUserId);
      if (friend) {
        return {
          strength: 'connected',
          path: [
            { id: currentUser.id, name: currentUser.displayName, profilePic: currentUser.profilePic },
            { id: friend.id, name: friend.displayName, profilePic: friend.profilePic },
            { id: target.id, name: target.displayName, profilePic: target.profilePic },
          ],
          sharedGroups,
        };
      }
    }
  }

  // Shared community only
  if (sharedGroups.length > 0) {
    return { strength: 'community', path: [], sharedGroups };
  }

  return noConnection;
}

export function getConnectionLabel(strength: ConnectionStrength): string {
  switch (strength) {
    case 'mutual': return 'You know them';
    case 'connected': return 'Friend of a friend';
    case 'community': return 'Same community';
    case 'none': return 'No connections yet';
  }
}

export function getConnectionColor(strength: ConnectionStrength): string {
  switch (strength) {
    case 'mutual': return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'connected': return 'text-amber-500 bg-amber-50/60 border-amber-200/60';
    case 'community': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'none': return 'text-dark/40 bg-dark/5 border-dark/10';
  }
}
