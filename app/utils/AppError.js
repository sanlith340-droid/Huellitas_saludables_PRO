/**
 * utils/AppError.js
 * ---------------------------------------------------------
 * Error de aplicacion "controlado". Los services lo lanzan
 * cuando una regla de negocio no se cumple (ej: disponibilidad
 * ya ocupada, mascota inexistente, rol invalido, etc).
 *
 * El errorHandler central lo distingue de errores no esperados
 * (bugs, fallos de conexion) para responder con el codigo HTTP
 * y mensaje correctos, sin exponer detalles internos.
 * ---------------------------------------------------------
 */
class AppError extends Error {
  constructor(message, statusCode = 400, code = 'BAD_REQUEST') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static notFound(message = 'Recurso no encontrado') {
    return new AppError(message, 404, 'NOT_FOUND');
  }

  static badRequest(message = 'Solicitud invalida') {
    return new AppError(message, 400, 'BAD_REQUEST');
  }

  static conflict(message = 'Conflicto con el estado actual del recurso') {
    return new AppError(message, 409, 'CONFLICT');
  }

  static forbidden(message = 'No tiene permisos para realizar esta accion') {
    return new AppError(message, 403, 'FORBIDDEN');
  }

  static unauthorized(message = 'No autenticado') {
    return new AppError(message, 401, 'UNAUTHORIZED');
  }
}

module.exports = AppError;
