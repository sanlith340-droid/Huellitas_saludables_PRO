/**
 * models/cita.model.js
 * ---------------------------------------------------------
 * Acceso a datos (SQL puro, sin ORM) para la tabla "cita".
 * La creacion de una cita involucra una TRANSACCION porque
 * tambien debe actualizar el estado de la franja de
 * "disponibilidad" asociada (ver services/cita.service.js).
 * ---------------------------------------------------------
 */
const { query, getClient } = require('../config/database');
const disponibilidadModel = require('./disponibilidad.model');

const SELECT_BASE = `
  SELECT
    c.id_cita, c.id_mascota, c.id_disponibilidad, c.id_recepcionista,
    c.motivos, c.estado, c.fecha_registro,
    m.nombre AS mascota_nombre, m.especie AS mascota_especie,
    d.fecha AS fecha_cita, d.hora_inicio, d.hora_fin, d.id_usuario AS id_veterinario,
    v.nombre AS veterinario_nombre, v.apellido AS veterinario_apellido,
    r.nombre AS recepcionista_nombre, r.apellido AS recepcionista_apellido
  FROM cita c
  JOIN mascota m ON m.id_mascota = c.id_mascota
  JOIN disponibilidad d ON d.id_disponibilidad = c.id_disponibilidad
  JOIN usuario v ON v.id_usuario = d.id_usuario
  JOIN usuario r ON r.id_usuario = c.id_recepcionista
`;

async function findAll({ id_mascota, estado, fecha, id_veterinario } = {}) {
  const condiciones = [];
  const valores = [];

  if (id_mascota) {
    valores.push(id_mascota);
    condiciones.push(`c.id_mascota = $${valores.length}`);
  }
  if (estado) {
    valores.push(estado);
    condiciones.push(`c.estado = $${valores.length}`);
  }
  if (fecha) {
    valores.push(fecha);
    condiciones.push(`d.fecha = $${valores.length}`);
  }
  if (id_veterinario) {
    valores.push(id_veterinario);
    condiciones.push(`d.id_usuario = $${valores.length}`);
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
  const sql = `${SELECT_BASE} ${where} ORDER BY d.fecha DESC, d.hora_inicio DESC`;
  const { rows } = await query(sql, valores);
  return rows;
}

async function findById(id_cita) {
  const sql = `${SELECT_BASE} WHERE c.id_cita = $1`;
  const { rows } = await query(sql, [id_cita]);
  return rows[0] || null;
}

/**
 * RF10: el veterinario consulta las citas que tiene asignadas.
 */
async function findByVeterinario(id_veterinario) {
  return findAll({ id_veterinario });
}

/**
 * RF07: crea una cita y ocupa la disponibilidad elegida, todo
 * dentro de una misma transaccion para evitar que dos duenos
 * reserven la misma franja horaria (race condition).
 */
async function createConTransaccion({ id_mascota, id_disponibilidad, id_recepcionista, motivos }) {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Bloquea la fila de disponibilidad hasta que termine la transaccion
    const disponibilidad = await disponibilidadModel.findByIdForUpdate(id_disponibilidad, client);

    if (!disponibilidad) {
      const err = new Error('DISPONIBILIDAD_NO_EXISTE');
      err.code = 'DISPONIBILIDAD_NO_EXISTE';
      throw err;
    }
    if (disponibilidad.estado !== 'disponible') {
      const err = new Error('DISPONIBILIDAD_NO_LIBRE');
      err.code = 'DISPONIBILIDAD_NO_LIBRE';
      throw err;
    }

    const insertSql = `
      INSERT INTO cita (id_mascota, id_disponibilidad, id_recepcionista, motivos)
      VALUES ($1, $2, $3, $4)
      RETURNING id_cita, id_mascota, id_disponibilidad, id_recepcionista, motivos, estado, fecha_registro
    `;
    const { rows } = await client.query(insertSql, [
      id_mascota,
      id_disponibilidad,
      id_recepcionista,
      motivos || null,
    ]);
    const cita = rows[0];

    await client.query(`UPDATE disponibilidad SET estado = 'ocupado' WHERE id_disponibilidad = $1`, [
      id_disponibilidad,
    ]);

    await client.query('COMMIT');
    return { cita, veterinarioId: disponibilidad.id_usuario };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function actualizarEstado(id_cita, estado) {
  const sql = `
    UPDATE cita SET estado = $1
    WHERE id_cita = $2
    RETURNING id_cita, id_mascota, id_disponibilidad, id_recepcionista, motivos, estado, fecha_registro
  `;
  const { rows } = await query(sql, [estado, id_cita]);
  return rows[0] || null;
}

/**
 * Cancela una cita y libera la disponibilidad asociada,
 * dentro de una transaccion.
 */
async function cancelarConTransaccion(id_cita) {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    const { rows: citaRows } = await client.query(
      `SELECT id_cita, id_disponibilidad, estado FROM cita WHERE id_cita = $1 FOR UPDATE`,
      [id_cita]
    );
    const cita = citaRows[0];
    if (!cita) {
      const err = new Error('CITA_NO_EXISTE');
      err.code = 'CITA_NO_EXISTE';
      throw err;
    }

    const { rows: updRows } = await client.query(
      `UPDATE cita SET estado = 'cdo' WHERE id_cita = $1 RETURNING id_cita, estado`,
      [id_cita]
    );

    await client.query(`UPDATE disponibilidad SET estado = 'disponible' WHERE id_disponibilidad = $1`, [
      cita.id_disponibilidad,
    ]);

    await client.query('COMMIT');
    return updRows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  findAll,
  findById,
  findByVeterinario,
  createConTransaccion,
  actualizarEstado,
  cancelarConTransaccion,
};
