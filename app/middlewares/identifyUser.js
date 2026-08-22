/**
 * middlewares/identifyUser.js
 * ---------------------------------------------------------
 * IMPORTANTE: este middleware es un PLACEHOLDER.
 *
 * El modulo de autenticacion (login + JWT) no forma parte de
 * este entregable (solo Citas + Disponibilidad). Para no bloquear
 * el desarrollo ni el testeo con Postman, el usuario que hace la
 * peticion se identifica temporalmente mediante los headers:
 *
 *   x-user-id   -> usuario.id_usuario (varchar(15))
 *   x-user-role -> usuario.rol  ('usuario' | 'veterinario' | 'recepcionista' | 'admin')
 *
 * Cuando se integre el modulo de autenticacion con JWT, este
 * middleware debe reemplazarse por uno que decodifique el token
 * y llene req.user de la misma forma (id, rol), sin tocar el
 * resto de los controllers/services.
 * ---------------------------------------------------------
 */
const AppError = require('../utils/AppError');

function identifyUser(req, _res, next) {
  const id = req.header('x-user-id');
  const rol = req.header('x-user-role');

  if (!id || !rol) {
    return next(
      AppError.unauthorized(
        'Faltan headers x-user-id / x-user-role (autenticacion temporal mientras se integra JWT)'
      )
    );
  }

  req.user = { id, rol };
  next();
}

/**
 * Middleware de autorizacion por rol.
 * Uso: requireRole('recepcionista', 'admin')
 */
function requireRole(...rolesPermitidos) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized('No autenticado'));
    }
    if (!rolesPermitidos.includes(req.user.rol)) {
      return next(
        AppError.forbidden(
          `El rol '${req.user.rol}' no tiene permiso para esta accion. Roles permitidos: ${rolesPermitidos.join(', ')}`
        )
      );
    }
    next();
  };
}

module.exports = { identifyUser, requireRole };
