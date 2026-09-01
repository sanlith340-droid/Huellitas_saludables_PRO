// app/controllers/mascota.controller.js
/**
 * controllers/mascota.controller.js
 * Controlador de mascotas.
 */

const mascotaService = require('../services/mascota.service');
const asyncHandler = require('../utils/asyncHandler');
const { ok, created } = require('../utils/response');
const AppError = require('../utils/AppError');

/**
 * Listar todas las mascotas con sus propietarios
 * GET /api/mascotas
 */
const listar = asyncHandler(async (req, res) => {
  const mascotas = await mascotaService.listar();
  return ok(res, mascotas, 'Mascotas y propietarios listados correctamente');
});

/**
 * Obtener una mascota por su ID
 * GET /api/mascotas/:id
 */
const obtener = asyncHandler(async (req, res) => {
  const mascota = await mascotaService.obtenerPorId(req.params.id);
  return ok(res, mascota, 'Mascota encontrada correctamente');
});

/**
 * CREAR MASCOTA (asignación automática al usuario autenticado)
 * POST /api/mascotas
 * 
 * Headers requeridos:
 *   x-user-id: USU001
 *   x-user-role: usuario
 * 
 * Request Body:
 * {
 *   "nombre": "Firulais",
 *   "fecha_nacimiento": "2023-05-15",
 *   "especie": "perro",
 *   "genero": "macho",
 *   "id_raza": 1
 * }
 */
const crear = asyncHandler(async (req, res) => {
  // 1. Verificar autenticación
  if (!req.user) {
    throw AppError.unauthorized('Usuario no autenticado');
  }

  // 2. Solo usuarios normales y admin pueden crear mascotas
  const rolesPermitidos = ['usuario', 'admin'];
  if (!rolesPermitidos.includes(req.user.rol)) {
    throw AppError.forbidden('Solo los usuarios pueden registrar mascotas');
  }

  // 3. Crear mascota y asignar al usuario
  const mascota = await mascotaService.crearConUsuario(
    req.body,
    req.user.id  // El usuario autenticado es el propietario
  );

  return created(res, mascota, 'Mascota registrada exitosamente');
});

module.exports = {
  listar,
  obtener,
  crear  // ← NUEVO
};