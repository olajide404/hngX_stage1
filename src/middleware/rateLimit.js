import { config } from '../config/config.js'

const buckets = new Map(); // ip -> { count, resetAt }

export function rateLimitLite(req, res, next) {
  const now = Date.now();
  const { windowMs, max } = config.rateLimit;
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';

  let b = buckets.get(ip);
  if (!b || now >= b.resetAt) {
    b = { count: 0, resetAt: now + windowMs };
    buckets.set(ip, b);
  }
  b.count += 1;

  res.setHeader('X-RateLimit-Limit', String(max));
  res.setHeader('X-RateLimit-Remaining', String(Math.max(0, max - b.count)));
  res.setHeader('X-RateLimit-Reset', String(Math.floor(b.resetAt / 1000)));

  if (b.count > max) {
    return res.status(429).json({ error: 'Too many requests.' });
  }
  next();
}
