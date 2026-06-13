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
});
