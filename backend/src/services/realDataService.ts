import axios, { AxiosInstance } from 'axios';
import { config } from '../config';
import { Match, MatchStatus, Sport } from '../types/api.types';

/**
 * RealDataService - Integrates with RapidAPI to fetch live sports data
 * 
 * Supports:
 * - Cricket (Cricbuzz Cricket API)
 * - Soccer (API-Football)
 * - American Football (Tank01 NFL API)
 * - Hockey (API-Hockey)
 * - Tennis (Ultimate Tennis API)
 * - Badminton (Not yet implemented - uses mock data)
 */
export class RealDataService {
    private rapidApiKey: string;
    private axiosInstance: AxiosInstance;

    constructor() {
        this.rapidApiKey = config.rapidApiKey;

        if (!this.rapidApiKey) {
            console.warn('⚠️  RAPIDAPI_KEY not configured. Real API calls will fail.');
        }

        // Create axios instance with default config
        this.axiosInstance = axios.create({
            timeout: 10000, // 10 second timeout
            headers: {
                'X-RapidAPI-Key': this.rapidApiKey,
            },
        });
    }

    /**
     * Get matches by sport and status
     */
    async getMatchesBySport(sport: Sport, status?: MatchStatus): Promise<Match[]> {
        try {
            switch (sport) {
                case 'cricket':
                    return await this.getCricketMatches(status);
                case 'soccer':
                    return await this.getSoccerMatches(status);
                case 'football':
                    return await this.getAmericanFootballMatches(status);
                case 'hockey':
                    return await this.getHockeyMatches(status);
                case 'tennis':
                    return await this.getTennisMatches(status);
                case 'badminton':
                    console.log('ℹ️  Badminton not yet implemented, returning empty array');
                    return [];
                default:
                    throw new Error(`Unsupported sport: ${sport}`);
            }
        } catch (error: any) {
            console.error(`Error fetching ${sport} matches:`, error.message);
            throw error;
        }
    }

    /**
     * Get all live matches across all sports
     */
    async getLiveMatches(): Promise<Match[]> {
        const sports: Sport[] = ['cricket', 'soccer', 'football', 'hockey', 'tennis'];
        const allMatches: Match[] = [];

        for (const sport of sports) {
            try {
                const matches = await this.getMatchesBySport(sport, 'live');
                allMatches.push(...matches);
            } catch (error: any) {
                console.error(`Error fetching live ${sport} matches:`, error.message);
                // Continue with other sports even if one fails
            }
        }

        return allMatches;
    }

    /**
     * Get match by ID
     */
    async getMatchById(matchId: string): Promise<Match | null> {
        // Extract sport from match ID (format: "sport_status_number")
        const sportPrefix = matchId.split('_')[0] as Sport;

        try {
            const matches = await this.getMatchesBySport(sportPrefix);
            return matches.find(m => m.id === matchId) || null;
        } catch (error) {
            console.error(`Error fetching match ${matchId}:`, error);
            return null;
        }
    }

    // ==================== CRICKET ====================
    private async getCricketMatches(status?: MatchStatus): Promise<Match[]> {
        try {
            const response = await this.axiosInstance.get(
                'https://cricbuzz-cricket.p.rapidapi.com/matches/v1/recent',
                {
                    headers: {
                        'X-RapidAPI-Host': config.rapidApiHosts.cricket,
                    },
                }
            );

            // Transform Cricbuzz API response to our Match format
            return this.transformCricketMatches(response.data, status);
        } catch (error: any) {
            console.error('Cricket API error:', error.response?.data || error.message);
            return [];
        }
    }

