/**
 * services/mascota.service.js
 * Lógica de negocio de mascotas.
 */

const mascotaModel = require('../models/mascota.model');
const AppError = require('../utils/AppError');

async function listar() {
  return mascotaModel.findAll();
}

async function obtenerPorId(id_mascota) {
  const mascota = await mascotaModel.findById(id_mascota);
  if (!mascota) {
    throw AppError.notFound(`No existe la mascota con id ${id_mascota}`);
  }
  return mascota;
}

module.exports = {
  listar,
  obtenerPorId
};