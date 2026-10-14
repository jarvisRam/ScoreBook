import fs from 'fs';
import path from 'path';
import type { SportId, StatusId } from './sports';

// The same committed fixtures the backend serves in mock mode and the Maestro
// flows assert on, so all three layers agree on what "the data" is.
const MOCK_DATA_DIR = path.resolve(__dirname, '../../backend/src/mock-data');

export interface MockScore {
    runs?: number;
    wickets?: number;
    overs?: string;
    points?: number;
    goals?: number;
    sets?: number[];
}

export interface MockTeam {
    id: string;
    name: string;
    score?: MockScore;
}

export interface MockMatch {
    id: string;
    sport: SportId;
    status: StatusId;
    homeTeam: MockTeam;
    awayTeam: MockTeam;
    venue: { name: string; city: string; country: string };
    tournament?: string;
    format?: string;
    round?: string;
}

export function loadFixture(sport: SportId, status: StatusId): MockMatch[] {
    const file = path.join(MOCK_DATA_DIR, sport, `${status}.json`);
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

/** Wrap matches in the envelope the backend returns. */
export function matchesEnvelope(data: unknown[]) {
    return { data, timestamp: Date.now(), mode: 'mock' };
}
