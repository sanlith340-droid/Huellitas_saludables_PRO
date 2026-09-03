// app/controllers/raza.controller.js
/**
 * controllers/raza.controller.js
 * Controlador de razas (catálogo de solo lectura).
 */

const razaModel = require('../models/raza.model');
const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/response');

/**
 * Listar todas las razas
 * GET /api/razas
 */
const listar = asyncHandler(async (req, res) => {
  const razas = await razaModel.findAll();
  return ok(res, razas, 'Razas listadas correctamente');
});

module.exports = {
  listar
};
