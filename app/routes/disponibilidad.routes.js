/**
 * routes/disponibilidad.routes.js
 * ---------------------------------------------------------
 * Endpoints de disponibilidad de especialistas.
 * ---------------------------------------------------------
 */

const {
  Router
} = require('express');

const controller =
  require('../controllers/disponibilidad.controller');

const validate =
  require('../middlewares/validate');

const {
  requireRole
} = require('../middlewares/identifyUser');

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
|
| GET /api/disponibilidad
|
| Ejemplo:
|
| /api/disponibilidad?id_usuario=ESP001
|
| /api/disponibilidad?fecha=2026-08-19
|
| /api/disponibilidad?id_usuario=ESP001&fecha=2026-08-19
|
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  validate(
    listarDisponibilidadQuerySchema,
    'query'
  ),
  controller.listar
);

/*
|--------------------------------------------------------------------------
| OBTENER POR ID
|--------------------------------------------------------------------------
*/

router.get(
  '/:id',
  validate(
    idParamSchema,
    'params'
  ),
  controller.obtener
);

/*
|--------------------------------------------------------------------------
| CREAR
|--------------------------------------------------------------------------
*/

router.post(
  '/',
  requireRole(
    'recepcionista',
    'admin'
  ),
  validate(
    crearDisponibilidadSchema,
    'body'
  ),
  controller.crear
);

/*
|--------------------------------------------------------------------------
| EDITAR
|--------------------------------------------------------------------------
*/

router.put(
  '/:id',
  requireRole(
    'recepcionista',
    'admin'
  ),
  validate(
    idParamSchema,
    'params'
  ),
  validate(
    actualizarDisponibilidadSchema,
    'body'
  ),
  controller.actualizar
);

/*
|--------------------------------------------------------------------------
| ELIMINAR
|--------------------------------------------------------------------------
*/

router.delete(
  '/:id',
  requireRole(
    'recepcionista',
    'admin'
  ),
  validate(
    idParamSchema,
    'params'
  ),
  controller.eliminar
);

module.exports = router;

