/**
 * services/disponibilidad.service.js
 * ---------------------------------------------------------
 * Lógica de negocio de disponibilidad.
 * ---------------------------------------------------------
 */

const disponibilidadModel = require('../models/disponibilidad.model');
const usuarioModel = require('../models/usuario.model');
const AppError = require('../utils/AppError');
const notificacionService = require('./notificacion.service');

/*
|--------------------------------------------------------------------------
| LISTAR DISPONIBILIDAD
|--------------------------------------------------------------------------
*/

async function listar(filtros) {
  return disponibilidadModel.findAll(filtros);
}

/*
|--------------------------------------------------------------------------
| OBTENER DISPONIBILIDAD POR ID
|--------------------------------------------------------------------------
*/

async function obtenerPorId(id) {
  const disponibilidad = await disponibilidadModel.findById(id);
  if (!disponibilidad) {
    throw AppError.notFound(`No existe disponibilidad con id ${id}`);
  }
  return disponibilidad;
}

/*
|--------------------------------------------------------------------------
| CREAR DISPONIBILIDAD
|--------------------------------------------------------------------------
*/

async function crear(datos) {
  // 1. Verificar que el usuario exista y sea especialista
  const especialista = await usuarioModel.findByIdAndRol(datos.id_usuario, 'especialista');
  if (!especialista) {
    throw AppError.badRequest(`El usuario ${datos.id_usuario} no es un especialista`);
  }

  // 2. Verificar que no exista el mismo horario
  const existentes = await disponibilidadModel.findAll({
    id_usuario: datos.id_usuario,
    fecha: datos.fecha
  });

  const mismoHorario = existentes.some(item => String(item.hora) === String(datos.hora));
  if (mismoHorario) {
    throw AppError.conflict('El especialista ya tiene una disponibilidad para esa fecha y hora');
  }

  // 3. Crear disponibilidad
  try {
    const disponibilidad = await disponibilidadModel.create({
      id_usuario: datos.id_usuario,
      fecha: datos.fecha,
      hora: datos.hora,
      estado: datos.estado || 'disponible'
    });

    // 4. Notificar al especialista (RF09)
    await notificacionService.notificarCambioDisponibilidad({
      veterinarioId: datos.id_usuario,
      disponibilidad
    });

    return disponibilidad;
  } catch (error) {
    if (error.code === '23505') {
      throw AppError.conflict('Ya existe una disponibilidad para ese especialista, fecha y hora');
    }
    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| ACTUALIZAR DISPONIBILIDAD
|--------------------------------------------------------------------------
*/

async function actualizar(id, cambios) {
  // 1. Obtener disponibilidad actual
  const actual = await obtenerPorId(id);

  // 2. No modificar si está ocupada
  if (actual.estado === 'ocupado' && 
      (cambios.fecha !== undefined || cambios.hora !== undefined || cambios.id_usuario !== undefined)) {
    throw AppError.conflict('No se puede modificar fecha, hora o especialista de una disponibilidad ocupada');
  }

  // 3. Si cambia especialista, validar rol
  if (cambios.id_usuario) {
    const especialista = await usuarioModel.findByIdAndRol(cambios.id_usuario, 'especialista');
    if (!especialista) {
      throw AppError.badRequest('El nuevo usuario no es un especialista');
    }
  }

  // 4. Actualizar disponibilidad
  const disponibilidad = await disponibilidadModel.update(id, cambios);

  // 5. Notificar al especialista (RF09)
  if (disponibilidad) {
    await notificacionService.notificarCambioDisponibilidad({
      veterinarioId: disponibilidad.id_usuario,
      disponibilidad
    });
  }

  return disponibilidad;
}

/*
|--------------------------------------------------------------------------
| ELIMINAR DISPONIBILIDAD
|--------------------------------------------------------------------------
*/

async function eliminar(id) {
  // 1. Obtener disponibilidad actual
  const actual = await obtenerPorId(id);

  // 2. No eliminar si está ocupada
  if (actual.estado === 'ocupado') {
    throw AppError.conflict('No se puede eliminar una disponibilidad ocupada');
  }

  // 3. Eliminar disponibilidad
  return disponibilidadModel.remove(id);
}

module.exports = {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};