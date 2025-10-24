import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT || 3000),
  databaseUrl: process.env.DATABASE_URL,
  bodyLimitBytes: Number(process.env.BODY_LIMIT_BYTES || 262144),
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
    max: Number(process.env.RATE_LIMIT_MAX || 120)
  },
  // ✅ NEW: allow toggling SSL via env; default: on in prod, off otherwise
  databaseSsl:
    (process.env.DATABASE_SSL ?? (process.env.NODE_ENV === 'production' ? 'true' : 'false'))
      .toLowerCase() === 'true'    // ✅ Corrected: coerces to boolean
};

if (!config.databaseUrl) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}
