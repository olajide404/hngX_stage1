// src/middleware/errorHandler.js
export function errorHandler(err, _req, res, _next) {
  // If it's one of our defined HttpError types
  if (err.status && err.message) {
    // Use the custom toJSON() if available
    const body = typeof err.toJSON === 'function' ? err.toJSON() : { error: err.message };

    if (process.env.NODE_ENV !== 'production') {
      console.error(`[${err.status}] ${err.message}`);
    }

    return res.status(err.status).json(body);
  }

  // Fallback for unexpected errors
  console.error('Unexpected error:', err);
  return res.status(500).json({ error: 'Internal server error.' });
}
