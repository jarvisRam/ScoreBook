import path from 'path';
import axios from 'axios';
import { Pact, Matchers, SpecificationVersion } from '@pact-foundation/pact';

const { like, number } = Matchers;

const provider = new Pact({
    dir: path.resolve(__dirname, '../pacts'),
    consumer: 'ScoreBookMobile',
    provider: 'ScoreBookBackend',
    spec: SpecificationVersion.SPECIFICATION_VERSION_V4,
});

describe('GET /api/health', () => {
    it('returns the backend health status', async () => {
        await provider
            .addInteraction()
            .uponReceiving('a request for backend health status')
            .withRequest('GET', '/api/health')
            .willRespondWith(200, (builder) => {
                builder.headers({ 'Content-Type': 'application/json; charset=utf-8' });
                builder.jsonBody({
                    status: 'ok',
                    mode: like('mock'),
                    timestamp: number(1737000000000),
                });
            })
            .executeTest(async (mockServer) => {
                const response = await axios.get(`${mockServer.url}/api/health`);

                expect(response.status).toBe(200);
                expect(response.data.status).toBe('ok');
                expect(typeof response.data.mode).toBe('string');
                expect(typeof response.data.timestamp).toBe('number');
            });
    });
});
