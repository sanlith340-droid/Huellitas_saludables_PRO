// app/models/auth.model.js
/**
 * models/auth.model.js
 * Consultas SQL para autenticación de usuarios.
 */

const { query } = require('../config/database');

/**
 * Busca un usuario por su correo electrónico
 */
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

/**
 * Busca un usuario por su ID
 */
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

/**
 * Crea un nuevo usuario (registro)
 * 
 * @param {Object} usuarioData - Datos del usuario
 * @param {string} usuarioData.id_usuario - ID del usuario (ej: USU001)
 * @param {string} usuarioData.nombre - Nombre del usuario
 * @param {string} usuarioData.apellidos - Apellidos del usuario
 * @param {string} usuarioData.telefono - Teléfono del usuario
 * @param {string} usuarioData.correo - Correo electrónico
 * @param {string} usuarioData.direccion - Dirección
 * @param {string} usuarioData.contrasena - Contraseña (sin hash en desarrollo)
 * @param {string|null} usuarioData.especializacion - Especialización (solo para especialistas)
 * @param {string|null} usuarioData.tipo - Tipo de usuario: 'principal' o 'acudiente' (solo para rol 'usuario')
 * @param {string} usuarioData.rol - Rol del usuario: 'usuario', 'especialista', 'recepcionista', 'admin'
 * 
 * @returns {Promise<Object>} Usuario creado (sin contraseña)
 */
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
    especializacion || null,  // Si es undefined o vacío, va NULL
    tipo || null,             // Si es undefined o vacío, va NULL
    rol || 'usuario'          // Por defecto 'usuario'
  ]);

  return rows[0] || null;
}

/**
 * Verifica si un ID de usuario ya existe
 */
async function existsById(id_usuario) {
  const sql = `SELECT 1 FROM usuario WHERE id_usuario = $1`;
  const { rows } = await query(sql, [id_usuario]);
  return rows.length > 0;
}

/**
 * Verifica si un correo ya está registrado
 */
async function existsByEmail(correo) {
  const sql = `SELECT 1 FROM usuario WHERE correo = $1`;
  const { rows } = await query(sql, [correo]);
  return rows.length > 0;
}

/**
 * Genera el siguiente ID de usuario basado en el rol
 * 
 * Ejemplos:
 * - usuario -> USU001, USU002, ...
 * - especialista -> ESP001, ESP002, ...
 * - recepcionista -> REC001, REC002, ...
 * - admin -> ADM001, ADM002, ...
 * 
 * @param {string} rol - Rol del usuario
 * @returns {Promise<string>} ID generado (ej: USU001)
 */
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

/**
 * Actualiza el tipo de usuario (principal/acudiente)
 */
async function updateTipo(id_usuario, tipo) {
  const sql = `
    UPDATE usuario 
    SET tipo = $1
    WHERE id_usuario = $2
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
  const { rows } = await query(sql, [tipo, id_usuario]);
  return rows[0] || null;
}

/**
 * Actualiza la especialización de un especialista
 */
async function updateEspecializacion(id_usuario, especializacion) {
  const sql = `
    UPDATE usuario 
    SET especializacion = $1
    WHERE id_usuario = $2
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
  const { rows } = await query(sql, [especializacion, id_usuario]);
  return rows[0] || null;
}

/**
 * Cambia la contraseña de un usuario
 */
async function updatePassword(id_usuario, nuevaContrasena) {
  const sql = `
    UPDATE usuario 
    SET contrasena = $1
    WHERE id_usuario = $2
    RETURNING id_usuario
  `;
  const { rows } = await query(sql, [nuevaContrasena, id_usuario]);
  return rows[0] || null;
}

module.exports = {
  findByEmail,
  findById,
  create,
  existsById,
  existsByEmail,
  generarIdUsuario,
  updateTipo,
  updateEspecializacion,
  updatePassword
};