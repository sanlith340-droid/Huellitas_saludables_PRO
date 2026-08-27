/**
 * routes/cita.routes.js
 * ---------------------------------------------------------
 * Endpoints de citas.
 * ---------------------------------------------------------
 */

const {
  Router
} = require('express');

const controller =
  require('../controllers/cita.controller');

const validate =
  require('../middlewares/validate');

const {
  requireRole
} = require('../middlewares/identifyUser');

const {
  crearCitaSchema,
  editarCitaSchema,
  idParamSchema,
  listarCitasQuerySchema
} = require('../schemas/cita.schema');

const Joi = require('joi');

const router = Router();

/*
|--------------------------------------------------------------------------
| LISTAR CITAS
|--------------------------------------------------------------------------
| GET /api/citas
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  validate(
    listarCitasQuerySchema,
    'query'
  ),
  controller.listar
);

/*
|--------------------------------------------------------------------------
| CITAS DE UN ESPECIALISTA
|--------------------------------------------------------------------------
| GET /api/citas/especialista/ESP001
|--------------------------------------------------------------------------
*/

router.get(
  '/especialista/:id_especialista',
  validate(
    Joi.object({
      id_especialista:
        Joi.string()
          .max(10)
          .required()
    }),
    'params'
  ),
  controller.listarPorEspecialista
);

/*
|--------------------------------------------------------------------------
| OBTENER CITA POR ID
|--------------------------------------------------------------------------
| GET /api/citas/1
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
| CREAR CITA
|--------------------------------------------------------------------------
| POST /api/citas
|--------------------------------------------------------------------------
*/

router.post(
  '/',
  requireRole(
    'usuario',
    'recepcionista',
    'admin'
  ),
  validate(
    crearCitaSchema,
    'body'
  ),
  controller.crear
);

/*
|--------------------------------------------------------------------------
| EDITAR CITA
|--------------------------------------------------------------------------
| PUT /api/citas/:id
|--------------------------------------------------------------------------
*/

router.put(
  '/:id',
  requireRole(
    'usuario',
    'recepcionista',
    'admin'
  ),
  validate(
    idParamSchema,
    'params'
  ),
  validate(
    editarCitaSchema,
    'body'
  ),
  controller.editar
);

/*
|--------------------------------------------------------------------------
| CANCELAR CITA
|--------------------------------------------------------------------------
| PATCH /api/citas/:id/cancelar
|--------------------------------------------------------------------------
*/

router.patch(
  '/:id/cancelar',
  requireRole(
    'usuario',
    'recepcionista',
    'admin'
  ),
  validate(
    idParamSchema,
    'params'
  ),
  controller.cancelar
);

module.exports = router;

