import { config, DataMode } from '../config';
import { mockDataService } from './mockDataService';
import { realDataService } from './realDataService';
import { simulationService } from './simulationService';
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
        if (config.dataMode === 'mock') {
            return mockDataService.getMatchesBySport(sport, status);
        }

        if (config.dataMode === 'simulation') {
            return this.getFromCacheOrFetch(`sim:${sport}:${status || 'all'}`, () =>
                simulationService.getMatchesBySport(sport, status)
            );
        }

        return this.getFromCacheOrFetch(`${sport}:${status || 'all'}`, () =>
            realDataService.getMatchesBySport(sport, status)
        );
    }

    async getLiveMatches(): Promise<Match[]> {
        if (config.dataMode === 'mock') {
            return mockDataService.getLiveMatches();
        }

        if (config.dataMode === 'simulation') {
            return this.getFromCacheOrFetch('sim:all:live', () =>
                simulationService.getLiveMatches()
            );
        }

        return this.getFromCacheOrFetch('all:live', () =>
            realDataService.getLiveMatches()
        );
    }

    async getMatchById(matchId: string): Promise<Match | null> {
        if (config.dataMode === 'mock') {
            return mockDataService.getMatchById(matchId);
        }

        if (config.dataMode === 'simulation') {
            return simulationService.getMatchById(matchId);
        }

        return realDataService.getMatchById(matchId);
    }

    async regenerateMatches(): Promise<void> {
        if (config.dataMode === 'simulation') {
            await simulationService.regenerateMatches();
            this.clearCache();
        }
    }

    getSports() {
        return mockDataService.getSports();
    }

    getMode(): DataMode {
        return config.dataMode;
    }

    clearCache(): void {
        this.cache.clear();
    }
}

export const dataService = new DataService();
