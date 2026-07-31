import dotenv from 'dotenv';

dotenv.config();

export type DataMode = 'mock' | 'real' | 'simulation';

export const config = {
    // Server
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',

    // API Mode
    dataMode: (process.env.DATA_MODE || (process.env.USE_MOCK_DATA === 'true' ? 'mock' : 'real')) as DataMode,
    useMockData: process.env.DATA_MODE === 'mock' || process.env.USE_MOCK_DATA === 'true',

    // Database (Neon Postgres)
    databaseUrl: process.env.DATABASE_URL,

    // RapidAPI (legacy, used when dataMode === 'real')
    rapidApiKey: process.env.RAPIDAPI_KEY || '',
    rapidApiHosts: {
        cricket: process.env.RAPIDAPI_CRICKET_HOST || 'cricbuzz-cricket.p.rapidapi.com',
        football: process.env.RAPIDAPI_FOOTBALL_HOST || 'api-football-v1.p.rapidapi.com',
        nfl: process.env.RAPIDAPI_NFL_HOST || 'tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com',
        hockey: process.env.RAPIDAPI_HOCKEY_HOST || 'api-hockey.p.rapidapi.com',
        tennis: process.env.RAPIDAPI_TENNIS_HOST || 'tennis-live-data.p.rapidapi.com',
    },

    // Cache (shorter TTL in simulation mode for fresher scores)
    cacheTTL: parseInt(process.env.CACHE_TTL || (process.env.DATA_MODE === 'simulation' ? '5' : '60'), 10),
};