    private transformCricketMatches(apiData: any, status?: MatchStatus): Match[] {
        try {
            const matches: Match[] = [];

            // Cricbuzz API returns typeMatches array
            const typeMatches = apiData.typeMatches || [];

            for (const typeMatch of typeMatches) {
                const seriesMatches = typeMatch.seriesMatches || [];

                for (const seriesMatch of seriesMatches) {
                    const seriesAdWrapper = seriesMatch.seriesAdWrapper || {};
                    const matchList = seriesAdWrapper.matches || [];

                    for (const matchData of matchList) {
                        const matchInfo = matchData.matchInfo;
                        const matchScore = matchData.matchScore;

                        if (!matchInfo) continue;

                        // Map Cricbuzz state to our status
                        const matchStatus = this.mapCricketStatus(matchInfo.state);

                        // Filter by status if specified
                        if (status && matchStatus !== status) continue;

                        // Build the match object
                        const match: Match = {
                            id: `cricket_${matchStatus}_${matchInfo.matchId}`,
                            sport: 'cricket',
                            status: matchStatus,
                            homeTeam: {
                                id: matchInfo.team1.teamId.toString(),
                                name: matchInfo.team1.teamName,
                                initials: matchInfo.team1.teamSName,
                                score: this.extractCricketScore(matchScore?.team1Score, matchInfo.team1.teamId, matchInfo.currBatTeamId),
                            },
                            awayTeam: {
                                id: matchInfo.team2.teamId.toString(),
                                name: matchInfo.team2.teamName,
                                initials: matchInfo.team2.teamSName,
                                score: this.extractCricketScore(matchScore?.team2Score, matchInfo.team2.teamId, matchInfo.currBatTeamId),
                            },
                            venue: {
                                name: matchInfo.venueInfo?.ground || 'TBD',
                                city: matchInfo.venueInfo?.city || '',
                                country: '', // Not provided in API
                            },
                            startTime: new Date(parseInt(matchInfo.startDate)).toISOString(),
                            tournament: matchInfo.seriesName,
                            format: matchInfo.matchFormat || matchInfo.matchDesc,
                        };

                        matches.push(match);
                    }
                }
            }

            console.log(`✅ Transformed ${matches.length} cricket matches (status: ${status || 'all'})`);
            return matches;

        } catch (error: any) {
            console.error('Error transforming cricket matches:', error.message);
            return [];
        }
    }

    private mapCricketStatus(state: string): MatchStatus {
        const stateLower = state?.toLowerCase() || '';

        if (stateLower === 'in progress' || stateLower === 'live') {
            return 'live';
        } else if (stateLower === 'complete' || stateLower === 'stumps' || stateLower.includes('won')) {
            return 'completed';
        } else {
            return 'upcoming';
        }
    }

    private extractCricketScore(teamScore: any, teamId: number, currBatTeamId?: number): any {
        if (!teamScore) {
            return undefined;
        }

        // Get the latest innings (usually inngs1 for T20/ODI, inngs2 for second innings)
        const innings = teamScore.inngs1 || teamScore.inngs2;

        if (!innings) {
            return undefined;
        }

        return {
            runs: innings.runs,
            wickets: innings.wickets,
            overs: innings.overs?.toString() || '0',
        };
    }

    // ==================== SOCCER ====================
    private async getSoccerMatches(status?: MatchStatus): Promise<Match[]> {
        try {
            let endpoint = 'https://api-football-v1.p.rapidapi.com/v3/fixtures';

            // Build query parameters based on status
            const params: any = {};
            if (status === 'live') {
                params.live = 'all';
            } else if (status === 'upcoming') {
                const today = new Date().toISOString().split('T')[0];
                params.date = today;
                params.status = 'NS'; // Not Started
            } else if (status === 'completed') {
                const today = new Date().toISOString().split('T')[0];
                params.date = today;
                params.status = 'FT'; // Full Time
            }

            const response = await this.axiosInstance.get(endpoint, {
                params,
                headers: {
                    'X-RapidAPI-Host': config.rapidApiHosts.football,
                },
            });

            return this.transformSoccerMatches(response.data, status);
        } catch (error: any) {
            console.error('Soccer API error:', error.response?.data || error.message);
            return [];
        }
    }

