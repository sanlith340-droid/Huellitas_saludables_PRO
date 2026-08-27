/**
 * models/cita.model.js
 * ---------------------------------------------------------
 * Consultas SQL para la tabla cita.
 *
 * Compatible con:
 * database/data_jesus/1.CREAR_TABLAS.sql
 * ---------------------------------------------------------
 */

const {
  query,
  getClient
} = require('../config/database');

/*
|--------------------------------------------------------------------------
| CONSULTA BASE
|--------------------------------------------------------------------------
*/

const SELECT_BASE = `
  SELECT

    c.id_cita,

    c.id_recepcionista,

    c.id_mascota,

    c.id_disponibilidad,

    c.motivo,

    c.estado,

    m.nombre AS mascota_nombre,
    m.especie AS mascota_especie,
    m.genero AS mascota_genero,

    d.fecha AS fecha_cita,
    d.hora AS hora_cita,
    d.estado AS disponibilidad_estado,

    d.id_usuario AS id_especialista,

    e.nombre AS especialista_nombre,
    e.apellidos AS especialista_apellidos,
    e.especializacion,

    r.nombre AS recepcionista_nombre,
    r.apellidos AS recepcionista_apellidos

  FROM cita c

  INNER JOIN mascota m
    ON m.id_mascota = c.id_mascota

  INNER JOIN disponibilidad d
    ON d.id_disponibilidad =
       c.id_disponibilidad

  INNER JOIN usuario e
    ON e.id_usuario =
       d.id_usuario

  INNER JOIN usuario r
    ON r.id_usuario =
       c.id_recepcionista
`;

/*
|--------------------------------------------------------------------------
| LISTAR
|--------------------------------------------------------------------------
*/

async function findAll({
  id_mascota,
  estado,
  fecha,
  id_especialista
} = {}) {

  const condiciones = [];

  const valores = [];

  if (id_mascota) {

    valores.push(id_mascota);

    condiciones.push(
      `c.id_mascota = $${valores.length}`
    );
  }

  if (estado) {

    valores.push(estado);

    condiciones.push(
      `c.estado = $${valores.length}`
    );
  }

  if (fecha) {

    valores.push(fecha);

    condiciones.push(
      `d.fecha = $${valores.length}`
    );
  }

  if (id_especialista) {

    valores.push(id_especialista);

    condiciones.push(
      `d.id_usuario = $${valores.length}`
    );
  }

  const where =
    condiciones.length > 0
      ? `WHERE ${condiciones.join(' AND ')}`
      : '';

  const sql = `
    ${SELECT_BASE}

    ${where}

    ORDER BY
      d.fecha DESC,
      d.hora DESC
  `;

  const {
    rows
  } = await query(
    sql,
    valores
  );

  return rows;
}

/*
|--------------------------------------------------------------------------
| BUSCAR POR ID
|--------------------------------------------------------------------------
*/

async function findById(
  id_cita
) {

  const sql = `
    ${SELECT_BASE}

    WHERE c.id_cita = $1
  `;

  const {
    rows
  } = await query(
    sql,
    [id_cita]
  );

  return rows[0] || null;
}

/*
|--------------------------------------------------------------------------
| CITAS POR ESPECIALISTA
|--------------------------------------------------------------------------
*/

async function findByEspecialista(
  id_especialista
) {

  return findAll({
    id_especialista
  });
}

/*
|--------------------------------------------------------------------------
| OBTENER RECEPCIONISTA
|--------------------------------------------------------------------------
*/

async function obtenerPrimerRecepcionista() {

  const sql = `
    SELECT id_usuario
    FROM usuario
    WHERE rol = 'recepcionista'
    ORDER BY id_usuario
    LIMIT 1
  `;

  const {
    rows
  } = await query(sql);

  return rows[0]
    ? rows[0].id_usuario
    : null;
}

/*
|--------------------------------------------------------------------------
| CREAR CITA + OCUPAR DISPONIBILIDAD
|--------------------------------------------------------------------------
*/

async function crearConTransaccion({
  id_mascota,
  id_disponibilidad,
  id_recepcionista,
  motivo
}) {

  const client =
    await getClient();

  try {

    await client.query(
      'BEGIN'
    );

    /*
    | Bloquear disponibilidad.
    */

    const {
      rows: disponibilidadRows
    } = await client.query(
      `
        SELECT
          id_disponibilidad,
          id_usuario,
          fecha,
          hora,
          estado
        FROM disponibilidad
        WHERE id_disponibilidad = $1
        FOR UPDATE
      `,
      [id_disponibilidad]
    );

    const disponibilidad =
      disponibilidadRows[0];

    if (!disponibilidad) {

      const error =
        new Error(
          'La disponibilidad no existe'
        );

      error.code =
        'DISPONIBILIDAD_NO_EXISTE';

      throw error;
    }

    if (
      disponibilidad.estado !==
      'disponible'
    ) {

      const error =
        new Error(
          'La disponibilidad no está libre'
        );

      error.code =
        'DISPONIBILIDAD_NO_LIBRE';

      throw error;
    }

    /*
    | Insertar cita.
    */

    const {
      rows
    } = await client.query(
      `
        INSERT INTO cita (
          id_recepcionista,
          id_mascota,
          id_disponibilidad,
          motivo,
          estado
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          'pendiente'
        )

        RETURNING
          id_cita,
          id_recepcionista,
          id_mascota,
          id_disponibilidad,
          motivo,
          estado
      `,
      [
        id_recepcionista,
        id_mascota,
        id_disponibilidad,
        motivo
      ]
    );

    const cita =
      rows[0];

    /*
    | Marcar disponibilidad como ocupada.
    */

    await client.query(
      `
        UPDATE disponibilidad
        SET estado = 'ocupado'
        WHERE id_disponibilidad = $1
      `,
      [id_disponibilidad]
    );

    await client.query(
      'COMMIT'
    );

    /*
    | Devolver cita completa.
    */

    return findById(
      cita.id_cita
    );

  } catch (error) {

    await client.query(
      'ROLLBACK'
    );

    throw error;

  } finally {

    client.release();
  }
}

