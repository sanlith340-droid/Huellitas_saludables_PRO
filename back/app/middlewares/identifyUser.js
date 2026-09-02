// app/middlewares/identifyUser.js
/**
 * middlewares/identifyUser.js
 * Autenticación mediante headers (x-user-id, x-user-role).
 */

const { query } = require('../config/database');

// ============================================================
// RUTAS PÚBLICAS - COINCIDENCIA EXACTA
// ============================================================
const PUBLIC_ROUTES = [
  '/api/auth/login',
  '/api/auth/registro',
  '/health'
];

function isPublicRoute(req) {
  // Comparación EXACTA, no con startsWith
  const path = req.originalUrl.split('?')[0]; // Quita query params
  return PUBLIC_ROUTES.includes(path);
}

const identifyUser = async (req, res, next) => {
  console.log('[identifyUser] ===== NUEVA PETICIÓN =====');
  console.log('[identifyUser] URL:', req.originalUrl);
  console.log('[identifyUser] Método:', req.method);

  if (isPublicRoute(req)) {
    console.log('[identifyUser] ✅ Ruta pública - saltando autenticación');
    return next();
  }

  try {
    // ============================================================
    // LEER HEADERS
    // ============================================================
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];

    console.log('[identifyUser] 📋 Headers recibidos:');
    console.log('[identifyUser]   - x-user-id:', userId);
    console.log('[identifyUser]   - x-user-role:', userRole);
    console.log('[identifyUser]   - Todos los headers:', JSON.stringify(req.headers, null, 2));

    if (!userId || !userRole) {
      console.log('[identifyUser] ❌ FALTAN HEADERS');
      return res.status(401).json({
        success: false,
        message: 'Faltan los headers x-user-id y x-user-role',
        code: 'UNAUTHORIZED'
      });
    }

    // ============================================================
    // BUSCAR USUARIO EN BD
    // ============================================================
    console.log('[identifyUser] 🔍 Buscando usuario en BD:', userId);

    const result = await query(
      `SELECT id_usuario, rol FROM usuario WHERE id_usuario = $1 LIMIT 1`,
      [String(userId).trim()]
    );

    console.log('[identifyUser] 📊 Resultado BD:', result.rows);

    if (result.rows.length === 0) {
      console.log('[identifyUser] ❌ USUARIO NO ENCONTRADO');
      return res.status(401).json({
        success: false,
        message: 'El usuario no existe',
        code: 'UNAUTHORIZED',
        details: { id_usuario: userId }
      });
    }

    // ============================================================
    // VERIFICAR ROL
    // ============================================================
    const usuario = result.rows[0];
    const rolReal = String(usuario.rol).trim().toLowerCase();
    const rolEnviado = String(userRole).trim().toLowerCase();

    console.log('[identifyUser] 🔍 Comparando roles:');
    console.log('[identifyUser]   - Rol en BD:', rolReal);
    console.log('[identifyUser]   - Rol enviado:', rolEnviado);

    if (rolReal !== rolEnviado) {
      console.log('[identifyUser] ❌ ROLES NO COINCIDEN');
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

    // ============================================================
    // AUTENTICACIÓN EXITOSA
    // ============================================================
    req.user = {
      id: usuario.id_usuario,
      rol: rolReal
    };

    console.log('[identifyUser] ✅ AUTENTICACIÓN EXITOSA');
    console.log('[identifyUser] 👤 req.user:', req.user);

    next();
  } catch (error) {
    console.error('[identifyUser] ❌ ERROR:', error);
    console.error('[identifyUser] Stack:', error.stack);
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