    private transformSoccerMatches(apiData: any, status?: MatchStatus): Match[] {
        try {
            const matches: Match[] = [];
            const fixtures = apiData.response || [];

            for (const fixture of fixtures) {
                const fixtureData = fixture.fixture;
                const teams = fixture.teams;
                const goals = fixture.goals;
                const league = fixture.league;

                if (!fixtureData || !teams) continue;

                // Map API-Football status to our status
                const matchStatus = this.mapSoccerStatus(fixtureData.status.short);

                // Filter by status if specified
                if (status && matchStatus !== status) continue;

                const match: Match = {
                    id: `soccer_${matchStatus}_${fixtureData.id}`,
                    sport: 'soccer',
                    status: matchStatus,
                    homeTeam: {
                        id: teams.home.id.toString(),
                        name: teams.home.name,
                        initials: teams.home.name.substring(0, 3).toUpperCase(),
                        logo: teams.home.logo,
                        score: matchStatus !== 'upcoming' ? {
                            goals: goals.home || 0,
                            half: fixtureData.status.long,
                            minute: fixtureData.status.elapsed?.toString() || '0',
                        } : undefined,
                    },
                    awayTeam: {
                        id: teams.away.id.toString(),
                        name: teams.away.name,
                        initials: teams.away.name.substring(0, 3).toUpperCase(),
                        logo: teams.away.logo,
                        score: matchStatus !== 'upcoming' ? {
                            goals: goals.away || 0,
                            half: fixtureData.status.long,
                            minute: fixtureData.status.elapsed?.toString() || '0',
                        } : undefined,
                    },
                    venue: {
                        name: fixtureData.venue?.name || 'TBD',
                        city: fixtureData.venue?.city || '',
                        country: league?.country || '',
                    },
                    startTime: fixtureData.date,
                    tournament: league?.name || 'Unknown League',
                    format: league?.round || '',
                };

                matches.push(match);
            }

            console.log(`✅ Transformed ${matches.length} soccer matches (status: ${status || 'all'})`);
            return matches;

        } catch (error: any) {
            console.error('Error transforming soccer matches:', error.message);
            return [];
        }
    }

    private mapSoccerStatus(statusShort: string): MatchStatus {
        // API-Football status codes
        // Live: 1H, HT, 2H, ET, BT, P, SUSP, INT, LIVE
        // Upcoming: TBD, NS
        // Completed: FT, AET, PEN, PST, CANC, ABD, AWD, WO
        const liveStatuses = ['1H', 'HT', '2H', 'ET', 'BT', 'P', 'SUSP', 'INT', 'LIVE'];
        const completedStatuses = ['FT', 'AET', 'PEN', 'PST', 'CANC', 'ABD', 'AWD', 'WO'];

        if (liveStatuses.includes(statusShort)) {
            return 'live';
        } else if (completedStatuses.includes(statusShort)) {
            return 'completed';
        } else {
            return 'upcoming';
        }
    }

    // ==================== AMERICAN FOOTBALL ====================
    private async getAmericanFootballMatches(status?: MatchStatus): Promise<Match[]> {
        try {
            const today = new Date().toISOString().split('T')[0];

            const response = await this.axiosInstance.get(
                'https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLGamesForDate',
                {
                    params: {
                        gameDate: today,
                    },
                    headers: {
                        'X-RapidAPI-Host': config.rapidApiHosts.nfl,
                    },
                }
            );

            return this.transformAmericanFootballMatches(response.data, status);
        } catch (error: any) {
            console.error('American Football API error:', error.response?.data || error.message);
            return [];
        }
    }