/*
|--------------------------------------------------------------------------
| EDITAR CITA
|--------------------------------------------------------------------------
*/

async function editarConTransaccion(
  id_cita,
  cambios
) {

  const client =
    await getClient();

  try {

    await client.query(
      'BEGIN'
    );

    /*
    | Bloquear cita.
    */

    const {
      rows: citaRows
    } = await client.query(
      `
        SELECT
          id_cita,
          id_mascota,
          id_disponibilidad,
          estado
        FROM cita
        WHERE id_cita = $1
        FOR UPDATE
      `,
      [id_cita]
    );

    const cita =
      citaRows[0];

    if (!cita) {

      const error =
        new Error(
          'CITA_NO_EXISTE'
        );

      error.code =
        'CITA_NO_EXISTE';

      throw error;
    }

    /*
    | Si cambia disponibilidad:
    | liberar la anterior y ocupar la nueva.
    */

    if (
      cambios.id_disponibilidad &&
      cambios.id_disponibilidad !==
        cita.id_disponibilidad
    ) {

      const {
        rows: nuevaRows
      } = await client.query(
        `
          SELECT
            id_disponibilidad,
            estado
          FROM disponibilidad
          WHERE id_disponibilidad = $1
          FOR UPDATE
        `,
        [
          cambios.id_disponibilidad
        ]
      );

      const nueva =
        nuevaRows[0];

      if (!nueva) {

        const error =
          new Error(
            'NUEVA_DISPONIBILIDAD_NO_EXISTE'
          );

        error.code =
          'NUEVA_DISPONIBILIDAD_NO_EXISTE';

        throw error;
      }

      if (
        nueva.estado !==
        'disponible'
      ) {

        const error =
          new Error(
            'NUEVA_DISPONIBILIDAD_NO_LIBRE'
          );

        error.code =
          'NUEVA_DISPONIBILIDAD_NO_LIBRE';

        throw error;
      }

      /*
      | Liberar anterior.
      */

      await client.query(
        `
          UPDATE disponibilidad
          SET estado = 'disponible'
          WHERE id_disponibilidad = $1
        `,
        [
          cita.id_disponibilidad
        ]
      );

      /*
      | Ocupar nueva.
      */

      await client.query(
        `
          UPDATE disponibilidad
          SET estado = 'ocupado'
          WHERE id_disponibilidad = $1
        `,
        [
          cambios.id_disponibilidad
        ]
      );
    }

    /*
    | Campos permitidos.
    */

    const campos = [];

    const valores = [];

    if (
      cambios.id_mascota !==
      undefined
    ) {

      valores.push(
        cambios.id_mascota
      );

      campos.push(
        `id_mascota = $${valores.length}`
      );
    }

    if (
      cambios.id_disponibilidad !==
      undefined
    ) {

      valores.push(
        cambios.id_disponibilidad
      );

      campos.push(
        `id_disponibilidad = $${valores.length}`
      );
    }

    if (
      cambios.motivo !==
      undefined
    ) {

      valores.push(
        cambios.motivo
      );

      campos.push(
        `motivo = $${valores.length}`
      );
    }

    if (campos.length > 0) {

      valores.push(
        id_cita
      );

      await client.query(
        `
          UPDATE cita
          SET ${campos.join(', ')}
          WHERE id_cita = $${valores.length}
        `,
        valores
      );
    }

    await client.query(
      'COMMIT'
    );

    return findById(
      id_cita
    );

  } catch (error) {

    await client.query(
      'ROLLBACK'
    );

    throw error;

  } finally {

    client.release();
  }
}

/*
|--------------------------------------------------------------------------
| CANCELAR CITA
|--------------------------------------------------------------------------
*/

async function cancelarConTransaccion(
  id_cita
) {

  const client =
    await getClient();

  try {

    await client.query(
      'BEGIN'
    );

    /*
    | Buscar y bloquear cita.
    */

    const {
      rows
    } = await client.query(
      `
        SELECT
          id_cita,
          id_disponibilidad,
          estado
        FROM cita
        WHERE id_cita = $1
        FOR UPDATE
      `,
      [id_cita]
    );

    const cita =
      rows[0];

    if (!cita) {

      const error =
        new Error(
          'CITA_NO_EXISTE'
        );

      error.code =
        'CITA_NO_EXISTE';

      throw error;
    }

    /*
    | Cambiar estado.
    */

    await client.query(
      `
        UPDATE cita
        SET estado = 'cancelado'
        WHERE id_cita = $1
      `,
      [id_cita]
    );

    /*
    | Liberar disponibilidad.
    */

    await client.query(
      `
        UPDATE disponibilidad
        SET estado = 'disponible'
        WHERE id_disponibilidad = $1
      `,
      [
        cita.id_disponibilidad
      ]
    );

    await client.query(
      'COMMIT'
    );

    return findById(
      id_cita
    );

  } catch (error) {

    await client.query(
      'ROLLBACK'
    );

    throw error;

  } finally {

    client.release();
  }
}

module.exports = {
  findAll,
  findById,
  findByEspecialista,
  obtenerPrimerRecepcionista,
  crearConTransaccion,
  editarConTransaccion,
  cancelarConTransaccion
};

