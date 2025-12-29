import express from 'express';
import cors from 'cors';
import { config } from './config';
import healthRoutes from './routes/health.routes';
import sportsRoutes from './routes/sports.routes';
import matchesRoutes from './routes/matches.routes';
import matchRoutes from './routes/match.routes';

const app = express();
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json());

// Enhanced logging middleware
app.use((req, res, next) => {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    // Log request
    const queryString = Object.keys(req.query).length > 0
        ? `?${new URLSearchParams(req.query as any).toString()}`
        : '';
    console.log(`\n📥 [${timestamp}] ${req.method} ${req.path}${queryString}`);

    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const statusEmoji = res.statusCode >= 200 && res.statusCode < 300 ? '✅' :
            res.statusCode >= 400 && res.statusCode < 500 ? '⚠️' : '❌';
        console.log(`${statusEmoji} [${res.statusCode}] Completed in ${duration}ms`);
    });

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
        mode: config.useMockData ? 'mock' : 'real',
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

// Start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 ScoreBook API server running on http://localhost:${PORT}`);
        console.log(`📊 Mode: ${config.useMockData ? '📦 MOCK DATA' : '🌐 REAL API'}`);

        if (!config.useMockData && !config.rapidApiKey) {
            console.warn('⚠️  WARNING: Real API mode enabled but RAPIDAPI_KEY not configured!');
            console.warn('⚠️  Please set RAPIDAPI_KEY in your .env file');
        }

        console.log(`📍 Endpoints available at http://localhost:${PORT}/api`);
    });
}

export default app;
