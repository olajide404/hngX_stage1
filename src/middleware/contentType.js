import { Errors } from '../utils/errors.js';

export function contentTypeJson(req, _res, next) {
  const ct = (req.headers['content-type'] || '').toLowerCase();
  if (!ct.startsWith('application/json')) {
    return next(Errors.BadRequest('Unsupported content type.'));
  }
  next();
}
