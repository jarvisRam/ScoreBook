import dotenv from 'dotenv';

dotenv.config();

export const config = {
    // Server
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',

    // API Mode
    useMockData: process.env.USE_MOCK_DATA === 'true',

    // RapidAPI
    rapidApiKey: process.env.RAPIDAPI_KEY || '',
    rapidApiHosts: {
        cricket: process.env.RAPIDAPI_CRICKET_HOST || 'cricbuzz-cricket.p.rapidapi.com',
        football: process.env.RAPIDAPI_FOOTBALL_HOST || 'api-football-v1.p.rapidapi.com',
        nfl: process.env.RAPIDAPI_NFL_HOST || 'tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com',
        hockey: process.env.RAPIDAPI_HOCKEY_HOST || 'api-hockey.p.rapidapi.com',
        tennis: process.env.RAPIDAPI_TENNIS_HOST || 'tennis-live-data.p.rapidapi.com',
    },

    // Cache
    cacheTTL: parseInt(process.env.CACHE_TTL || '60', 10),
};
