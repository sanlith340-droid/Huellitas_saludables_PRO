// app/services/mascota.service.js
/**
 * services/mascota.service.js
 * Lógica de negocio de mascotas.
 */

const mascotaModel = require('../models/mascota.model');
const razaModel = require('../models/raza.model');  // ← NUEVO (si no existe, lo creamos)
const AppError = require('../utils/AppError');

async function listar() {
  return mascotaModel.findAll();
}

async function obtenerPorId(id_mascota) {
  const mascota = await mascotaModel.findById(id_mascota);
  if (!mascota) {
    throw AppError.notFound(`No existe la mascota con id ${id_mascota}`);
  }
  return mascota;
}

/**
 * CREAR MASCOTA CON ASIGNACIÓN AUTOMÁTICA AL USUARIO
 */
async function crearConUsuario(datos, id_usuario) {
  const {
    nombre,
    fecha_nacimiento,
    especie,
    genero,
    id_raza
  } = datos;

  // 1. Validar que la raza existe
  if (id_raza) {
    const raza = await razaModel.findById(id_raza);
    if (!raza) {
      throw AppError.notFound(`No existe la raza con id ${id_raza}`);
    }
  }

  // 2. Validar especie
  const especiesPermitidas = ['perro', 'gato'];
  if (!especiesPermitidas.includes(especie)) {
    throw AppError.badRequest(`La especie debe ser: ${especiesPermitidas.join(', ')}`);
  }

  // 3. Validar género
  const generosPermitidos = ['macho', 'hembra'];
  if (!generosPermitidos.includes(genero)) {
    throw AppError.badRequest(`El género debe ser: ${generosPermitidos.join(', ')}`);
  }

  // 4. Validar que el usuario existe (opcional, pero recomendado)
  // Esto ya lo hace el middleware identifyUser

  // 5. Crear mascota y asignar al usuario
  try {
    return await mascotaModel.crearConUsuario({
      nombre,
      fecha_nacimiento,
      especie,
      genero,
      id_raza,
      id_usuario
    });
  } catch (error) {
    if (error.code === '23505') {
      throw AppError.conflict('Ya existe una mascota con esos datos');
    }
    throw error;
  }
}

module.exports = {
  listar,
  obtenerPorId,
  crearConUsuario  // ← NUEVO
};