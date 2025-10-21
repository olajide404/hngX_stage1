import pkg from 'pg';
const { Pool } = pkg;
import { config } from '../config/config.js';

export const pool = new Pool({connectionString: config.databaseUrl});

export async function query(text, params){
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const ms = Date.now() - start;
         console.log(JSON.stringify({ at: 'db.query', ms, rows: res.rowCount }));
        return res;
    } catch (err) {
        console.error('DB ERROR:', err);
        throw err;
    }
}