import { api } from './api';
import { MatchesResponse, MatchDetailResponse, HealthResponse } from '../types/api.types';
import { Sport, MatchStatus } from '../types/sport.types';

export const matchService = {
    // Get all live matches across all sports
    getLiveMatches: async () => {
        const response = await api.get<MatchesResponse>('/matches/live');
        return response.data;
    },

    // Get matches for a specific sport with optional status filter
    getMatchesBySport: async (sport: Sport, status?: MatchStatus) => {
        const params = status ? { status } : {};
        const response = await api.get<MatchesResponse>(`/matches/${sport}`, { params });
        return response.data;
    },

    // Get detailed information for a specific match
    getMatchDetail: async (matchId: string) => {
        const response = await api.get<MatchDetailResponse>(`/match/${matchId}`);
        return response.data;
    },

    // Health check
    getHealth: async () => {
        const response = await api.get<HealthResponse>('/health');
        return response.data;
    },
};
