/**
 * controllers/disponibilidad.controller.js
 * ---------------------------------------------------------
 * Capa delgada: solo traduce HTTP <-> service. Sin logica de
 * negocio ni SQL aqui (eso vive en services/ y models/).
 * ---------------------------------------------------------
 */
const disponibilidadService = require('../services/disponibilidad.service');
const asyncHandler = require('../utils/asyncHandler');
const { ok, created } = require('../utils/response');

const listar = asyncHandler(async (req, res) => {
  const disponibilidades = await disponibilidadService.listar(req.query);
  return ok(res, disponibilidades, 'Disponibilidad listada correctamente');
});

const obtener = asyncHandler(async (req, res) => {
  const disponibilidad = await disponibilidadService.obtenerPorId(req.params.id);
  return ok(res, disponibilidad);
});

const crear = asyncHandler(async (req, res) => {
  const nueva = await disponibilidadService.crear(req.body);
  return created(res, nueva, 'Franja de disponibilidad creada correctamente');
});

const actualizar = asyncHandler(async (req, res) => {
  const actualizada = await disponibilidadService.actualizar(req.params.id, req.body);
  return ok(res, actualizada, 'Disponibilidad actualizada correctamente');
});

const eliminar = asyncHandler(async (req, res) => {
  await disponibilidadService.eliminar(req.params.id);
  return ok(res, null, 'Disponibilidad eliminada correctamente');
});

module.exports = { listar, obtener, crear, actualizar, eliminar };
