/**
 * routes/disponibilidad.routes.js
 * Endpoints de disponibilidad de especialistas.
 */

const { Router } = require('express');
const controller = require('../controllers/disponibilidad.controller');
const validate = require('../middlewares/validate');
const { requireRole } = require('../middlewares/identifyUser');
const {
  crearDisponibilidadSchema,
  actualizarDisponibilidadSchema,
  idParamSchema,
  listarDisponibilidadQuerySchema
} = require('../schemas/disponibilidad.schema');

const router = Router();

// Listar disponibilidad
router.get('/', validate(listarDisponibilidadQuerySchema, 'query'), controller.listar);

// Obtener por ID
router.get('/:id', validate(idParamSchema, 'params'), controller.obtener);

// Crear (solo recepcionistas y admin)
router.post(
  '/',
  requireRole('recepcionista', 'admin'),
  validate(crearDisponibilidadSchema, 'body'),
  controller.crear
);

// Editar (solo recepcionistas y admin)
router.put(
  '/:id',
  requireRole('recepcionista', 'admin'),
  validate(idParamSchema, 'params'),
  validate(actualizarDisponibilidadSchema, 'body'),
  controller.actualizar
);

// Eliminar (solo recepcionistas y admin)
router.delete(
  '/:id',
  requireRole('recepcionista', 'admin'),
  validate(idParamSchema, 'params'),
  controller.eliminar
);

module.exports = router;