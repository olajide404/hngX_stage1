import { sendError } from '../utils/http.js';

export function errorHandler(err, _req, res, _next) {
  console.error('Unhandled error:', err);
  return sendError(res, err);
}
