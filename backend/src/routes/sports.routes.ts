import { Request, Response, Router } from 'express';
import { mockDataService } from '../services/mockDataService';

const router = Router();

// GET /api/sports - Get list of supported sports
router.get('/', (req: Request, res: Response) => {
    try {
        const sports = mockDataService.getSports();
        res.json({
            data: sports,
            timestamp: Date.now(),
            mode: 'mock',
        });
    } catch (error) {
        res.status(500).json({
            error: {
                message: 'Failed to fetch sports',
                code: 'INTERNAL_ERROR',
            },
        });
    }
});

export default router;
