import request from 'supertest';
import app from '../../src/index';

describe('Health Check API', () => {
    it('should return 200 OK', async () => {
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('status', 'ok');
    });
});
