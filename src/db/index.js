import pkg from 'pg';
const { Pool } = pkg;
import { config } from '../config/config.js';      // ✅ Corrected path

export const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.databaseSsl ? { rejectUnauthorized: false } : false   // ✅ Corrected
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL idle client error', err);
});

export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production') {
      console.log(JSON.stringify({ at: 'db.query', duration, rows: res.rowCount }));
    }
    return res;
  } catch (err) {
    console.error('DB ERROR:', err.message || err);
    throw err;
  }
}
