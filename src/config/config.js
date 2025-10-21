import 'dotenv/config';

export const config = {
    port: process.env.PORT || 3000,
    databaseUrl: process.env.DATABASE_URL,
    bodyLimit: process.env.BODY_LIMIT_BYTES || '262144',
    rateLimit: {
        windowMs: process.env.RATE_LIMIT_WINDOW_MS || 60000,
        max: process.env.RATE_LIMIT_MAX || 60
    }
};

if (!config.databaseUrl) {
    throw new Error('DATABASE_URL is not defined in environment variables');
}