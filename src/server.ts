import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import { logger } from './config/logger';
import { metricsMiddleware } from './middleware/metrics.middleware';
import { authMiddleware } from './middleware/auth.middleware';
import { errorHandler } from './middleware/error.middleware';
import { aiRouter } from './routes/ai.routes';
import { healthRouter } from './routes/health.routes';
import { modelsRouter } from './routes/models.routes';

const app: Express = express();

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Metrics middleware (runs for all routes)
app.use(metricsMiddleware);

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Incoming request: ${req.method} ${req.path}`, {
    query: req.query,
    ip: req.ip,
  });
  next();
});

// Public routes (no auth required)
app.use('/health', healthRouter);
app.get('/api/models', (req: Request, res: Response) => {
  res.redirect('/api/models/');
});

// Protected API routes (auth required)
app.use('/api', authMiddleware);
app.use('/api/chat', aiRouter);
app.use('/api', aiRouter);
app.use('/api/models', modelsRouter);

// Metrics endpoint (Prometheus)
app.get('/metrics', async (req: Request, res: Response) => {
  try {
    const { register } = await import('prom-client');
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    logger.error('Metrics error:', error);
    res.status(500).json({ error: 'Metrics unavailable' });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;