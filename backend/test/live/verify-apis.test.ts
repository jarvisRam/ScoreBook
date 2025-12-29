import request from 'supertest';
import app from '../../src/index';

// These tests hit the REAL RapidAPI endpoints.
// They consume quota and require a valid internet connection.
// Run with: npm run test:live

describe('Live API Verification (Smoke Tests)', () => {

    it('GET /api/health should return 200', async () => {
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body.mode).toBeDefined();
    });

    // We verify one endpoint to ensure network connectivity works
    it('GET /api/matches/cricket should return valid JSON structure (200)', async () => {
        const res = await request(app).get('/api/matches/cricket?status=completed');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);

        // We don't assert length > 0 because there might be no matches, 
        // but the call should succeed.
        console.log(`Live Cricket API returned ${res.body.data.length} matches`);
    });

    it('GET /api/matches/tennis should return 200 (even if 403 downstream)', async () => {
        // This verifies our backend doesn't crash even if backend handles 403
        const res = await request(app).get('/api/matches/tennis');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});
