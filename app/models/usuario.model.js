/**
 * models/usuario.model.js
 * ---------------------------------------------------------
 * Solo se incluyen las consultas que el modulo de Citas +
 * Disponibilidad necesita sobre "usuario" (validar existencia
 * y rol de veterinarios/recepcionistas/duenos). El CRUD completo
 * de usuarios pertenece a otro modulo.
 * ---------------------------------------------------------
 */
const { query } = require('../config/database');

async function findById(id_usuario) {
  const sql = `
    SELECT id_usuario, nombre, apellido, correo, rol, especializacion, tipo
    FROM usuario
    WHERE id_usuario = $1
  `;
  const { rows } = await query(sql, [id_usuario]);
  return rows[0] || null;
}

async function findByIdAndRol(id_usuario, rol) {
  const sql = `
    SELECT id_usuario, nombre, apellido, correo, rol, especializacion, tipo
    FROM usuario
    WHERE id_usuario = $1 AND rol = $2
  `;
  const { rows } = await query(sql, [id_usuario, rol]);
  return rows[0] || null;
}

module.exports = { findById, findByIdAndRol };
