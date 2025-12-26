import { Request, Response, Router } from 'express';
import { mockDataService } from '../services/mockDataService';

const router = Router();

// GET /api/match/:id - Get match details
router.get('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const match = mockDataService.getMatchById(id);

        if (!match) {
            return res.status(404).json({
                error: {
                    message: 'Match not found',
                    code: 'MATCH_NOT_FOUND',
                },
            });
        }

        res.json({
            data: match,
            timestamp: Date.now(),
            mode: 'mock',
        });
    } catch (error) {
        res.status(500).json({
            error: {
                message: 'Failed to fetch match details',
                code: 'INTERNAL_ERROR',
            },
        });
    }
});

export default router;
