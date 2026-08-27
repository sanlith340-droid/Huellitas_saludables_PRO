/**
 * controllers/usuario.controller.js
 * ---------------------------------------------------------
 * Controlador de usuarios.
 * ---------------------------------------------------------
 */

const usuarioService =
  require('../services/usuario.service');

const asyncHandler =
  require('../utils/asyncHandler');

const {
  ok
} = require('../utils/response');

/*
|--------------------------------------------------------------------------
| BUSCAR USUARIO POR DOCUMENTO / ID
|--------------------------------------------------------------------------
*/

const obtenerPorDocumento =
  asyncHandler(
    async (req, res) => {

      const usuario =
        await usuarioService.obtenerPorDocumento(
          req.params.documento
        );

      return ok(
        res,
        usuario,
        'Usuario encontrado correctamente'
      );
    }
  );

/*
|--------------------------------------------------------------------------
| LISTAR ESPECIALISTAS
|--------------------------------------------------------------------------
*/

const listarEspecialistas =
  asyncHandler(
    async (_req, res) => {

      const especialistas =
        await usuarioService.listarEspecialistas();

      return ok(
        res,
        especialistas,
        'Especialistas listados correctamente'
      );
    }
  );

module.exports = {
  obtenerPorDocumento,
  listarEspecialistas
};

