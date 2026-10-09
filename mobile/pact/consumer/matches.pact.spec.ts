import path from 'path';
import axios from 'axios';
import { Pact, Matchers, SpecificationVersion } from '@pact-foundation/pact';

const { like, eachLike } = Matchers;

const provider = new Pact({
    dir: path.resolve(__dirname, '../pacts'),
    consumer: 'ScoreBookMobile',
    provider: 'ScoreBookBackend',
    spec: SpecificationVersion.SPECIFICATION_VERSION_V4,
});

describe('GET /api/matches/:sport', () => {
    it('returns live cricket matches', async () => {
        await provider
            .addInteraction()
            .uponReceiving('a request for live cricket matches')
            .withRequest('GET', '/api/matches/cricket', (builder) => {
                builder.query({ status: 'live' });
            })
            .willRespondWith(200, (builder) => {
                builder.headers({ 'Content-Type': 'application/json; charset=utf-8' });
                builder.jsonBody({
                    data: eachLike({
                        id: like('cricket_live_1'),
                        sport: like('cricket'),
                        status: like('live'),
                        homeTeam: like({
                            id: like('team_csk'),
                            name: like('Chennai Super Kings'),
                            initials: like('CSK'),
                            score: like({
                                runs: like(167),
                                wickets: like(4),
                                overs: like('16.2'),
                            }),
                        }),
                        awayTeam: like({
                            id: like('team_mi'),
                            name: like('Mumbai Indians'),
                            initials: like('MI'),
                            score: like({
                                runs: like(185),
                                wickets: like(6),
                                overs: like('20.0'),
                            }),
                        }),
                        venue: like({
                            name: like('M. A. Chidambaram Stadium'),
                            city: like('Chennai'),
                            country: like('India'),
                        }),
                        startTime: like('2026-06-13T14:00:00Z'),
                        tournament: like('IPL 2026'),
                        format: like('T20'),
                    }),
                    timestamp: like(1737000000000),
                    mode: like('mock'),
                });
            })
            .executeTest(async (mockServer) => {
                const response = await axios.get(`${mockServer.url}/api/matches/cricket`, {
                    params: { status: 'live' },
                });

                expect(response.status).toBe(200);
                expect(Array.isArray(response.data.data)).toBe(true);
                expect(response.data.data[0].sport).toBe('cricket');
                expect(response.data.data[0].homeTeam.score.runs).toBeDefined();
            });
    });

    it('returns 404 for an unsupported sport', async () => {
        await provider
            .addInteraction()
            .uponReceiving('a request for an unsupported sport')
            .withRequest('GET', '/api/matches/rugby')
            .willRespondWith(404, (builder) => {
                builder.headers({ 'Content-Type': 'application/json; charset=utf-8' });
                builder.jsonBody({
                    error: {
                        message: like('Invalid sport ID'),
                        code: 'SPORT_NOT_FOUND',
                    },
                });
            })
            .executeTest(async (mockServer) => {
                await expect(
                    axios.get(`${mockServer.url}/api/matches/rugby`)
                ).rejects.toMatchObject({
                    response: {
                        status: 404,
                        data: { error: { code: 'SPORT_NOT_FOUND' } },
                    },
                });
            });
    });
});
