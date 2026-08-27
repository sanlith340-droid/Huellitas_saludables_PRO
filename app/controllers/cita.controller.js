/**
 * controllers/cita.controller.js
 * ---------------------------------------------------------
 * Controlador de citas.
 * ---------------------------------------------------------
 */

const citaService =
  require('../services/cita.service');

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

      const citas =
        await citaService.listar(
          req.query
        );

      return ok(
        res,
        citas,
        'Citas listadas correctamente'
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

      const cita =
        await citaService.obtenerPorId(
          req.params.id
        );

      return ok(
        res,
        cita,
        'Cita encontrada correctamente'
      );
    }
  );

/*
|--------------------------------------------------------------------------
| CITAS POR ESPECIALISTA
|--------------------------------------------------------------------------
*/

const listarPorEspecialista =
  asyncHandler(
    async (req, res) => {

      const citas =
        await citaService.listarPorEspecialista(
          req.params.id_especialista
        );

      return ok(
        res,
        citas,
        'Citas del especialista listadas correctamente'
      );
    }
  );

/*
|--------------------------------------------------------------------------
| CREAR CITA
|--------------------------------------------------------------------------
*/

const crear =
  asyncHandler(
    async (req, res) => {

      const cita =
        await citaService.crear({
          ...req.body,
          solicitante: req.user
        });

      return created(
        res,
        cita,
        'Cita creada correctamente'
      );
    }
  );

/*
|--------------------------------------------------------------------------
| EDITAR CITA
|--------------------------------------------------------------------------
*/

const editar =
  asyncHandler(
    async (req, res) => {

      const cita =
        await citaService.editar(
          req.params.id,
          req.body,
          req.user
        );

      return ok(
        res,
        cita,
        'Cita editada correctamente'
      );
    }
  );

/*
|--------------------------------------------------------------------------
| CANCELAR CITA
|--------------------------------------------------------------------------
*/

const cancelar =
  asyncHandler(
    async (req, res) => {

      const cita =
        await citaService.cancelar(
          req.params.id,
          req.user
        );

      return ok(
        res,
        cita,
        'Cita cancelada correctamente'
      );
    }
  );

module.exports = {
  listar,
  obtener,
  listarPorEspecialista,
  crear,
  editar,
  cancelar
};

