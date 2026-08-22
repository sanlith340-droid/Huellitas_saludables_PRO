/**
 * controllers/cita.controller.js
 * ---------------------------------------------------------
 * Capa delgada: solo traduce HTTP <-> service.
 * ---------------------------------------------------------
 */
const citaService = require('../services/cita.service');
const asyncHandler = require('../utils/asyncHandler');
const { ok, created } = require('../utils/response');

const listar = asyncHandler(async (req, res) => {
  const citas = await citaService.listar(req.query);
  return ok(res, citas, 'Citas listadas correctamente');
});

const obtener = asyncHandler(async (req, res) => {
  const cita = await citaService.obtenerPorId(req.params.id);
  return ok(res, cita);
});

// RF10
const listarPorVeterinario = asyncHandler(async (req, res) => {
  const citas = await citaService.listarPorVeterinario(req.params.id_veterinario);
  return ok(res, citas, 'Citas asignadas al veterinario');
});

// RF07
const solicitar = asyncHandler(async (req, res) => {
  const cita = await citaService.solicitar({
    ...req.body,
    solicitante: req.user,
  });
  return created(res, cita, 'Cita solicitada correctamente');
});

const cambiarEstado = asyncHandler(async (req, res) => {
  const cita = await citaService.cambiarEstado(req.params.id, req.body.estado);
  return ok(res, cita, 'Estado de la cita actualizado correctamente');
});

module.exports = { listar, obtener, listarPorVeterinario, solicitar, cambiarEstado };
