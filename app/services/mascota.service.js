/**
 * services/mascota.service.js
 * ---------------------------------------------------------
 * Lógica de negocio relacionada con mascotas.
 * ---------------------------------------------------------
 */

const mascotaModel =
  require('../models/mascota.model');

const AppError =
  require('../utils/AppError');

/*
|--------------------------------------------------------------------------
| LISTAR
|--------------------------------------------------------------------------
*/

async function listar() {

  return mascotaModel.findAll();
}

/*
|--------------------------------------------------------------------------
| OBTENER POR ID
|--------------------------------------------------------------------------
*/

async function obtenerPorId(id_mascota) {

  const mascota =
    await mascotaModel.findById(
      id_mascota
    );

  if (!mascota) {

    throw AppError.notFound(
      `No existe la mascota con id ${id_mascota}`
    );
  }

  return mascota;
}

module.exports = {
  listar,
  obtenerPorId
};

