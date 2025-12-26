import { Sport, MatchStatus } from './sport.types';

// Re-export for convenience
export type { Sport, MatchStatus };

export interface Team {
    id: string;
    name: string;
    logo?: string;
    score?: Score;
    initials?: string;
}

export interface Score {
    // Cricket
    runs?: number;
    wickets?: number;
    overs?: string;

    // American Football
    points?: number;
    quarter?: string;
    timeRemaining?: string;

    // Hockey
    goals?: number;
    period?: string;
    timeLeft?: string;

    // Soccer
    half?: string;
    minute?: string;

    // Tennis / Badminton
    sets?: number[];
    games?: number;
    currentSet?: number;
    serving?: boolean;
}

export interface Venue {
    name: string;
    city: string;
    state?: string;
    country: string;
    capacity?: number;
}

export interface Match {
    id: string;
    sport: Sport;
    status: MatchStatus;
    homeTeam: Team;
    awayTeam: Team;
    venue: Venue;
    startTime: string;
    tournament?: string;
    format?: string; // For cricket: ODI, T20, Test
    round?: string; // For tennis/badminton: Quarterfinal, etc.
}

export interface MatchDetail extends Match {
    tossWinner?: string;
    tossDecision?: string;
    umpires?: string[];
    referee?: string;
    commentary?: CommentaryItem[];
    players?: {
        home: Player[];
        away: Player[];
    };
}

export interface CommentaryItem {
    over?: string;
    time?: string;
    text: string;
}

export interface Player {
    id: string;
    name: string;
    role?: string;
}
