import { Request, Response, Router } from 'express';
import { dataService } from '../services/dataService';

const router = Router();

// GET /api/health - Health check endpoint
router.get('/', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        mode: dataService.getMode(),
        timestamp: Date.now(),
    });
});

export default router;
