import { Request, Response, Router } from 'express';
import { dataService } from '../services/dataService';

const router = Router();

// GET /api/sports - Get list of supported sports
router.get('/', (req: Request, res: Response) => {
    try {
        const sports = dataService.getSports();
        res.json({
            data: sports,
            timestamp: Date.now(),
            mode: dataService.getMode(),
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
