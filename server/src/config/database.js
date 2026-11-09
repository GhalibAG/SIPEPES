const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;

let pool = null;

if (connectionString && !connectionString.includes('yourpassword') && !connectionString.includes('yourprojectid')) {
  // Bersihkan parameter sslmode dari URL agar pg menggunakan konfigurasi ssl eksplisit
  const cleanUrl = connectionString.replace(/[?&]sslmode=[^&]+/, '');

  pool = new Pool({
    connectionString: cleanUrl,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  pool.on('error', (err) => {
    console.error('❌ [DATABASE_POOL_ERROR]', err.message);
  });
} else {
  console.warn('⚠️ [WARNING] DATABASE_URL belum dikonfigurasi dengan benar di .env');
}

/**
 * Execute SQL query with parameter binding
 * @param {string} text - SQL Query String
 * @param {Array} params - Array of parameters
 */
const query = async (text, params) => {
  if (!pool) {
    throw new Error('Database pool belum terhubung. Periksa konfigurasi DATABASE_URL di .env.');
  }
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development') {
    console.log('⚡ [SQL_QUERY]', { text: text.trim().slice(0, 100), duration: `${duration}ms`, rows: res.rowCount });
  }
  return res;
};

module.exports = {
  pool,
  query,
};