    private transformAmericanFootballMatches(apiData: any, status?: MatchStatus): Match[] {
        try {
            const matches: Match[] = [];
            const games = apiData.body || [];

            for (const game of games) {
                if (!game) continue;

                // Map NFL status to our status
                const matchStatus = this.mapNFLStatus(game.gameStatus);

                // Filter by status if specified
                if (status && matchStatus !== status) continue;

                const match: Match = {
                    id: `football_${matchStatus}_${game.gameID}`,
                    sport: 'football',
                    status: matchStatus,
                    homeTeam: {
                        id: game.teamIDHome,
                        name: game.home,
                        initials: game.home,
                        score: matchStatus !== 'upcoming' && game.homePts !== undefined ? {
                            points: game.homePts || 0,
                            quarter: game.gameStatusCode || 'Final',
                            timeRemaining: game.gameTime || '0:00',
                        } : undefined,
                    },
                    awayTeam: {
                        id: game.teamIDAway,
                        name: game.away,
                        initials: game.away,
                        score: matchStatus !== 'upcoming' && game.awayPts !== undefined ? {
                            points: game.awayPts || 0,
                            quarter: game.gameStatusCode || 'Final',
                            timeRemaining: game.gameTime || '0:00',
                        } : undefined,
                    },
                    venue: {
                        name: game.venue || 'TBD',
                        city: '',
                        country: 'USA',
                    },
                    startTime: this.parseNFLDate(game.gameDate, game.gameTime),
                    tournament: `NFL ${game.seasonType} - ${game.gameWeek}`,
                    format: 'NFL',
                };

                matches.push(match);
            }

            console.log(`✅ Transformed ${matches.length} NFL matches (status: ${status || 'all'})`);
            return matches;

        } catch (error: any) {
            console.error('Error transforming NFL matches:', error.message);
            return [];
        }
    }

    private mapNFLStatus(gameStatus: string): MatchStatus {
        const statusLower = gameStatus?.toLowerCase() || '';

        if (statusLower.includes('live') || statusLower.includes('in progress') || statusLower.includes('halftime')) {
            return 'live';
        } else if (statusLower.includes('final') || statusLower.includes('completed')) {
            return 'completed';
        } else {
            return 'upcoming';
        }
    }

    private parseNFLDate(gameDate: string, gameTime?: string): string {
        try {
            // gameDate format: YYYYMMDD
            const year = gameDate.substring(0, 4);
            const month = gameDate.substring(4, 6);
            const day = gameDate.substring(6, 8);
            return new Date(`${year}-${month}-${day}`).toISOString();
        } catch (error) {
            return new Date().toISOString();
        }
    }

    // ==================== HOCKEY ====================
    private async getHockeyMatches(status?: MatchStatus): Promise<Match[]> {
        try {
            let endpoint = 'https://api-hockey.p.rapidapi.com/games';

            const params: any = {};
            if (status === 'live') {
                params.live = 'all';
            } else {
                const today = new Date().toISOString().split('T')[0];
                params.date = today;
            }

            const response = await this.axiosInstance.get(endpoint, {
                params,
                headers: {
                    'X-RapidAPI-Host': config.rapidApiHosts.hockey,
                },
            });

            return this.transformHockeyMatches(response.data, status);
        } catch (error: any) {
            console.error('Hockey API error:', error.response?.data || error.message);
            return [];
        }
    }

    private transformHockeyMatches(apiData: any, status?: MatchStatus): Match[] {
        // TODO: Implement transformation based on actual API-Hockey response structure
        console.log('ℹ️  Hockey API transformation not yet fully implemented');
        return [];
    }

    // ==================== TENNIS ====================
    private async getTennisMatches(status?: MatchStatus): Promise<Match[]> {
        try {
            // Use Tennis Live Data API as Ultimate Tennis API is deprecated
            // Endpoint: /matches-by-date/{date}
            const today = new Date().toISOString().split('T')[0];
            const endpoint = `/matches-by-date/${today}`;

            const response = await this.axiosInstance.get(
                `https://${config.rapidApiHosts.tennis}${endpoint}`,
                {
                    headers: {
                        'X-RapidAPI-Host': config.rapidApiHosts.tennis,
                    },
                }
            );

            return this.transformTennisMatches(response.data, status);
        } catch (error: any) {
            // Handle expected 403 if user hasn't subscribed to the new API yet
            if (error.response?.status === 403) {
                console.log('⚠️  Tennis API: You are not subscribed to "Tennis Live Data". Please subscribe on RapidAPI.');
                return [];
            }
            console.error('Tennis API error:', error.response?.data || error.message);
            return [];
        }
    }

    private transformTennisMatches(apiData: any, status?: MatchStatus): Match[] {
        // TODO: Implement transformation based on actual Ultimate Tennis API response structure
        console.log('ℹ️  Tennis API transformation not yet fully implemented');
        return [];
    }
}

export const realDataService = new RealDataService();
