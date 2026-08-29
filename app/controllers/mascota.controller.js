// app/controllers/mascota.controller.js
/**
 * controllers/mascota.controller.js
 * Controlador de mascotas.
 */

const mascotaService = require('../services/mascota.service');
const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/response');

const listar = asyncHandler(async (req, res) => {
  const mascotas = await mascotaService.listar();
  return ok(res, mascotas, 'Mascotas y propietarios listados correctamente');
});

const obtener = asyncHandler(async (req, res) => {
  const mascota = await mascotaService.obtenerPorId(req.params.id);
  return ok(res, mascota, 'Mascota encontrada correctamente');
});

module.exports = {
  listar,
  obtener
};