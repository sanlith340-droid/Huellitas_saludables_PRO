/**
 * controllers/usuario.controller.js
 * Controlador de usuarios.
 */

const usuarioService = require('../services/usuario.service');
const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/response');
const AppError = require('../utils/AppError');

/**
 * Busca un usuario por su número de documento/ID
 * GET /api/usuarios/:documento
 */
const obtenerPorDocumento = asyncHandler(async (req, res) => {
  const { documento } = req.params;

  if (!documento || documento.trim().length === 0) {
    throw AppError.badRequest('El ID del usuario es requerido');
  }

  const usuario = await usuarioService.obtenerPorDocumento(documento);
  return ok(res, usuario, 'Usuario encontrado correctamente');
});

/**
 * Lista todos los especialistas
 * GET /api/usuarios/especialistas
 */
const listarEspecialistas = asyncHandler(async (req, res) => {
  const especialistas = await usuarioService.listarEspecialistas();
  return ok(res, especialistas, 'Especialistas listados correctamente');
});

module.exports = {
  obtenerPorDocumento,
  listarEspecialistas
};