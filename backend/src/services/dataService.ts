import { config } from '../config';
import { mockDataService } from './mockDataService';
import { realDataService } from './realDataService';
import { Match, MatchStatus, Sport } from '../types/api.types';

interface CacheEntry {
    data: Match[];
    expiry: number;
}

class DataService {
    private cache = new Map<string, CacheEntry>();

    private getFromCacheOrFetch(cacheKey: string, fetcher: () => Promise<Match[]>): Promise<Match[]> {
        const cached = this.cache.get(cacheKey);
        const now = Date.now();

        if (cached && cached.expiry > now) {
            console.log(`🔄 [CACHE HIT] ${cacheKey} (expires in ${Math.round((cached.expiry - now) / 1000)}s)`);
            return Promise.resolve(cached.data);
        }

        console.log(`📡 [CACHE MISS] ${cacheKey}`);
        return fetcher().then(data => {
            this.cache.set(cacheKey, { data, expiry: now + config.cacheTTL * 1000 });
            return data;
        });
    }

    async getMatchesBySport(sport: Sport, status?: MatchStatus): Promise<Match[]> {
        if (config.useMockData) {
            return mockDataService.getMatchesBySport(sport, status);
        }

        return this.getFromCacheOrFetch(`${sport}:${status || 'all'}`, () =>
            realDataService.getMatchesBySport(sport, status)
        );
    }

    async getLiveMatches(): Promise<Match[]> {
        if (config.useMockData) {
            return mockDataService.getLiveMatches();
        }

        return this.getFromCacheOrFetch('all:live', () =>
            realDataService.getLiveMatches()
        );
    }

    async getMatchById(matchId: string): Promise<Match | null> {
        if (config.useMockData) {
            return mockDataService.getMatchById(matchId);
        }
        return realDataService.getMatchById(matchId);
    }

    getSports() {
        return mockDataService.getSports();
    }

    getMode(): 'mock' | 'real' {
        return config.useMockData ? 'mock' : 'real';
    }

    clearCache(): void {
        this.cache.clear();
    }
}

export const dataService = new DataService();
