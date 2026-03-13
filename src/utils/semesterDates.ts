/**
 * Berkeley Academic Calendar semester date ranges.
 * Used by the Create Listing form for bidirectional semester ↔ date sync.
 */

export interface SemesterDateRange {
  label: string;   // e.g. "Fall '26"
  start: string;   // ISO date, e.g. "2026-08-26"
  end: string;     // ISO date, e.g. "2026-12-18"
}

/** Official UC Berkeley academic calendar dates */
export const SEMESTER_DATES: SemesterDateRange[] = [
  { label: "Spring '26", start: '2026-01-20', end: '2026-05-15' },
  { label: "Summer '26", start: '2026-05-26', end: '2026-08-14' },
  { label: "Fall '26",   start: '2026-08-26', end: '2026-12-18' },
  { label: "Spring '27", start: '2027-01-19', end: '2027-05-14' },
  { label: "Summer '27", start: '2027-05-26', end: '2027-08-13' },
  { label: "Fall '27",   start: '2027-08-25', end: '2027-12-17' },
];

/**
 * Given start and end dates, find which semester(s) they overlap with.
 * Returns the labels of all matching semesters.
 */
export function getMatchingSemesters(startDate: string, endDate: string): string[] {
  if (!startDate || !endDate) return [];

  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');

  return SEMESTER_DATES
    .filter((sem) => {
      const semStart = new Date(sem.start + 'T00:00:00');
      const semEnd = new Date(sem.end + 'T00:00:00');
      // Check if the listing dates substantially overlap with this semester
      // (listing starts before semester ends AND listing ends after semester starts)
      return start <= semEnd && end >= semStart;
    })
    .map((sem) => sem.label);
}

/**
 * Given an array of selected semester labels, compute the combined date range
 * (earliest start to latest end).
 */
export function getCombinedDateRange(selectedLabels: string[]): { start: string; end: string } | null {
  const selected = SEMESTER_DATES.filter((s) => selectedLabels.includes(s.label));
  if (selected.length === 0) return null;

  const starts = selected.map((s) => s.start).sort();
  const ends = selected.map((s) => s.end).sort();

  return {
    start: starts[0],
    end: ends[ends.length - 1],
  };
}
