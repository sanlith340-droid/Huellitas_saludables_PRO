/**
 * schemas/disponibilidad.schema.js
 * ---------------------------------------------------------
 * Validaciones de disponibilidad.
 * Compatible con database/data_jesus.
 * ---------------------------------------------------------
 */

const Joi =
  require('joi');

const ESTADOS_DISPONIBILIDAD = [
  'disponible',
  'ocupado'
];

const horaRegex =
  /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;

/*
|--------------------------------------------------------------------------
| CREAR
|--------------------------------------------------------------------------
*/

const crearDisponibilidadSchema =
  Joi.object({

    id_usuario:
      Joi.string()
        .max(10)
        .required(),

    fecha:
      Joi.date()
        .iso()
        .required(),

    hora:
      Joi.string()
        .pattern(horaRegex)
        .required(),

    estado:
      Joi.string()
        .valid(
          ...ESTADOS_DISPONIBILIDAD
        )
        .default('disponible')
  });

/*
|--------------------------------------------------------------------------
| EDITAR
|--------------------------------------------------------------------------
*/

const actualizarDisponibilidadSchema =
  Joi.object({

    id_usuario:
      Joi.string()
        .max(10),

    fecha:
      Joi.date()
        .iso(),

    hora:
      Joi.string()
        .pattern(horaRegex),

    estado:
      Joi.string()
        .valid(
          ...ESTADOS_DISPONIBILIDAD
        )

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

const listarDisponibilidadQuerySchema =
  Joi.object({

    id_usuario:
      Joi.string()
        .max(10),

    fecha:
      Joi.date()
        .iso(),

    estado:
      Joi.string()
        .valid(
          ...ESTADOS_DISPONIBILIDAD
        )
  });

module.exports = {
  ESTADOS_DISPONIBILIDAD,
  crearDisponibilidadSchema,
  actualizarDisponibilidadSchema,
  idParamSchema,
  listarDisponibilidadQuerySchema
};

