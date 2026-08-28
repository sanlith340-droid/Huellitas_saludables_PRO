/**
 * controllers/disponibilidad.controller.js
 * Controlador de disponibilidad.
 */

const disponibilidadService = require('../services/disponibilidad.service');
const asyncHandler = require('../utils/asyncHandler');
const { ok, created } = require('../utils/response');
const AppError = require('../utils/AppError');

/**
 * Lista todas las disponibilidades con filtros opcionales
 * GET /api/disponibilidad
 */
const listar = asyncHandler(async (req, res) => {
  const datos = await disponibilidadService.listar(req.query);
  return ok(res, datos, 'Disponibilidades listadas correctamente');
});

/**
 * Obtiene una disponibilidad por su ID
 * GET /api/disponibilidad/:id
 */
const obtener = asyncHandler(async (req, res) => {
  const dato = await disponibilidadService.obtenerPorId(req.params.id);
  return ok(res, dato, 'Disponibilidad encontrada correctamente');
});

/**
 * Crea una nueva disponibilidad
 * POST /api/disponibilidad
 */
const crear = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw AppError.unauthorized('Usuario no autenticado');
  }

  if (!['recepcionista', 'admin'].includes(req.user.rol)) {
    throw AppError.forbidden('Solo recepcionistas o administradores pueden crear disponibilidades');
  }

  const dato = await disponibilidadService.crear(req.body);
  return created(res, dato, 'Disponibilidad creada correctamente');
});

/**
 * Actualiza una disponibilidad existente
 * PUT /api/disponibilidad/:id
 */
const actualizar = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw AppError.unauthorized('Usuario no autenticado');
  }

  if (!['recepcionista', 'admin'].includes(req.user.rol)) {
    throw AppError.forbidden('Solo recepcionistas o administradores pueden actualizar disponibilidades');
  }

  const dato = await disponibilidadService.actualizar(req.params.id, req.body);
  return ok(res, dato, 'Disponibilidad actualizada correctamente');
});

/**
 * Elimina una disponibilidad
 * DELETE /api/disponibilidad/:id
 */
const eliminar = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw AppError.unauthorized('Usuario no autenticado');
  }

  if (!['recepcionista', 'admin'].includes(req.user.rol)) {
    throw AppError.forbidden('Solo recepcionistas o administradores pueden eliminar disponibilidades');
  }

  await disponibilidadService.eliminar(req.params.id);
  return ok(res, null, 'Disponibilidad eliminada correctamente');
});

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar
};