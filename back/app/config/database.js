/**
 * config/database.js
 * Configuración del pool de conexiones a PostgreSQL.
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'proyectohs',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[db] Error inesperado:', err.message);
});

async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  if (process.env.NODE_ENV !== 'production') {
    const duration = Date.now() - start;
    console.log('[db] query', { text, duration, rows: result.rowCount });
  }
  return result;
}

async function getClient() {
  const client = await pool.connect();
  return client;
}

async function testConnection() {
  const res = await pool.query('SELECT NOW() AS now');
  return res.rows[0].now;
}

module.exports = { pool, query, getClient, testConnection };