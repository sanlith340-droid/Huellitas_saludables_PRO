// app/schemas/mascota.schema.js
/**
 * schemas/mascota.schema.js
 * Validaciones de mascotas con Joi.
 */

const Joi = require('joi');

const ESPECIES_PERMITIDAS = ['perro', 'gato'];
const GENEROS_PERMITIDOS = ['macho', 'hembra'];

/**
 * Esquema para crear mascota
 */
const crearMascotaSchema = Joi.object({
  nombre: Joi.string()
    .max(200)
    .required()
    .messages({
      'string.base': 'El nombre debe ser un texto',
      'string.max': 'El nombre no puede exceder 200 caracteres',
      'any.required': 'El nombre es requerido'
    }),
  fecha_nacimiento: Joi.date()
    .iso()
    .required()
    .messages({
      'date.base': 'La fecha de nacimiento debe ser una fecha válida',
      'date.iso': 'La fecha de nacimiento debe estar en formato ISO (YYYY-MM-DD)',
      'any.required': 'La fecha de nacimiento es requerida'
    }),
  especie: Joi.string()
    .valid(...ESPECIES_PERMITIDAS)
    .required()
    .messages({
      'string.base': 'La especie debe ser un texto',
      'any.only': `La especie debe ser: ${ESPECIES_PERMITIDAS.join(', ')}`,
      'any.required': 'La especie es requerida'
    }),
  genero: Joi.string()
    .valid(...GENEROS_PERMITIDOS)
    .required()
    .messages({
      'string.base': 'El género debe ser un texto',
      'any.only': `El género debe ser: ${GENEROS_PERMITIDOS.join(', ')}`,
      'any.required': 'El género es requerido'
    }),
  id_raza: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El id_raza debe ser un número',
      'number.integer': 'El id_raza debe ser un número entero',
      'number.positive': 'El id_raza debe ser un número positivo',
      'any.required': 'El id_raza es requerido'
    })
});

module.exports = {
  crearMascotaSchema,
  ESPECIES_PERMITIDAS,
  GENEROS_PERMITIDOS
};