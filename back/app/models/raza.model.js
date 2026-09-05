// app/models/raza.model.js
const { query } = require('../config/database');

async function findById(id_raza) {
  const sql = `SELECT id_raza, nombre, fecha_registro FROM raza WHERE id_raza = $1`;
  const { rows } = await query(sql, [id_raza]);
  return rows[0] || null;
}

async function findAll() {
  const sql = `SELECT id_raza, nombre, fecha_registro FROM raza ORDER BY nombre ASC`;
  const { rows } = await query(sql);
  return rows;
}

module.exports = {
  findById,
  findAll,
};