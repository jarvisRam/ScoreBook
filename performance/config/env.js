// Targets are resolved from environment variables so the same script runs against a mocked
// stack on the runner or against the hosted environment. scripts/run.js sets these per suite.
const trim = (value) => value.replace(/\/+$/, '');

// Accepts either the backend root or the /api URL (the form the mobile app uses)
export const API_ORIGIN = trim(trim(__ENV.API_BASE_URL || 'http://localhost:3000').replace(/\/api$/, ''));
export const WEB_URL = trim(__ENV.WEB_BASE_URL || 'http://localhost:8081');

export const PROFILE = __ENV.PERF_PROFILE || 'standard';

// Mirrors tests/support/sports.ts, deliberately hardcoded so a dropped sport fails the suite
export const SPORTS = ['cricket', 'football', 'hockey', 'soccer', 'tennis', 'badminton'];
export const STATUSES = ['live', 'upcoming', 'completed'];
