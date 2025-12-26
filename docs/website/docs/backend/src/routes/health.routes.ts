import { Request, Response, Router } from 'express';

const router = Router();

// GET /api/health - Health check endpoint
router.get('/', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        mode: 'mock',
        timestamp: Date.now(),
    });
});

export default router;
