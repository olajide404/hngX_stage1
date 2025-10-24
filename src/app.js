import express from 'express';
import { config } from './config/config.js';              // ✅ corrected import path
import stringsRouter from './routes/strings.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimitLite } from './middleware/rateLimitLite.js'; // ✅ corrected import name

export function buildApp() {
  const app = express();

  app.disable('x-powered-by');
  app.set('strict routing', false);

  // ✅ Parse JSON requests
  app.use(express.json({ limit: config.bodyLimitBytes }));

  // ✅ Basic rate limiting
  app.use(rateLimitLite);

  // ✅ Health route
  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

  // ✅ Optional welcome route (useful for domain checks)
  app.get('/', (_req, res) => {
    res.status(200).json({
      name: 'String Analyzer API',
      status: 'ok',
      endpoints: {
        health: 'GET /health',
        createAnalyzeString: 'POST /strings',
        getString: 'GET /strings/{string_value}',
        listStrings: 'GET /strings?filters',
        nlpFilter: 'GET /strings/filter-by-natural-language?query=...',
        deleteString: 'DELETE /strings/{string_value}'
      }
    });
  });

  // ✅ Mount main router
  app.use('/strings', stringsRouter);

  // ✅ Handle unmatched routes
  app.use((_req, res) => res.status(404).json({ error: 'Not found.' }));

  // ✅ Central error handler
  app.use(errorHandler);

  return app;
}
