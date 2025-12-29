import { config } from '../config';
import { mockDataService } from './mockDataService';
import { realDataService } from './realDataService';
import { Match, MatchStatus, Sport } from '../types/api.types';

/**
 * DataService - Unified service that switches between mock and real data
 * based on USE_MOCK_DATA environment variable
 */
class DataService {
    /**
     * Get matches by sport and optional status filter
     */
    async getMatchesBySport(sport: Sport, status?: MatchStatus): Promise<Match[]> {
        if (config.useMockData) {
            console.log(`📦 [MOCK MODE] Fetching ${sport} matches (status: ${status || 'all'})`);
            return mockDataService.getMatchesBySport(sport, status);
        } else {
            console.log(`🌐 [REAL MODE] Fetching ${sport} matches from API (status: ${status || 'all'})`);
            return await realDataService.getMatchesBySport(sport, status);
        }
    }

    /**
     * Get all live matches across all sports
     */
    async getLiveMatches(): Promise<Match[]> {
        if (config.useMockData) {
            console.log('📦 [MOCK MODE] Fetching all live matches');
            return mockDataService.getLiveMatches();
        } else {
            console.log('🌐 [REAL MODE] Fetching all live matches from APIs');
            return await realDataService.getLiveMatches();
        }
    }

    /**
     * Get match by ID
     */
    async getMatchById(matchId: string): Promise<Match | null> {
        if (config.useMockData) {
            console.log(`📦 [MOCK MODE] Fetching match: ${matchId}`);
            return mockDataService.getMatchById(matchId);
        } else {
            console.log(`🌐 [REAL MODE] Fetching match from API: ${matchId}`);
            return await realDataService.getMatchById(matchId);
        }
    }

    /**
     * Get list of supported sports
     */
    getSports() {
        // Sports list is the same for both mock and real modes
        return mockDataService.getSports();
    }

    /**
     * Get current mode (mock or real)
     */
    getMode(): 'mock' | 'real' {
        return config.useMockData ? 'mock' : 'real';
    }
}

export const dataService = new DataService();
