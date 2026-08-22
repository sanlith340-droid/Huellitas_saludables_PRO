/**
 * models/mascota.model.js
 * ---------------------------------------------------------
 * Solo las consultas que el modulo de Citas necesita sobre
 * "mascota" y "mascota_usuario" (validar que la mascota exista
 * y pertenezca al dueno que solicita la cita - RF07).
 * El CRUD completo de mascotas pertenece a otro modulo.
 * ---------------------------------------------------------
 */
const { query } = require('../config/database');

async function findById(id_mascota) {
  const sql = `SELECT id_mascota, nombre, id_raza, especie, genero FROM mascota WHERE id_mascota = $1`;
  const { rows } = await query(sql, [id_mascota]);
  return rows[0] || null;
}

async function perteneceAUsuario(id_mascota, id_usuario) {
  const sql = `
    SELECT 1 FROM mascota_usuario
    WHERE id_mascota = $1 AND id_usuario = $2
  `;
  const { rows } = await query(sql, [id_mascota, id_usuario]);
  return rows.length > 0;
}

module.exports = { findById, perteneceAUsuario };
