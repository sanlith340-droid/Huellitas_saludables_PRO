/**
 * schemas/disponibilidad.schema.js
 * ---------------------------------------------------------
 * Reglas de validacion para la tabla "disponibilidad", basadas
 * estrictamente en el DDL real (database/huellitas_saludables_backup.sql):
 *
 *   id_disponibilidad SERIAL PK
 *   id_usuario        varchar(15) NOT NULL  (veterinario)
 *   fecha             date NOT NULL
 *   estado            varchar(20) DEFAULT 'disponible'
 *   hora_inicio       time NOT NULL
 *   hora_fin          time NOT NULL   -- CHECK hora_fin > hora_inicio
 * ---------------------------------------------------------
 */
const Joi = require('joi');

const ESTADOS_DISPONIBILIDAD = ['disponible', 'ocupado', 'cancelado'];

const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;

const crearDisponibilidadSchema = Joi.object({
  id_usuario: Joi.string().max(15).required().messages({
    'any.required': 'id_usuario (veterinario) es obligatorio',
  }),
  fecha: Joi.date().iso().required(),
  hora_inicio: Joi.string().pattern(horaRegex).required().messages({
    'string.pattern.base': 'hora_inicio debe tener formato HH:mm o HH:mm:ss',
  }),
  hora_fin: Joi.string().pattern(horaRegex).required().messages({
    'string.pattern.base': 'hora_fin debe tener formato HH:mm o HH:mm:ss',
  }),
  estado: Joi.string()
    .valid(...ESTADOS_DISPONIBILIDAD)
    .default('disponible'),
});

const actualizarDisponibilidadSchema = Joi.object({
  fecha: Joi.date().iso(),
  hora_inicio: Joi.string().pattern(horaRegex),
  hora_fin: Joi.string().pattern(horaRegex),
  estado: Joi.string().valid(...ESTADOS_DISPONIBILIDAD),
}).min(1);

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const listarDisponibilidadQuerySchema = Joi.object({
  id_usuario: Joi.string().max(15),
  fecha: Joi.date().iso(),
  estado: Joi.string().valid(...ESTADOS_DISPONIBILIDAD),
});

module.exports = {
  ESTADOS_DISPONIBILIDAD,
  crearDisponibilidadSchema,
  actualizarDisponibilidadSchema,
  idParamSchema,
  listarDisponibilidadQuerySchema,
};
