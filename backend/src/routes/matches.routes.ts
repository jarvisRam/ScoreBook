import { Request, Response, Router } from 'express';
import { dataService } from '../services/dataService';

const router = Router();

// GET /api/matches/live - Get all live matches
router.get('/live', async (req: Request, res: Response) => {
    try {
        const matches = await dataService.getLiveMatches();
        res.json({
            data: matches,
            timestamp: Date.now(),
            mode: dataService.getMode(),
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

// GET/POST /api/matches/regenerate - Regenerate simulation matches
// GET is used by Vercel Cron Jobs, POST for manual triggers
// Must be defined before /:sport to avoid being caught by the param route
const handleRegenerate = async (req: Request, res: Response) => {
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
        return res.status(401).json({
            error: { message: 'Unauthorized', code: 'UNAUTHORIZED' },
        });
    }

    try {
        await dataService.regenerateMatches();
        res.json({
            message: 'Matches regenerated successfully',
            timestamp: Date.now(),
            mode: dataService.getMode(),
        });
    } catch (error) {
        res.status(500).json({
            error: {
                message: 'Failed to regenerate matches',
                code: 'INTERNAL_ERROR',
            },
        });
    }
};

router.get('/regenerate', handleRegenerate);
router.post('/regenerate', handleRegenerate);

// GET /api/matches/:sport - Get matches for a specific sport
router.get('/:sport', async (req: Request, res: Response) => {
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

        const matches = await dataService.getMatchesBySport(sport as any, status as any);

        res.json({
            data: matches,
            timestamp: Date.now(),
            mode: dataService.getMode(),
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
