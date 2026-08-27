/**
 * controllers/disponibilidad.controller.js
 * ---------------------------------------------------------
 */

const disponibilidadService =
  require('../services/disponibilidad.service');

const asyncHandler =
  require('../utils/asyncHandler');

const {
  ok,
  created
} = require('../utils/response');

/*
|--------------------------------------------------------------------------
| LISTAR
|--------------------------------------------------------------------------
*/

const listar =
  asyncHandler(
    async (req, res) => {

      const datos =
        await disponibilidadService.listar(
          req.query
        );

      return ok(
        res,
        datos,
        'Disponibilidades listadas correctamente'
      );
    }
  );

/*
|--------------------------------------------------------------------------
| OBTENER
|--------------------------------------------------------------------------
*/

const obtener =
  asyncHandler(
    async (req, res) => {

      const dato =
        await disponibilidadService.obtenerPorId(
          req.params.id
        );

      return ok(
        res,
        dato,
        'Disponibilidad encontrada correctamente'
      );
    }
  );

/*
|--------------------------------------------------------------------------
| CREAR
|--------------------------------------------------------------------------
*/

const crear =
  asyncHandler(
    async (req, res) => {

      const dato =
        await disponibilidadService.crear(
          req.body
        );

      return created(
        res,
        dato,
        'Disponibilidad creada correctamente'
      );
    }
  );

/*
|--------------------------------------------------------------------------
| ACTUALIZAR
|--------------------------------------------------------------------------
*/

const actualizar =
  asyncHandler(
    async (req, res) => {

      const dato =
        await disponibilidadService.actualizar(
          req.params.id,
          req.body
        );

      return ok(
        res,
        dato,
        'Disponibilidad actualizada correctamente'
      );
    }
  );

/*
|--------------------------------------------------------------------------
| ELIMINAR
|--------------------------------------------------------------------------
*/

const eliminar =
  asyncHandler(
    async (req, res) => {

      await disponibilidadService.eliminar(
        req.params.id
      );

      return ok(
        res,
        null,
        'Disponibilidad eliminada correctamente'
      );
    }
  );

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar
};

