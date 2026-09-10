import { Request, Response, Router } from 'express';
import { dataService } from '../services/dataService';
import { config } from '../config';
import { testConnection } from '../db/connection';

const router = Router();

// GET /api/health - Health check endpoint
router.get('/', async (req: Request, res: Response) => {
    const health: Record<string, any> = {
        status: 'ok',
        mode: dataService.getMode(),
        timestamp: Date.now(),
    };

    if (config.dataMode === 'simulation') {
        try {
            health.database = (await testConnection()) ? 'connected' : 'disconnected';
        } catch {
            health.database = 'error';
        }
    }

    res.json(health);
});

export default router;
