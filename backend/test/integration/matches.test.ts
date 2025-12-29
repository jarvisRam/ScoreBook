import request from 'supertest';
import app from '../../src/index';
import { setupRapidApiMock, clearMocks, mockHosts } from '../utils';

describe('Matches API Integration', () => {
    afterEach(() => {
        clearMocks();
    });

    // ==================== CRICKET TESTS ====================
    describe('GET /api/matches/cricket', () => {
        const cricketMockData = {
            typeMatches: [{
                seriesMatches: [{
                    seriesAdWrapper: {
                        matches: [{
                            matchInfo: {
                                matchId: 12345,
                                seriesName: 'Test Series',
                                matchDesc: 'T20',
                                matchFormat: 'T20',
                                startDate: Date.now().toString(),
                                state: 'In Progress',
                                team1: { teamId: 1, teamName: 'India', teamSName: 'IND' },
                                team2: { teamId: 2, teamName: 'Australia', teamSName: 'AUS' },
                                venueInfo: { ground: 'MCG', city: 'Melbourne' },
                                currBatTeamId: 1
                            },
                            matchScore: {
                                team1Score: { inngs1: { runs: 150, wickets: 2, overs: 15.2 } },
                                team2Score: null
                            }
                        }]
                    }
                }]
            }]
        };

        it('should return cricket matches', async () => {
            setupRapidApiMock(mockHosts.cricket, '/matches/v1/recent', cricketMockData);

            const res = await request(app).get('/api/matches/cricket');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
            expect(res.body.data[0].sport).toBe('cricket');
            expect(res.body.data[0].homeTeam.name).toBe('India');
        });

        it('should handle upstream API error gracefully', async () => {
            setupRapidApiMock(mockHosts.cricket, '/matches/v1/recent', { message: 'Error' }, 500);

            const res = await request(app).get('/api/matches/cricket');

            // Should return empty array, not crash
            expect(res.status).toBe(200);
            expect(res.body.data).toEqual([]);
        });
    });

    // ==================== SOCCER TESTS ====================
    describe('GET /api/matches/soccer', () => {
        const soccerMockData = {
            response: [{
                fixture: {
                    id: 555,
                    status: { short: '1H', long: 'First Half', elapsed: 30 },
                    venue: { name: 'Wembley', city: 'London' }
                },
                teams: {
                    home: { id: 10, name: 'England', logo: 'eng.png' },
                    away: { id: 20, name: 'France', logo: 'fra.png' }
                },
                goals: { home: 1, away: 0 },
                league: { country: 'World' }
            }]
        };

        it('should return soccer matches', async () => {
            // Soccer live uses 'live=all' query param
            setupRapidApiMock(mockHosts.football, '/v3/fixtures', soccerMockData);

            // Note: query param matching is fuzzy in our util, so it should match
            const res = await request(app).get('/api/matches/soccer?status=live');

            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(1);
            expect(res.body.data[0].sport).toBe('soccer');
            expect(res.body.data[0].homeTeam.name).toBe('England');
            expect(res.body.data[0].homeTeam.score.goals).toBe(1);
        });
    });

    // ==================== TENNIS TESTS (New API) ====================
    describe('GET /api/matches/tennis', () => {
        it('should handle missing subscription (403)', async () => {
            // Mock the /matches-by-date/{today} endpoint
            const today = new Date().toISOString().split('T')[0];
            setupRapidApiMock(mockHosts.tennis, `/matches-by-date/${today}`, { message: 'Forbidden' }, 403);

            const res = await request(app).get('/api/matches/tennis');

            // Should return empty array and log warning (logs mocked/ignored in test env usually)
            expect(res.status).toBe(200);
            expect(res.body.data).toEqual([]);
        });
    });
});
