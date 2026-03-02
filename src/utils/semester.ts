/**
 * Berkeley semester system:
 *   Fall: Aug–Dec
 *   Spring: Jan–May
 *   Summer: Jun–Jul
 *
 * Determines the semester a listing primarily covers based on its start date.
 */

export type Semester = string; // e.g. "Fall '26", "Spring '27"

export interface SemesterColors {
  bg: string;
  text: string;
  border: string;
}

export function getSemesterColors(semester: string): SemesterColors {
  if (semester.startsWith('Fall')) return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
  if (semester.startsWith('Spring')) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
  // Summer
  return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
}

export function getSemester(startDate: string): Semester {
  const d = new Date(startDate + 'T00:00:00');
  const month = d.getMonth(); // 0-indexed
  const yearShort = String(d.getFullYear()).slice(-2);

  if (month >= 7) return `Fall '${yearShort}`;       // Aug–Dec → Fall
  if (month >= 4) return `Summer '${yearShort}`;     // May–Jul → Summer
  return `Spring '${yearShort}`;                      // Jan–Apr → Spring
}

/**
 * Returns all unique semesters from a list of listings, sorted chronologically.
 */
export function getUniqueSemesters(listings: { availability: { start: string } }[]): Semester[] {
  const set = new Set<string>();
  listings.forEach((l) => set.add(getSemester(l.availability.start)));

  // Sort: Spring < Summer < Fall within same year, then by year
  const order: Record<string, number> = { Spring: 0, Summer: 1, Fall: 2 };
  return [...set].sort((a, b) => {
    const [aSem, aYear] = a.split(" '");
    const [bSem, bYear] = b.split(" '");
    if (aYear !== bYear) return +aYear - +bYear;
    return (order[aSem] ?? 0) - (order[bSem] ?? 0);
  });
}
