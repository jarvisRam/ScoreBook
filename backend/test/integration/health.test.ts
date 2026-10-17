import request from 'supertest';
import app from '../../src/index';

describe('Health Check Integration', () => {
    it('should return 200 and healthy status', async () => {
        const res = await request(app).get('/api/health');

        expect(res.body).toEqual(expect.objectContaining({
            status: 'ok',
            timestamp: expect.any(Number),
        }));
    });

    it('should report the data mode and respond with HTTP 200', async () => {
        const res = await request(app).get('/api/health');

        expect(res.status).toBe(200);
        expect(res.body.mode).toEqual(expect.any(String));
    });
});
