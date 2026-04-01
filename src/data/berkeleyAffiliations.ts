import type { AffiliationType } from '../types/user';

export interface AffiliationOption {
  type: AffiliationType;
  name: string;
}

export const GREEK_ORGS: string[] = [
  'Alpha Epsilon Pi', 'Alpha Phi', 'Alpha Tau Omega', 'Beta Theta Pi',
  'Chi Omega', 'Delta Delta Delta', 'Delta Gamma', 'Delta Kappa Epsilon',
  'Gamma Phi Beta', 'Kappa Alpha Theta', 'Kappa Kappa Gamma', 'Kappa Sigma',
  'Lambda Chi Alpha', 'Phi Delta Theta', 'Phi Gamma Delta (FIJI)',
  'Phi Kappa Psi', 'Phi Kappa Sigma', 'Pi Beta Phi', 'Pi Kappa Alpha',
  'Pi Kappa Phi', 'Sigma Alpha Epsilon', 'Sigma Chi', 'Sigma Nu',
  'Sigma Phi Epsilon', 'Theta Chi', 'Theta Delta Chi', 'Zeta Beta Tau',
  'Zeta Psi',
];

export const COOPS: string[] = [
  'CZ (Casa Zimbabwe)', 'Cloyne Court', 'Davis House', 'Euclid Hall',
  'Fenwick Weavers', 'Hoyt Hall', 'Kingman Hall', 'Lothlorien',
  'Oscar Wilde House', 'Ridge House', 'Stebbins Hall', 'Wolf House',
];

export const POPULAR_CLUBS: string[] = [
  'Blockchain at Berkeley', 'CalHacks', 'Codebase', 'Data Science Society',
  'Machine Learning at Berkeley', 'Berkeley Consulting', 'BFSA (Finance)',
  'BEAM (Entrepreneurship)', 'Debate Society', 'Daily Californian',
  'SUPERB Entertainment', 'Cal Climbing', 'Hiking Club', 'Ballroom Dance',
  'Berkeley Forum', 'Pre-Med Society', 'Engineers Without Borders',
  'Berkeley ACLU', 'Robotics at Berkeley', 'Space Technologies at Cal',
  'Cal Quidditch', 'Photography Club', 'Film Foundation',
  'Berkeley Student Food Collective', 'ASUC Student Government',
];

export const MAJORS: string[] = [
  'Computer Science', 'EECS', 'Data Science', 'Mechanical Engineering',
  'Civil Engineering', 'Chemical Engineering', 'Bioengineering',
  'Business Administration', 'Economics', 'Political Science', 'Psychology',
  'Sociology', 'English', 'History', 'Philosophy', 'Rhetoric',
  'Environmental Science', 'Molecular & Cell Biology', 'Integrative Biology',
  'Chemistry', 'Physics', 'Mathematics', 'Statistics', 'Architecture',
  'Public Health', 'Public Policy', 'Cognitive Science', 'Linguistics',
  'Media Studies', 'Ethnic Studies', 'Legal Studies', 'Astronomy',
];

export const DORMS: string[] = [
  'Unit 1', 'Unit 2', 'Unit 3', 'Blackwell Hall', 'Bowles Hall',
  'Clark Kerr Campus', 'Foothill', 'Stern Hall', 'Martinez Commons',
];

export const SPORTS: string[] = [
  'Men\'s Basketball', 'Women\'s Basketball', 'Football', 'Swimming',
  'Track & Field', 'Rugby', 'Rowing', 'Volleyball', 'Soccer',
  'Club Baseball', 'Club Soccer', 'Club Swimming', 'Ultimate Frisbee',
  'Water Polo', 'Tennis', 'Gymnastics',
];

export function getAffiliationsByType(type: AffiliationType): string[] {
  switch (type) {
    case 'greek': return GREEK_ORGS;
    case 'coop': return COOPS;
    case 'club': return POPULAR_CLUBS;
    case 'major': return MAJORS;
    case 'dorm': return DORMS;
    case 'sport': return SPORTS;
  }
}

export const AFFILIATION_TYPE_LABELS: Record<AffiliationType, string> = {
  greek: 'Greek Life',
  coop: 'Co-op',
  club: 'Club / Org',
  major: 'Major',
  dorm: 'Dorm / Residence',
  sport: 'Sports',
};
