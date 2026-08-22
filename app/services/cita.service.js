/**
 * services/cita.service.js
 * ---------------------------------------------------------
 * RF07: "El dueno podra solicitar citas veterinarias segun
 *        disponibilidad del sistema."
 * RF10: "El veterinario podra consultar las citas que tiene
 *        asignadas."
 * ---------------------------------------------------------
 */
const citaModel = require('../models/cita.model');
const mascotaModel = require('../models/mascota.model');
const disponibilidadModel = require('../models/disponibilidad.model');
const usuarioModel = require('../models/usuario.model');
const notificacionService = require('./notificacion.service');
const AppError = require('../utils/AppError');

async function listar(filtros) {
  return citaModel.findAll(filtros);
}

async function obtenerPorId(id_cita) {
  const cita = await citaModel.findById(id_cita);
  if (!cita) throw AppError.notFound(`No existe cita con id ${id_cita}`);
  return cita;
}

/**
 * RF10: citas asignadas a un veterinario.
 */
async function listarPorVeterinario(id_veterinario) {
  const veterinario = await usuarioModel.findByIdAndRol(id_veterinario, 'veterinario');
  if (!veterinario) {
    throw AppError.badRequest(`id_usuario (${id_veterinario}) no corresponde a un veterinario registrado`);
  }
  return citaModel.findByVeterinario(id_veterinario);
}

/**
 * RF07: el dueno (req.user) solicita una cita para una de sus
 * mascotas, sobre una franja de disponibilidad libre. El registro
 * queda asociado al recepcionista/agendador que gestiona la
 * peticion (id_recepcionista), segun el modelo de datos actual.
 */
async function solicitar({ id_mascota, id_disponibilidad, motivos, solicitante, id_recepcionista }) {
  const mascota = await mascotaModel.findById(id_mascota);
  if (!mascota) throw AppError.notFound(`No existe la mascota con id ${id_mascota}`);

  // Un dueno solo puede agendar citas para sus propias mascotas.
  // Un recepcionista/admin puede agendar en nombre de cualquier dueno.
  if (solicitante.rol === 'usuario') {
    const esSuya = await mascotaModel.perteneceAUsuario(id_mascota, solicitante.id);
    if (!esSuya) {
      throw AppError.forbidden('La mascota indicada no pertenece al usuario autenticado');
    }
  }

  const recepcionistaId = id_recepcionista || solicitante.id;
  const recepcionista = await usuarioModel.findById(recepcionistaId);
  if (!recepcionista) {
    throw AppError.badRequest(`id_recepcionista (${recepcionistaId}) no existe en usuario`);
  }

  let resultado;
  try {
    resultado = await citaModel.createConTransaccion({
      id_mascota,
      id_disponibilidad,
      id_recepcionista: recepcionistaId,
      motivos,
    });
  } catch (err) {
    if (err.code === 'DISPONIBILIDAD_NO_EXISTE') {
      throw AppError.notFound(`No existe disponibilidad con id ${id_disponibilidad}`);
    }
    if (err.code === 'DISPONIBILIDAD_NO_LIBRE') {
      throw AppError.conflict('La franja de disponibilidad seleccionada ya no esta libre');
    }
    throw err;
  }

  await notificacionService.notificarNuevaCita({
    veterinarioId: resultado.veterinarioId,
    cita: resultado.cita,
  });

  return resultado.cita;
}

async function cambiarEstado(id_cita, estado) {
  const cita = await obtenerPorId(id_cita);

  if (estado === 'cdo') {
    // Cancelar libera la franja de disponibilidad (transaccion dedicada).
    const actualizada = await citaModel.cancelarConTransaccion(id_cita);
    const disponibilidad = await disponibilidadModel.findById(cita.id_disponibilidad);
    await notificacionService.notificarCambioEstadoCita({
      veterinarioId: disponibilidad?.id_usuario,
      cita: { ...cita, estado: actualizada.estado },
    });
    return actualizada;
  }

  const actualizada = await citaModel.actualizarEstado(id_cita, estado);
  await notificacionService.notificarCambioEstadoCita({
    veterinarioId: cita.id_veterinario,
    cita: actualizada,
  });
  return actualizada;
}

module.exports = { listar, obtenerPorId, listarPorVeterinario, solicitar, cambiarEstado };
