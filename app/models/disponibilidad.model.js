/**
 * models/disponibilidad.model.js
 * ---------------------------------------------------------
 * Acceso a datos (SQL puro, sin ORM) para la tabla "disponibilidad".
 * Cada funcion recibe/devuelve datos planos; toda regla de negocio
 * vive en services/disponibilidad.service.js.
 * ---------------------------------------------------------
 */
const { query } = require('../config/database');

async function findAll({ id_usuario, fecha, estado } = {}) {
  const condiciones = [];
  const valores = [];

  if (id_usuario) {
    valores.push(id_usuario);
    condiciones.push(`d.id_usuario = $${valores.length}`);
  }
  if (fecha) {
    valores.push(fecha);
    condiciones.push(`d.fecha = $${valores.length}`);
  }
  if (estado) {
    valores.push(estado);
    condiciones.push(`d.estado = $${valores.length}`);
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  const sql = `
    SELECT d.id_disponibilidad, d.id_usuario, d.fecha, d.estado,
           d.hora_inicio, d.hora_fin,
           u.nombre AS veterinario_nombre, u.apellido AS veterinario_apellido,
           u.especializacion AS veterinario_especializacion
    FROM disponibilidad d
    JOIN usuario u ON u.id_usuario = d.id_usuario
    ${where}
    ORDER BY d.fecha ASC, d.hora_inicio ASC
  `;
  const { rows } = await query(sql, valores);
  return rows;
}

async function findById(id_disponibilidad) {
  const sql = `
    SELECT d.id_disponibilidad, d.id_usuario, d.fecha, d.estado,
           d.hora_inicio, d.hora_fin
    FROM disponibilidad d
    WHERE d.id_disponibilidad = $1
  `;
  const { rows } = await query(sql, [id_disponibilidad]);
  return rows[0] || null;
}

/**
 * Busca cruces de horario para el mismo veterinario y fecha.
 * Se usa antes de crear/actualizar una franja para evitar solapes.
 */
async function findSolapes({ id_usuario, fecha, hora_inicio, hora_fin, excluirId = null }) {
  const valores = [id_usuario, fecha, hora_inicio, hora_fin];
  let sql = `
    SELECT id_disponibilidad
    FROM disponibilidad
    WHERE id_usuario = $1
      AND fecha = $2
      AND hora_inicio < $4
      AND hora_fin > $3
  `;
  if (excluirId) {
    valores.push(excluirId);
    sql += ` AND id_disponibilidad != $${valores.length}`;
  }
  const { rows } = await query(sql, valores);
  return rows;
}

async function create({ id_usuario, fecha, hora_inicio, hora_fin, estado }) {
  const sql = `
    INSERT INTO disponibilidad (id_usuario, fecha, hora_inicio, hora_fin, estado)
    VALUES ($1, $2, $3, $4, COALESCE($5, 'disponible'))
    RETURNING id_disponibilidad, id_usuario, fecha, estado, hora_inicio, hora_fin
  `;
  const { rows } = await query(sql, [id_usuario, fecha, hora_inicio, hora_fin, estado || null]);
  return rows[0];
}

async function update(id_disponibilidad, cambios) {
  const campos = [];
  const valores = [];

  for (const [campo, valor] of Object.entries(cambios)) {
    valores.push(valor);
    campos.push(`${campo} = $${valores.length}`);
  }
  if (campos.length === 0) return findById(id_disponibilidad);

  valores.push(id_disponibilidad);
  const sql = `
    UPDATE disponibilidad
    SET ${campos.join(', ')}
    WHERE id_disponibilidad = $${valores.length}
    RETURNING id_disponibilidad, id_usuario, fecha, estado, hora_inicio, hora_fin
  `;
  const { rows } = await query(sql, valores);
  return rows[0] || null;
}

async function marcarEstado(id_disponibilidad, estado, clientOverride = null) {
  const runner = clientOverride || { query };
  const sql = `
    UPDATE disponibilidad
    SET estado = $1
    WHERE id_disponibilidad = $2
    RETURNING id_disponibilidad, estado
  `;
  const { rows } = await runner.query(sql, [estado, id_disponibilidad]);
  return rows[0] || null;
}

async function remove(id_disponibilidad) {
  const sql = `DELETE FROM disponibilidad WHERE id_disponibilidad = $1 RETURNING id_disponibilidad`;
  const { rows } = await query(sql, [id_disponibilidad]);
  return rows[0] || null;
}

/**
 * Bloquea la fila para lectura dentro de una transaccion (evita
 * condiciones de carrera al crear una cita: FOR UPDATE).
 */
async function findByIdForUpdate(id_disponibilidad, client) {
  const sql = `
    SELECT id_disponibilidad, id_usuario, fecha, estado, hora_inicio, hora_fin
    FROM disponibilidad
    WHERE id_disponibilidad = $1
    FOR UPDATE
  `;
  const { rows } = await client.query(sql, [id_disponibilidad]);
  return rows[0] || null;
}

module.exports = {
  findAll,
  findById,
  findSolapes,
  create,
  update,
  marcarEstado,
  remove,
  findByIdForUpdate,
};
