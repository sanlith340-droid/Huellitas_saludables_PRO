/**
 * routes/disponibilidad.routes.js
 * ---------------------------------------------------------
 * Endpoints de disponibilidad de especialistas.
 * ---------------------------------------------------------
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

/*
|--------------------------------------------------------------------------
| LISTAR DISPONIBILIDAD
|--------------------------------------------------------------------------
| GET /api/disponibilidad
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  validate(listarDisponibilidadQuerySchema, 'query'),
  controller.listar
);

/*
|--------------------------------------------------------------------------
| OBTENER POR ID
|--------------------------------------------------------------------------
| GET /api/disponibilidad/:id
|--------------------------------------------------------------------------
*/

router.get(
  '/:id',
  validate(idParamSchema, 'params'),
  controller.obtener
);

/*
|--------------------------------------------------------------------------
| CREAR DISPONIBILIDAD  ← ESTE ES EL ENDPOINT QUE FALTA
|--------------------------------------------------------------------------
| POST /api/disponibilidad
|--------------------------------------------------------------------------
*/

router.post(
  '/',
  requireRole('recepcionista', 'admin'),
  validate(crearDisponibilidadSchema, 'body'),
  controller.crear
);

/*
|--------------------------------------------------------------------------
| ACTUALIZAR DISPONIBILIDAD
|--------------------------------------------------------------------------
| PUT /api/disponibilidad/:id
|--------------------------------------------------------------------------
*/

router.put(
  '/:id',
  requireRole('recepcionista', 'admin'),
  validate(idParamSchema, 'params'),
  validate(actualizarDisponibilidadSchema, 'body'),
  controller.actualizar
);

/*
|--------------------------------------------------------------------------
| ELIMINAR DISPONIBILIDAD
|--------------------------------------------------------------------------
| DELETE /api/disponibilidad/:id
|--------------------------------------------------------------------------
*/

router.delete(
  '/:id',
  requireRole('recepcionista', 'admin'),
  validate(idParamSchema, 'params'),
  controller.eliminar
);

module.exports = router;