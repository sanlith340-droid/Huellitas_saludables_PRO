/**
 * controllers/mascota.controller.js
 * Controlador de mascotas.
 */

const mascotaService = require('../services/mascota.service');
const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/response');
const AppError = require('../utils/AppError');

/**
 * Lista todas las mascotas con sus propietarios
 * GET /api/mascotas
 */
const listar = asyncHandler(async (req, res) => {
  const mascotas = await mascotaService.listar();
  return ok(res, mascotas, 'Mascotas y propietarios listados correctamente');
});

/**
 * Obtiene una mascota por su ID
 * GET /api/mascotas/:id
 */
const obtener = asyncHandler(async (req, res) => {
  const mascota = await mascotaService.obtenerPorId(req.params.id);
  return ok(res, mascota, 'Mascota encontrada correctamente');
});

module.exports = {
  listar,
  obtener
};