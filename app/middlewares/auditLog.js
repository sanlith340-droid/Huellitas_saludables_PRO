/**
 * middlewares/auditLog.js
 * ---------------------------------------------------------
 * RF15: "El sistema registrara acciones realizadas por
 * administradores y agendadores para control y auditoria."
 *
 * NOTA: el modelo entidad-relacion actual (huellitas_saludables_backup.sql)
 * todavia NO incluye una tabla de auditoria. Para no modificar el
 * esquema de base de datos sin autorizacion del equipo, este
 * middleware deja el registro en consola/log con formato
 * estructurado, listo para conectarse a una tabla "auditoria"
 * el dia que se agregue (bastaria con reemplazar el console.log
 * por un INSERT usando app/config/database.js).
 *
 * Se activa solo para roles con permisos administrativos, sobre
 * operaciones que modifican datos (POST, PUT, PATCH, DELETE).
 * ---------------------------------------------------------
 */

const ROLES_AUDITADOS = ['recepcionista', 'admin'];
const METODOS_AUDITADOS = ['POST', 'PUT', 'PATCH', 'DELETE'];

function auditLog(req, res, next) {
  if (!METODOS_AUDITADOS.includes(req.method)) return next();

  res.on('finish', () => {
    const rol = req.user?.rol;
    if (!ROLES_AUDITADOS.includes(rol)) return;

    const registro = {
      fecha: new Date().toISOString(),
      usuario: req.user?.id || 'desconocido',
      rol,
      accion: `${req.method} ${req.originalUrl}`,
      resultado: res.statusCode,
    };

    // TODO: reemplazar por INSERT en tabla "auditoria" cuando exista en el modelo.
    console.log('[auditoria]', JSON.stringify(registro));
  });

  next();
}

module.exports = auditLog;
