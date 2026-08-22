/**
 * config/database.js
 * ---------------------------------------------------------
 * Configuracion del pool de conexiones a PostgreSQL.
 *
 * Por decision del equipo, en esta fase del proyecto NO se usa
 * un ORM (Sequelize, Prisma, TypeORM, etc). Todas las consultas
 * se escriben en SQL puro y se ejecutan a traves de este pool,
 * usando el driver oficial "pg".
 *
 * Motivo: permite validar el modelo entidad-relacion real
 * (huellitas_saludables_backup.sql) contra consultas explicitas
 * antes de introducir una capa de abstraccion adicional.
 * ---------------------------------------------------------
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'huellitas_saludables',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  // Errores en clientes inactivos del pool (no rompen una request en curso)
  console.error('[db] Error inesperado en cliente inactivo del pool:', err.message);
});

/**
 * Ejecuta una consulta simple contra el pool.
 * @param {string} text - Sentencia SQL parametrizada ($1, $2, ...)
 * @param {Array} params - Parametros de la consulta
 */
async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  if (process.env.NODE_ENV !== 'production') {
    const duration = Date.now() - start;
    console.log('[db] query', { text, duration, rows: result.rowCount });
  }
  return result;
}

/**
 * Obtiene un cliente dedicado del pool para ejecutar transacciones
 * (BEGIN / COMMIT / ROLLBACK). Debe liberarse siempre con client.release().
 */
async function getClient() {
  const client = await pool.connect();
  return client;
}

async function testConnection() {
  const res = await pool.query('SELECT NOW() AS now');
  return res.rows[0].now;
}

module.exports = { pool, query, getClient, testConnection };
