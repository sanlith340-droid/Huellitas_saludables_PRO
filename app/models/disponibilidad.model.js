/**
 * models/disponibilidad.model.js
 * ---------------------------------------------------------
 * Consultas SQL de disponibilidad.
 *
 * Compatible con database/data_jesus.
 * ---------------------------------------------------------
 */

const {
  query
} = require('../config/database');

/*
|--------------------------------------------------------------------------
| LISTAR DISPONIBILIDAD
|--------------------------------------------------------------------------
*/

async function findAll({
  id_usuario,
  fecha,
  estado
} = {}) {

  const condiciones = [];

  const valores = [];

  if (id_usuario) {

    valores.push(
      id_usuario
    );

    condiciones.push(
      `d.id_usuario = $${valores.length}`
    );
  }

  if (fecha) {

    valores.push(
      fecha
    );

    condiciones.push(
      `d.fecha = $${valores.length}`
    );
  }

  if (estado) {

    valores.push(
      estado
    );

    condiciones.push(
      `d.estado = $${valores.length}`
    );
  }

  const where =
    condiciones.length > 0
      ? `WHERE ${condiciones.join(' AND ')}`
      : '';

  const sql = `
    SELECT

      d.id_disponibilidad,
      d.id_usuario,
      d.fecha,
      d.hora,
      d.estado,

      u.nombre AS especialista_nombre,
      u.apellidos AS especialista_apellidos,
      u.especializacion

    FROM disponibilidad d

    INNER JOIN usuario u
      ON u.id_usuario =
         d.id_usuario

    ${where}

    ORDER BY
      d.fecha ASC,
      d.hora ASC
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
  id_disponibilidad
) {

  const sql = `
    SELECT

      d.id_disponibilidad,
      d.id_usuario,
      d.fecha,
      d.hora,
      d.estado,

      u.nombre AS especialista_nombre,
      u.apellidos AS especialista_apellidos,
      u.especializacion

    FROM disponibilidad d

    INNER JOIN usuario u
      ON u.id_usuario =
         d.id_usuario

    WHERE
      d.id_disponibilidad = $1
  `;

  const {
    rows
  } = await query(
    sql,
    [id_disponibilidad]
  );

  return rows[0] || null;
}

/*
|--------------------------------------------------------------------------
| CREAR
|--------------------------------------------------------------------------
*/

async function create({
  id_usuario,
  fecha,
  hora,
  estado
}) {

  const sql = `
    INSERT INTO disponibilidad (
      id_usuario,
      fecha,
      hora,
      estado
    )

    VALUES (
      $1,
      $2,
      $3,
      COALESCE($4, 'disponible')
    )

    RETURNING
      id_disponibilidad,
      id_usuario,
      fecha,
      hora,
      estado
  `;

  const {
    rows
  } = await query(
    sql,
    [
      id_usuario,
      fecha,
      hora,
      estado || null
    ]
  );

  return rows[0];
}

/*
|--------------------------------------------------------------------------
| ACTUALIZAR
|--------------------------------------------------------------------------
*/

async function update(
  id_disponibilidad,
  cambios
) {

  const campos = [];

  const valores = [];

  const camposPermitidos = [
    'id_usuario',
    'fecha',
    'hora',
    'estado'
  ];

  for (
    const campo
    of camposPermitidos
  ) {

    if (
      cambios[campo] !==
      undefined
    ) {

      valores.push(
        cambios[campo]
      );

      campos.push(
        `${campo} = $${valores.length}`
      );
    }
  }

  if (
    campos.length === 0
  ) {

    return findById(
      id_disponibilidad
    );
  }

  valores.push(
    id_disponibilidad
  );

  const sql = `
    UPDATE disponibilidad

    SET
      ${campos.join(', ')}

    WHERE
      id_disponibilidad = $${valores.length}

    RETURNING
      id_disponibilidad,
      id_usuario,
      fecha,
      hora,
      estado
  `;

  const {
    rows
  } = await query(
    sql,
    valores
  );

  return rows[0] || null;
}

/*
|--------------------------------------------------------------------------
| ELIMINAR
|--------------------------------------------------------------------------
*/

async function remove(
  id_disponibilidad
) {

  const sql = `
    DELETE FROM disponibilidad

    WHERE
      id_disponibilidad = $1

    RETURNING
      id_disponibilidad
  `;

  const {
    rows
  } = await query(
    sql,
    [id_disponibilidad]
  );

  return rows[0] || null;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};

