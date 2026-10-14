// Deliberately hardcoded rather than imported from mobile/src/constants: the
// tests should fail if a sport or tab is renamed or dropped by accident.
export const SPORTS = [
    { id: 'cricket', label: 'Cricket' },
    { id: 'football', label: 'American Football' },
    { id: 'hockey', label: 'Hockey' },
    { id: 'soccer', label: 'Soccer' },
    { id: 'tennis', label: 'Tennis' },
    { id: 'badminton', label: 'Badminton' },
] as const;

export const STATUSES = [
    { id: 'live', label: 'Live' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
] as const;

export type SportId = (typeof SPORTS)[number]['id'];
export type StatusId = (typeof STATUSES)[number]['id'];
