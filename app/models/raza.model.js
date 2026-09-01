// app/models/raza.model.js
/**
 * models/raza.model.js
 * Consultas SQL para razas.
 */

const { query } = require('../config/database');

/**
 * Buscar raza por ID
 */
async function findById(id_raza) {
  const sql = `
    SELECT
      id_raza,
      nombre,
      fecha_registro
    FROM raza
    WHERE id_raza = $1
  `;
  const { rows } = await query(sql, [id_raza]);
  return rows[0] || null;
}

/**
 * Listar todas las razas
 */
async function findAll() {
  const sql = `
    SELECT
      id_raza,
      nombre,
      fecha_registro
    FROM raza
    ORDER BY nombre ASC
  `;
  const { rows } = await query(sql);
  return rows;
}

/**
 * Buscar raza por nombre
 */
async function findByNombre(nombre) {
  const sql = `
    SELECT
      id_raza,
      nombre,
      fecha_registro
    FROM raza
    WHERE nombre ILIKE $1
  `;
  const { rows } = await query(sql, [`%${nombre}%`]);
  return rows;
}

module.exports = {
  findById,
  findAll,
  findByNombre
};