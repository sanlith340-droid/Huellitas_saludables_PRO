/**
 * services/notificacion.service.js
 * ---------------------------------------------------------
 * RF09: "El agendador podra notificar a los veterinarios sobre
 * sus citas, cambios y disponibilidad horaria."
 *
 * Este entregable NO incluye un proveedor real de notificaciones
 * (correo, SMS, push). Se deja esta capa de servicio aislada para
 * que, cuando exista ese proveedor, solo se reemplace la funcion
 * "enviar" sin tocar cita.service.js ni disponibilidad.service.js
 * (que ya llaman a este modulo en los puntos correctos del flujo).
 * ---------------------------------------------------------
 */

async function enviar({ destinatarioId, asunto, mensaje }) {
  // TODO: integrar proveedor real (correo/SMS) cuando exista el modulo.
  console.log('[notificacion]', JSON.stringify({ destinatarioId, asunto, mensaje, fecha: new Date().toISOString() }));
  return true;
}

async function notificarNuevaCita({ veterinarioId, cita }) {
  return enviar({
    destinatarioId: veterinarioId,
    asunto: 'Nueva cita asignada',
    mensaje: `Se te asigno la cita #${cita.id_cita} (mascota #${cita.id_mascota}).`,
  });
}

async function notificarCambioEstadoCita({ veterinarioId, cita }) {
  return enviar({
    destinatarioId: veterinarioId,
    asunto: 'Cambio de estado en una cita',
    mensaje: `La cita #${cita.id_cita} cambio de estado a "${cita.estado}".`,
  });
}

async function notificarCambioDisponibilidad({ veterinarioId, disponibilidad }) {
  return enviar({
    destinatarioId: veterinarioId,
    asunto: 'Cambio en tu disponibilidad',
    mensaje: `Tu franja #${disponibilidad.id_disponibilidad} del ${disponibilidad.fecha} ahora esta en estado "${disponibilidad.estado}".`,
  });
}

module.exports = {
  notificarNuevaCita,
  notificarCambioEstadoCita,
  notificarCambioDisponibilidad,
};
