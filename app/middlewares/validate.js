/**
 * middlewares/validate.js
 * ---------------------------------------------------------
 * Middleware generico de validacion. Recibe un esquema de Joi
 * (definido en /schemas) y la parte del request a validar
 * ('body' | 'params' | 'query'), y corta la ejecucion con 400
 * si la validacion falla, antes de llegar al controller.
 * ---------------------------------------------------------
 */
const AppError = require('../utils/AppError');

function validate(schema, property = 'body') {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const detalles = error.details.map((d) => d.message);
      return next(AppError.badRequest(`Datos invalidos: ${detalles.join(' | ')}`));
    }

    req[property] = value;
    next();
  };
}

module.exports = validate;
