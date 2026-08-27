/**
 * controllers/mascota.controller.js
 * ---------------------------------------------------------
 * Controlador de mascotas.
 * ---------------------------------------------------------
 */

const mascotaService = require('../services/mascota.service');

const asyncHandler = require('../utils/asyncHandler');

const {
  ok
} = require('../utils/response');

/*
|--------------------------------------------------------------------------
| LISTAR MASCOTAS Y PROPIETARIOS
|--------------------------------------------------------------------------
*/

const listar = asyncHandler(
  async (req, res) => {

    const mascotas =
      await mascotaService.listar();

    return ok(
      res,
      mascotas,
      'Mascotas y propietarios listados correctamente'
    );
  }
);

/*
|--------------------------------------------------------------------------
| BUSCAR MASCOTA POR ID
|--------------------------------------------------------------------------
*/

const obtener = asyncHandler(
  async (req, res) => {

    const mascota =
      await mascotaService.obtenerPorId(
        req.params.id
      );

    return ok(
      res,
      mascota,
      'Mascota encontrada correctamente'
    );
  }
);

module.exports = {
  listar,
  obtener
};

