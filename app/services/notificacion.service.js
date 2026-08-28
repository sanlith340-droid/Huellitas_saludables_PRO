/**
 * services/notificacion.service.js
 * ---------------------------------------------------------
 * RF09: "El agendador podra notificar a los veterinarios sobre
 * sus citas, cambios y disponibilidad horaria."
 * ---------------------------------------------------------
 */

async function enviar({ destinatarioId, asunto, mensaje }) {
  // TODO: integrar proveedor real (correo/SMS) cuando exista el modulo.
  console.log('[notificacion]', JSON.stringify({
    destinatarioId,
    asunto,
    mensaje,
    fecha: new Date().toISOString()
  }));
  return true;
}

async function notificarNuevaCita({ veterinarioId, cita }) {
  return enviar({
    destinatarioId: veterinarioId,
    asunto: 'Nueva cita asignada',
    mensaje: `Se te ha asignado la cita #${cita.id_cita} para la mascota "${cita.mascota_nombre}" el ${cita.fecha_cita} a las ${cita.hora_cita}. Motivo: ${cita.motivo}`
  });
}

async function notificarCambioEstadoCita({ veterinarioId, cita }) {
  return enviar({
    destinatarioId: veterinarioId,
    asunto: 'Cambio de estado en una cita',
    mensaje: `La cita #${cita.id_cita} ha cambiado su estado a "${cita.estado}".`
  });
}

async function notificarCambioDisponibilidad({ veterinarioId, disponibilidad }) {
  return enviar({
    destinatarioId: veterinarioId,
    asunto: 'Cambio en tu disponibilidad',
    mensaje: `Tu franja #${disponibilidad.id_disponibilidad} del ${disponibilidad.fecha} a las ${disponibilidad.hora} ahora está en estado "${disponibilidad.estado}".`
  });
}

module.exports = {
  notificarNuevaCita,
  notificarCambioEstadoCita,
  notificarCambioDisponibilidad,
};