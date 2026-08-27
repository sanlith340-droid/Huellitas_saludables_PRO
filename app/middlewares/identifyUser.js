/**
 * middlewares/identifyUser.js
 * ---------------------------------------------------------
 * Autenticación temporal mediante headers.
 *
 * Headers requeridos:
 *   x-user-id
 *   x-user-role
 *
 * La identidad y el rol SIEMPRE se validan contra PostgreSQL.
 * Nunca se confía únicamente en el rol enviado por el cliente.
 * ---------------------------------------------------------
 */

const { query } = require('../config/database');


/**
 * Middleware de identificación del usuario
 */
const identifyUser = async (req, res, next) => {

  try {

    // ======================================================
    // 1. OBTENER HEADERS
    // ======================================================

    const userId = req.get('x-user-id');
    const userRole = req.get('x-user-role');


    // ======================================================
    // 2. VALIDAR HEADERS
    // ======================================================

    if (!userId || !userRole) {

      return res.status(401).json({
        success: false,
        message: 'Faltan los headers x-user-id y x-user-role',
        code: 'UNAUTHORIZED'
      });

    }


    // ======================================================
    // 3. BUSCAR USUARIO REAL EN LA BASE DE DATOS
    // ======================================================

    const result = await query(
      `
      SELECT
        id_usuario,
        rol
      FROM public.usuario
      WHERE id_usuario = $1
      LIMIT 1
      `,
      [String(userId).trim()]
    );


    // ======================================================
    // 4. VALIDAR EXISTENCIA DEL USUARIO
    // ======================================================

    if (result.rows.length === 0) {

      return res.status(401).json({
        success: false,
        message: 'El usuario no existe',
        code: 'UNAUTHORIZED',
        details: {
          id_usuario: userId
        }
      });

    }


    // ======================================================
    // 5. OBTENER DATOS REALES DE LA BD
    // ======================================================

    const usuario = result.rows[0];

    const rolReal = String(usuario.rol || '')
      .trim()
      .toLowerCase();

    const rolEnviado = String(userRole)
      .trim()
      .toLowerCase();


    // ======================================================
    // 6. VALIDAR ROL
    // ======================================================

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


    // ======================================================
    // 7. USUARIO AUTENTICADO
    // ======================================================

    req.user = {
      id: usuario.id_usuario,
      rol: rolReal
    };


    // ======================================================
    // 8. CONTINUAR
    // ======================================================

    next();

  } catch (error) {

    console.error(
      '[identifyUser] Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Error al validar el usuario',
      code: 'INTERNAL_SERVER_ERROR',
      details: error.message
    });

  }

};


/**
 * Middleware para restringir endpoints por rol.
 *
 * Ejemplo:
 *
 * router.get(
 *   '/algo',
 *   requireRole('veterinario'),
 *   controller.algo
 * );
 */
const requireRole = (...rolesPermitidos) => {

  return (req, res, next) => {

    if (!req.user) {

      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
        code: 'UNAUTHORIZED'
      });

    }


    const rolUsuario = String(req.user.rol)
      .trim()
      .toLowerCase();


    const roles = rolesPermitidos.map(
      rol =>
        String(rol)
          .trim()
          .toLowerCase()
    );


    if (!roles.includes(rolUsuario)) {

      return res.status(403).json({
        success: false,
        message: 'El usuario no tiene permisos para realizar esta acción',
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


module.exports = {
  identifyUser,
  requireRole
};