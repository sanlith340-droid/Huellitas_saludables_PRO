/**
 * services/disponibilidad.service.js
 * ---------------------------------------------------------
 * RF08: "El agendador podra gestionar la disponibilidad de
 * citas y organizar la agenda de los veterinarios."
 *
 * Reglas de negocio de esta tabla, separadas del acceso a datos
 * (models/disponibilidad.model.js) y del transporte HTTP
 * (controllers/disponibilidad.controller.js).
 * ---------------------------------------------------------
 */
const disponibilidadModel = require('../models/disponibilidad.model');
const usuarioModel = require('../models/usuario.model');
const notificacionService = require('./notificacion.service');
const AppError = require('../utils/AppError');

async function listar(filtros) {
  return disponibilidadModel.findAll(filtros);
}

async function obtenerPorId(id_disponibilidad) {
  const disp = await disponibilidadModel.findById(id_disponibilidad);
  if (!disp) throw AppError.notFound(`No existe disponibilidad con id ${id_disponibilidad}`);
  return disp;
}

async function crear(datos) {
  const veterinario = await usuarioModel.findByIdAndRol(datos.id_usuario, 'veterinario');
  if (!veterinario) {
    throw AppError.badRequest(`id_usuario (${datos.id_usuario}) no corresponde a un veterinario registrado`);
  }

  if (datos.hora_fin <= datos.hora_inicio) {
    throw AppError.badRequest('hora_fin debe ser mayor que hora_inicio');
  }

  const solapes = await disponibilidadModel.findSolapes({
    id_usuario: datos.id_usuario,
    fecha: datos.fecha,
    hora_inicio: datos.hora_inicio,
    hora_fin: datos.hora_fin,
  });
  if (solapes.length > 0) {
    throw AppError.conflict(
      `El veterinario ya tiene una franja de disponibilidad que se cruza con ese horario (id_disponibilidad ${solapes[0].id_disponibilidad})`
    );
  }

  return disponibilidadModel.create(datos);
}

async function actualizar(id_disponibilidad, cambios) {
  const actual = await obtenerPorId(id_disponibilidad);

  if (actual.estado === 'ocupado' && cambios.estado !== 'disponible' && (cambios.hora_inicio || cambios.hora_fin || cambios.fecha)) {
    throw AppError.conflict('No se puede reprogramar una franja que ya tiene una cita asociada (estado "ocupado")');
  }

  const fecha = cambios.fecha || actual.fecha;
  const hora_inicio = cambios.hora_inicio || actual.hora_inicio;
  const hora_fin = cambios.hora_fin || actual.hora_fin;

  if (hora_fin <= hora_inicio) {
    throw AppError.badRequest('hora_fin debe ser mayor que hora_inicio');
  }

  if (cambios.fecha || cambios.hora_inicio || cambios.hora_fin) {
    const solapes = await disponibilidadModel.findSolapes({
      id_usuario: actual.id_usuario,
      fecha,
      hora_inicio,
      hora_fin,
      excluirId: id_disponibilidad,
    });
    if (solapes.length > 0) {
      throw AppError.conflict('El nuevo horario se cruza con otra franja existente del veterinario');
    }
  }

  const actualizada = await disponibilidadModel.update(id_disponibilidad, cambios);

  if (cambios.estado && cambios.estado !== actual.estado) {
    await notificacionService.notificarCambioDisponibilidad({
      veterinarioId: actual.id_usuario,
      disponibilidad: actualizada,
    });
  }

  return actualizada;
}

async function eliminar(id_disponibilidad) {
  const actual = await obtenerPorId(id_disponibilidad);
  if (actual.estado === 'ocupado') {
    throw AppError.conflict('No se puede eliminar una franja "ocupado" (tiene una cita asociada); cancele la cita primero');
  }
  return disponibilidadModel.remove(id_disponibilidad);
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
