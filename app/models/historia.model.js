// app/models/historia.model.js
/**
 * models/historia.model.js
 * Consultas SQL para historia clínica.
 */

const { query, getClient } = require('../config/database');

const SELECT_BASE = `
  SELECT
    hc.id_historia_clinica,
    hc.id_cita,
    hc.peso,
    hc.diagnostico,
    hc.tratamiento,
    hc.observaciones,
    hc.fecha_registro,
    c.id_mascota,
    m.nombre AS mascota_nombre,
    m.especie AS mascota_especie,
    m.genero AS mascota_genero,
    c.motivo AS cita_motivo,
    c.estado AS cita_estado,
    d.fecha AS fecha_cita,
    d.hora AS hora_cita,
    e.id_usuario AS especialista_id,
    e.nombre AS especialista_nombre,
    e.apellidos AS especialista_apellidos,
    e.especializacion
  FROM historia_clinica hc
  INNER JOIN cita c ON hc.id_cita = c.id_cita
  INNER JOIN mascota m ON c.id_mascota = m.id_mascota
  INNER JOIN disponibilidad d ON c.id_disponibilidad = d.id_disponibilidad
  INNER JOIN usuario e ON d.id_usuario = e.id_usuario
`;

/**
 * Listar todas las historias clínicas con filtros
 */
async function findAll({ id_mascota, id_especialista, fecha_inicio, fecha_fin } = {}) {
  const condiciones = [];
  const valores = [];

  if (id_mascota) {
    valores.push(id_mascota);
    condiciones.push(`c.id_mascota = $${valores.length}`);
  }

  if (id_especialista) {
    valores.push(id_especialista);
    condiciones.push(`d.id_usuario = $${valores.length}`);
  }

  if (fecha_inicio) {
    valores.push(fecha_inicio);
    condiciones.push(`hc.fecha_registro >= $${valores.length}`);
  }

  if (fecha_fin) {
    valores.push(fecha_fin);
    condiciones.push(`hc.fecha_registro <= $${valores.length}`);
  }

  const where = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';
  const sql = `${SELECT_BASE} ${where} ORDER BY hc.fecha_registro DESC`;

  const { rows } = await query(sql, valores);
  return rows;
}

/**
 * Buscar historia clínica por ID
 */
async function findById(id_historia_clinica) {
  const sql = `${SELECT_BASE} WHERE hc.id_historia_clinica = $1`;
  const { rows } = await query(sql, [id_historia_clinica]);
  return rows[0] || null;
}

/**
 * Buscar historia clínica por ID de cita (único)
 */
async function findByCitaId(id_cita) {
  const sql = `${SELECT_BASE} WHERE hc.id_cita = $1`;
  const { rows } = await query(sql, [id_cita]);
  return rows[0] || null;
}

/**
 * Buscar historias por mascota
 */
async function findByMascota(id_mascota) {
  return findAll({ id_mascota });
}

/**
 * Crear historia clínica (con transacción)
 */
async function crearConTransaccion({ id_cita, peso, diagnostico, tratamiento, observaciones, especialistaId }) {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    // 1. Verificar que la cita existe y está atendida o pendiente
    const { rows: citaRows } = await client.query(
      `SELECT 
        c.id_cita, 
        c.estado,
        d.id_usuario AS especialista_id
       FROM cita c
       INNER JOIN disponibilidad d ON c.id_disponibilidad = d.id_disponibilidad
       WHERE c.id_cita = $1
       FOR UPDATE`,
      [id_cita]
    );

    if (citaRows.length === 0) {
      const error = new Error('CITA_NO_EXISTE');
      error.code = 'CITA_NO_EXISTE';
      throw error;
    }

    const cita = citaRows[0];

    // 2. Verificar que el especialista es el asignado a la cita
    if (cita.especialista_id !== especialistaId) {
      const error = new Error('ESPECIALISTA_NO_ASIGNADO');
      error.code = 'ESPECIALISTA_NO_ASIGNADO';
      throw error;
    }

    // 3. Verificar que la cita no tenga ya historia clínica
    const { rows: hcExistente } = await client.query(
      `SELECT id_historia_clinica FROM historia_clinica WHERE id_cita = $1`,
      [id_cita]
    );

    if (hcExistente.length > 0) {
      const error = new Error('HISTORIA_YA_EXISTE');
      error.code = 'HISTORIA_YA_EXISTE';
      throw error;
    }

    // 4. Insertar historia clínica
    const { rows } = await client.query(
      `INSERT INTO historia_clinica (
        id_cita,
        peso,
        diagnostico,
        tratamiento,
        observaciones
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id_historia_clinica`,
      [id_cita, peso || null, diagnostico, tratamiento, observaciones || null]
    );

    const idHistoria = rows[0].id_historia_clinica;

    // 5. Actualizar estado de la cita a 'atendido'
    await client.query(
      `UPDATE cita SET estado = 'atendido' WHERE id_cita = $1`,
      [id_cita]
    );

    await client.query('COMMIT');

    // 6. Retornar la historia creada
    return findById(idHistoria);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Actualizar historia clínica
 */
async function actualizar(id_historia_clinica, cambios, especialistaId) {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    // 1. Verificar que la historia existe y el especialista es el dueño
    const { rows: hcRows } = await client.query(
      `SELECT 
        hc.id_historia_clinica,
        hc.id_cita,
        d.id_usuario AS especialista_id
       FROM historia_clinica hc
       INNER JOIN cita c ON hc.id_cita = c.id_cita
       INNER JOIN disponibilidad d ON c.id_disponibilidad = d.id_disponibilidad
       WHERE hc.id_historia_clinica = $1
       FOR UPDATE`,
      [id_historia_clinica]
    );

    if (hcRows.length === 0) {
      const error = new Error('HISTORIA_NO_EXISTE');
      error.code = 'HISTORIA_NO_EXISTE';
      throw error;
    }

    const historia = hcRows[0];

    // 2. Verificar que el especialista es el dueño
    if (historia.especialista_id !== especialistaId) {
      const error = new Error('ESPECIALISTA_NO_AUTORIZADO');
      error.code = 'ESPECIALISTA_NO_AUTORIZADO';
      throw error;
    }

    // 3. Construir UPDATE dinámico
    const campos = [];
    const valores = [];
    const camposPermitidos = ['peso', 'diagnostico', 'tratamiento', 'observaciones'];

    for (const campo of camposPermitidos) {
      if (cambios[campo] !== undefined) {
        valores.push(cambios[campo]);
        campos.push(`${campo} = $${valores.length}`);
      }
    }

    if (campos.length === 0) {
      await client.query('COMMIT');
      return findById(id_historia_clinica);
    }

    valores.push(id_historia_clinica);

    const sql = `
      UPDATE historia_clinica
      SET ${campos.join(', ')}
      WHERE id_historia_clinica = $${valores.length}
      RETURNING id_historia_clinica
    `;

    await client.query(sql, valores);

    await client.query('COMMIT');

    return findById(id_historia_clinica);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  findAll,
  findById,
  findByCitaId,
  findByMascota,
  crearConTransaccion,
  actualizar
};