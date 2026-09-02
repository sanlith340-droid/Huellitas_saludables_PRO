// app/routes/mascota.routes.js
/**
 * routes/mascota.routes.js
 * Endpoints para consultar mascotas y sus propietarios.
 */

const { Router } = require('express');
const controller = require('../controllers/mascota.controller');
const validate = require('../middlewares/validate');
const { requireRole } = require('../middlewares/identifyUser');
const { crearMascotaSchema } = require('../schemas/mascota.schema');  // ← NUEVO

const router = Router();

/**
 * GET /api/mascotas
 * Listar todas las mascotas (requiere autenticación)
 */
router.get('/', controller.listar);

/**
 * GET /api/mascotas/:id
 * Obtener una mascota por ID (requiere autenticación)
 */
router.get('/:id', controller.obtener);

/**
 * POST /api/mascotas
 * Registrar una nueva mascota (asignación automática al usuario)
 * Solo usuarios y admin
 */
router.post(
  '/',
  requireRole('usuario', 'admin'),
  validate(crearMascotaSchema, 'body'),
  controller.crear
);

module.exports = router;