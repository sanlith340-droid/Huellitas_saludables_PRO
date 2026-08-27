/**
 * schemas/cita.schema.js
 * ---------------------------------------------------------
 * Validaciones de citas.
 * Compatible con database/data_jesus.
 * ---------------------------------------------------------
 */

const Joi =
  require('joi');

const ESTADOS_CITA = [
  'pendiente',
  'confirmado',
  'cancelado',
  'atendido'
];

/*
|--------------------------------------------------------------------------
| CREAR
|--------------------------------------------------------------------------
*/

const crearCitaSchema =
  Joi.object({

    id_mascota:
      Joi.number()
        .integer()
        .positive()
        .required(),

    id_disponibilidad:
      Joi.number()
        .integer()
        .positive()
        .required(),

    motivo:
      Joi.string()
        .max(200)
        .required()
  });

/*
|--------------------------------------------------------------------------
| EDITAR
|--------------------------------------------------------------------------
*/

const editarCitaSchema =
  Joi.object({

    id_mascota:
      Joi.number()
        .integer()
        .positive(),

    id_disponibilidad:
      Joi.number()
        .integer()
        .positive(),

    motivo:
      Joi.string()
        .max(200)
  }).min(1);

/*
|--------------------------------------------------------------------------
| ID
|--------------------------------------------------------------------------
*/

const idParamSchema =
  Joi.object({

    id:
      Joi.number()
        .integer()
        .positive()
        .required()
  });

/*
|--------------------------------------------------------------------------
| FILTROS
|--------------------------------------------------------------------------
*/

const listarCitasQuerySchema =
  Joi.object({

    id_mascota:
      Joi.number()
        .integer()
        .positive(),

    estado:
      Joi.string()
        .valid(
          ...ESTADOS_CITA
        ),

    fecha:
      Joi.date()
        .iso(),

    id_especialista:
      Joi.string()
        .max(10)
  });

module.exports = {
  ESTADOS_CITA,
  crearCitaSchema,
  editarCitaSchema,
  idParamSchema,
  listarCitasQuerySchema
};

