export type Sport = 'cricket' | 'football' | 'hockey' | 'soccer' | 'tennis' | 'badminton';

export interface SportConfig {
    id: Sport;
    name: string;
    icon: string;
    hasHomeAway: boolean;
    color: string;
}

export type MatchStatus = 'live' | 'upcoming' | 'completed';
