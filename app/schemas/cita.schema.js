/**
 * schemas/cita.schema.js
 * ---------------------------------------------------------
 * Reglas de validacion para la tabla "cita", basadas en el DDL
 * real (database/huellitas_saludables_backup.sql):
 *
 *   id_cita            SERIAL PK
 *   id_mascota         integer NOT NULL
 *   id_disponibilidad  integer NOT NULL
 *   id_recepcionista   varchar(15) NOT NULL
 *   motivos            text
 *   estado             varchar(10) DEFAULT 'p'  CHECK IN ('p','c','cdo')
 *   fecha_registro     timestamp DEFAULT now()
 *
 * NOTA sobre "estado": el CHECK de la base de datos solo permite
 * 'p' | 'c' | 'cdo'. En este modulo se documentan como:
 *   p   -> pendiente
 *   c   -> confirmada
 *   cdo -> cancelada
 * (ajustar aqui si el equipo definio otro significado).
 * ---------------------------------------------------------
 */
const Joi = require('joi');

const ESTADOS_CITA = ['p', 'c', 'cdo'];

const crearCitaSchema = Joi.object({
  id_mascota: Joi.number().integer().positive().required(),
  id_disponibilidad: Joi.number().integer().positive().required(),
  motivos: Joi.string().max(1000).allow('', null),
});

const actualizarEstadoCitaSchema = Joi.object({
  estado: Joi.string()
    .valid(...ESTADOS_CITA)
    .required()
    .messages({ 'any.only': `estado debe ser uno de: ${ESTADOS_CITA.join(', ')}` }),
});

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const listarCitasQuerySchema = Joi.object({
  id_mascota: Joi.number().integer().positive(),
  estado: Joi.string().valid(...ESTADOS_CITA),
  fecha: Joi.date().iso(),
});

module.exports = {
  ESTADOS_CITA,
  crearCitaSchema,
  actualizarEstadoCitaSchema,
  idParamSchema,
  listarCitasQuerySchema,
};
