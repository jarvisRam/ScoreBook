import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes';
import sportsRoutes from './routes/sports.routes';
import matchesRoutes from './routes/matches.routes';
import matchRoutes from './routes/match.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/sports', sportsRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/match', matchRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'ScoreBook API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            sports: '/api/sports',
            liveMatches: '/api/matches/live',
            sportMatches: '/api/matches/:sport?status=live|upcoming|completed',
            matchDetail: '/api/match/:id',
        },
    });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        error: {
            message: 'Something went wrong!',
            code: 'INTERNAL_ERROR',
        },
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 ScoreBook API server running on http://localhost:${PORT}`);
    console.log(`📊 Mode: MOCK DATA`);
    console.log(`📍 Endpoints available at http://localhost:${PORT}/api`);
});

export default app;
