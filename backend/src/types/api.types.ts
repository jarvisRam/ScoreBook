// Common types
export type MatchStatus = 'live' | 'upcoming' | 'completed';

export type Sport = 'cricket' | 'football' | 'hockey' | 'soccer' | 'tennis' | 'badminton';

// Team interface
export interface Team {
    id: string;
    name: string;
    initials: string;
    logo?: string;
    score?: any; // Sport-specific score structure
}

// Venue interface
export interface Venue {
    name: string;
    city: string;
    country: string;
    state?: string;
    capacity?: number;
}

// Match interface
export interface Match {
    id: string;
    sport: Sport;
    status: MatchStatus;
    homeTeam: Team;
    awayTeam: Team;
    venue: Venue;
    startTime: string;
    tournament: string;
    format?: string;
}

// API Response wrapper
export interface ApiResponse<T> {
    data: T;
    timestamp: number;
    mode: 'mock' | 'real';
}

// Error response
export interface ApiError {
    error: {
        message: string;
        code: string;
        details?: any;
    };
}
