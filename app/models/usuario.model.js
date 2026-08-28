/**
 * models/usuario.model.js
 * Consultas SQL de usuarios.
 */

const { query } = require('../config/database');

async function findById(id_usuario) {
  const sql = `
    SELECT
      id_usuario,
      nombre,
      apellidos,
      telefono,
      correo,
      direccion,
      especializacion,
      tipo,
      rol,
      fecha_registro
    FROM usuario
    WHERE id_usuario = $1
  `;

  const { rows } = await query(sql, [id_usuario]);
  return rows[0] || null;
}

async function findByIdAndRol(id_usuario, rol) {
  const sql = `
    SELECT
      id_usuario,
      nombre,
      apellidos,
      telefono,
      correo,
      direccion,
      especializacion,
      tipo,
      rol,
      fecha_registro
    FROM usuario
    WHERE id_usuario = $1 AND rol = $2
  `;

  const { rows } = await query(sql, [id_usuario, rol]);
  return rows[0] || null;
}

async function findByDocumento(documento) {
  const sql = `
    SELECT
      id_usuario,
      nombre,
      apellidos,
      telefono,
      correo,
      direccion,
      especializacion,
      tipo,
      rol,
      fecha_registro
    FROM usuario
    WHERE id_usuario = $1
  `;

  const { rows } = await query(sql, [documento]);
  return rows[0] || null;
}

async function findEspecialistas() {
  const sql = `
    SELECT
      id_usuario,
      nombre,
      apellidos,
      telefono,
      correo,
      especializacion,
      tipo,
      rol
    FROM usuario
    WHERE rol = 'especialista'
    ORDER BY nombre ASC
  `;

  const { rows } = await query(sql);
  return rows;
}

module.exports = {
  findById,
  findByIdAndRol,
  findByDocumento,
  findEspecialistas
};