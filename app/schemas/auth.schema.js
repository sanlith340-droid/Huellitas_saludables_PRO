// app/schemas/auth.schema.js
/**
 * schemas/auth.schema.js
 * Validaciones de autenticación con Joi.
 */

const Joi = require('joi');

const ROLES_ADMIN = ['admin', 'especialista', 'recepcionista'];
const TIPOS_USUARIO = ['principal', 'acudiente'];

const loginSchema = Joi.object({
  correo: Joi.string().email().required(),
  contrasena: Joi.string().min(4).required()
});

const registroSchema = Joi.object({
  nombre: Joi.string().max(100).required(),
  apellidos: Joi.string().max(150).required(),
  telefono: Joi.string().max(20).required(),
  correo: Joi.string().email().max(150).required(),
  direccion: Joi.string().max(150).required(),
  contrasena: Joi.string().min(4).max(255).required(),
  tipo: Joi.string().valid(...TIPOS_USUARIO).default('principal')
});

const registroAdminSchema = Joi.object({
  nombre: Joi.string().max(100).required(),
  apellidos: Joi.string().max(150).required(),
  telefono: Joi.string().max(20).required(),
  correo: Joi.string().email().max(150).required(),
  direccion: Joi.string().max(150).required(),
  contrasena: Joi.string().min(4).max(255).required(),
  especializacion: Joi.string().max(100).when('rol', {
    is: 'especialista',
    then: Joi.required()
  }),
  tipo: Joi.string().valid(...TIPOS_USUARIO).when('rol', {
    is: 'usuario',
    then: Joi.required()
  }),
  rol: Joi.string().valid(...ROLES_ADMIN).required()
});

module.exports = {
  loginSchema,
  registroSchema,
  registroAdminSchema,
  ROLES_ADMIN,
  TIPOS_USUARIO
};