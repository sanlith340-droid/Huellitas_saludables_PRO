/**
 * middlewares/errorHandler.js
 * ---------------------------------------------------------
 * Middleware central de manejo de errores (respuestas unificadas).
 * Debe registrarse SIEMPRE al final de app.js, despues de las rutas.
 * ---------------------------------------------------------
 */
const AppError = require('../utils/AppError');
const { fail } = require('../utils/response');

// Codigos de error comunes de PostgreSQL -> mensaje amigable
const PG_ERROR_MESSAGES = {
  '23505': 'El registro ya existe (violacion de restriccion unica).',
  '23503': 'Referencia invalida: el registro relacionado no existe (llave foranea).',
  '23514': 'El valor no cumple una restriccion de la base de datos (CHECK).',
  '22P02': 'Formato de dato invalido enviado a la base de datos.',
};

function notFoundHandler(req, _res, next) {
  next(AppError.notFound(`Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  if (err instanceof AppError) {
    return fail(res, err.message, err.statusCode, err.code);
  }

  // Errores nativos del driver "pg" (violaciones de constraint, etc.)
  if (err.code && PG_ERROR_MESSAGES[err.code]) {
    return fail(res, PG_ERROR_MESSAGES[err.code], 409, `PG_${err.code}`, {
      detail: err.detail,
    });
  }

  console.error('[error] No controlado:', err);
  return fail(res, 'Error interno del servidor', 500, 'INTERNAL_ERROR');
}

module.exports = { notFoundHandler, errorHandler };
