import { Request, Response, Router } from 'express';
import { mockDataService } from '../services/mockDataService';

const router = Router();

// GET /api/matches/live - Get all live matches
router.get('/live', (req: Request, res: Response) => {
    try {
        const matches = mockDataService.getLiveMatches();
        res.json({
            data: matches,
            timestamp: Date.now(),
            mode: 'mock',
        });
    } catch (error) {
        res.status(500).json({
            error: {
                message: 'Failed to fetch live matches',
                code: 'INTERNAL_ERROR',
            },
        });
    }
});

// GET /api/matches/:sport - Get matches for a specific sport
router.get('/:sport', (req: Request, res: Response) => {
    try {
        const { sport } = req.params;
        const { status } = req.query;

        const validSports = ['cricket', 'football', 'hockey', 'soccer', 'tennis', 'badminton'];
        if (!validSports.includes(sport)) {
            return res.status(404).json({
                error: {
                    message: 'Invalid sport ID',
                    code: 'SPORT_NOT_FOUND',
                },
            });
        }

        const matches = mockDataService.getMatchesBySport(sport, status as string);

        res.json({
            data: matches,
            timestamp: Date.now(),
            mode: 'mock',
        });
    } catch (error) {
        res.status(500).json({
            error: {
                message: 'Failed to fetch matches',
                code: 'INTERNAL_ERROR',
            },
        });
    }
});

export default router;
