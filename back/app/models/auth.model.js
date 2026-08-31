// app/models/auth.model.js
/**
 * models/auth.model.js
 * Consultas SQL para autenticación de usuarios.
 */

const { query } = require('../config/database');

async function findByEmail(correo) {
  const sql = `
    SELECT
      id_usuario,
      nombre,
      apellidos,
      telefono,
      correo,
      direccion,
      contrasena,
      especializacion,
      tipo,
      rol,
      fecha_registro
    FROM usuario
    WHERE correo = $1
  `;
  const { rows } = await query(sql, [correo]);
  return rows[0] || null;
}

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

async function create(usuarioData) {
  const {
    id_usuario,
    nombre,
    apellidos,
    telefono,
    correo,
    direccion,
    contrasena,
    especializacion,
    tipo,
    rol
  } = usuarioData;

  const sql = `
    INSERT INTO usuario (
      id_usuario,
      nombre,
      apellidos,
      telefono,
      correo,
      direccion,
      contrasena,
      especializacion,
      tipo,
      rol
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING
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
  `;

  const { rows } = await query(sql, [
    id_usuario,
    nombre,
    apellidos,
    telefono,
    correo,
    direccion,
    contrasena,
    especializacion || null,
    tipo || null,
    rol || 'usuario'
  ]);

  return rows[0] || null;
}

async function existsByEmail(correo) {
  const sql = `SELECT 1 FROM usuario WHERE correo = $1`;
  const { rows } = await query(sql, [correo]);
  return rows.length > 0;
}

async function generarIdUsuario(rol) {
  const prefixMap = {
    'usuario': 'USU',
    'especialista': 'ESP',
    'recepcionista': 'REC',
    'admin': 'ADM'
  };

  const prefix = prefixMap[rol] || 'USU';
  
  const sql = `
    SELECT id_usuario 
    FROM usuario 
    WHERE id_usuario LIKE $1
    ORDER BY id_usuario DESC 
    LIMIT 1
  `;

  const { rows } = await query(sql, [`${prefix}%`]);

  if (rows.length === 0) {
    return `${prefix}001`;
  }

  const lastId = rows[0].id_usuario;
  const num = parseInt(lastId.replace(prefix, '')) + 1;
  return `${prefix}${String(num).padStart(3, '0')}`;
}

module.exports = {
  findByEmail,
  findById,
  create,
  existsByEmail,
  generarIdUsuario
};