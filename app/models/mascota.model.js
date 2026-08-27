/**
 * models/mascota.model.js
 * ---------------------------------------------------------
 * Consultas SQL relacionadas con mascotas.
 *
 * Base de datos:
 * - mascota
 * - raza
 * - usuario_mascota
 * - usuario
 * ---------------------------------------------------------
 */

const {
  query
} = require('../config/database');

/*
|--------------------------------------------------------------------------
| LISTAR MASCOTAS + PROPIETARIOS
|--------------------------------------------------------------------------
*/

async function findAll() {

  const sql = `
    SELECT
      m.id_mascota,
      m.nombre AS mascota,
      m.fecha_nacimiento,
      m.especie,
      m.genero,

      r.id_raza,
      r.nombre AS raza,

      u.id_usuario AS propietario_id,
      u.nombre AS propietario_nombre,
      u.apellidos AS propietario_apellidos,
      u.telefono AS propietario_telefono,
      u.correo AS propietario_correo

    FROM mascota m

    INNER JOIN raza r
      ON r.id_raza = m.id_raza

    LEFT JOIN usuario_mascota um
      ON um.id_mascota = m.id_mascota

    LEFT JOIN usuario u
      ON u.id_usuario = um.id_usuario

    ORDER BY m.id_mascota ASC
  `;

  const {
    rows
  } = await query(sql);

  return rows;
}

/*
|--------------------------------------------------------------------------
| BUSCAR MASCOTA POR ID
|--------------------------------------------------------------------------
*/

async function findById(id_mascota) {

  const sql = `
    SELECT
      m.id_mascota,
      m.nombre AS mascota,
      m.fecha_nacimiento,
      m.especie,
      m.genero,

      r.id_raza,
      r.nombre AS raza,

      u.id_usuario AS propietario_id,
      u.nombre AS propietario_nombre,
      u.apellidos AS propietario_apellidos,
      u.telefono AS propietario_telefono,
      u.correo AS propietario_correo

    FROM mascota m

    INNER JOIN raza r
      ON r.id_raza = m.id_raza

    LEFT JOIN usuario_mascota um
      ON um.id_mascota = m.id_mascota

    LEFT JOIN usuario u
      ON u.id_usuario = um.id_usuario

    WHERE m.id_mascota = $1

    ORDER BY u.id_usuario
  `;

  const {
    rows
  } = await query(
    sql,
    [id_mascota]
  );

  if (rows.length === 0) {
    return null;
  }

  return {
    id_mascota: rows[0].id_mascota,
    mascota: rows[0].mascota,
    fecha_nacimiento: rows[0].fecha_nacimiento,
    especie: rows[0].especie,
    genero: rows[0].genero,

    raza: {
      id_raza: rows[0].id_raza,
      nombre: rows[0].raza
    },

    propietarios: rows
      .filter(row => row.propietario_id)
      .map(row => ({
        id_usuario: row.propietario_id,
        nombre: row.propietario_nombre,
        apellidos: row.propietario_apellidos,
        telefono: row.propietario_telefono,
        correo: row.propietario_correo
      }))
  };
}

/*
|--------------------------------------------------------------------------
| VALIDAR PERTENENCIA
|--------------------------------------------------------------------------
*/

async function perteneceAUsuario(
  id_mascota,
  id_usuario
) {

  const sql = `
    SELECT 1
    FROM usuario_mascota
    WHERE id_mascota = $1
      AND id_usuario = $2
  `;

  const {
    rows
  } = await query(
    sql,
    [
      id_mascota,
      id_usuario
    ]
  );

  return rows.length > 0;
}

module.exports = {
  findAll,
  findById,
  perteneceAUsuario
};

