import type { CommunityAffiliation } from '../types/user';

export function findSharedAffiliations(
  userAffiliations: CommunityAffiliation[],
  listerAffiliations: CommunityAffiliation[],
): CommunityAffiliation[] {
  return userAffiliations.filter((ua) =>
    listerAffiliations.some(
      (la) => la.type === ua.type && la.name === ua.name,
    ),
  );
}

export function formatSharedAffiliations(shared: CommunityAffiliation[]): string {
  if (shared.length === 0) return '';
  if (shared.length === 1) return shared[0].name;
  if (shared.length === 2) return `${shared[0].name} and ${shared[1].name}`;
  return `${shared[0].name} and ${shared.length - 1} other communities`;
}
