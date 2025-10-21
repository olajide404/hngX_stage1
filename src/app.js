import express from 'express';
import { config } from './config/config.js';
import stringsRouter from './routes/strings.routes.js';
import  { errorHandler }  from './middleware/errorHandler.js';
import { rateLimitLite } from './middleware/rateLimit.js';

export function buildApp() {
  const app = express();

  // JSON parser
  app.use(express.json({ limit: config.bodyLimitBytes }));

  // Basic rate limiting
  app.use(rateLimitLite);

  // Health
  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

  // Strings routes (only POST for now)
  app.use('/strings', stringsRouter);

  // 404
  app.use((_req, res) => res.status(404).json({ error: 'Not found.' }));

  // Error handler
  app.use(errorHandler);

  return app;
}