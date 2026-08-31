// app/middlewares/identifyUser.js
/**
 * middlewares/identifyUser.js
 * Autenticación mediante headers (x-user-id, x-user-role).
 */

const { query } = require('../config/database');

// Rutas públicas que no requieren autenticación
const PUBLIC_ROUTES = [
  '/api/auth/login',
  '/api/auth/registro',
  '/health'
];

function isPublicRoute(req) {
  return PUBLIC_ROUTES.some(route => req.originalUrl.startsWith(route));
}

const identifyUser = async (req, res, next) => {
  if (isPublicRoute(req)) {
    return next();
  }

  try {
    const userId = req.get('x-user-id');
    const userRole = req.get('x-user-role');

    if (!userId || !userRole) {
      return res.status(401).json({
        success: false,
        message: 'Faltan los headers x-user-id y x-user-role',
        code: 'UNAUTHORIZED'
      });
    }

    const result = await query(
      `SELECT id_usuario, rol FROM usuario WHERE id_usuario = $1 LIMIT 1`,
      [String(userId).trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'El usuario no existe',
        code: 'UNAUTHORIZED',
        details: { id_usuario: userId }
      });
    }

    const usuario = result.rows[0];
    const rolReal = String(usuario.rol).trim().toLowerCase();
    const rolEnviado = String(userRole).trim().toLowerCase();

    if (rolReal !== rolEnviado) {
      return res.status(403).json({
        success: false,
        message: 'El rol enviado no corresponde al usuario',
        code: 'FORBIDDEN',
        details: {
          id_usuario: usuario.id_usuario,
          rol_enviado: userRole,
          rol_real: usuario.rol
        }
      });
    }

    req.user = {
      id: usuario.id_usuario,
      rol: rolReal
    };

    next();
  } catch (error) {
    console.error('[identifyUser] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al validar el usuario',
      code: 'INTERNAL_SERVER_ERROR',
      details: error.message
    });
  }
};

const requireRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (isPublicRoute(req)) {
      return next();
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
        code: 'UNAUTHORIZED'
      });
    }

    const rolUsuario = String(req.user.rol).trim().toLowerCase();
    const roles = rolesPermitidos.map(r => String(r).trim().toLowerCase());

    if (!roles.includes(rolUsuario)) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para realizar esta acción',
        code: 'FORBIDDEN',
        details: {
          rol_actual: req.user.rol,
          roles_permitidos: rolesPermitidos
        }
      });
    }

    next();
  };
};

module.exports = { identifyUser, requireRole };