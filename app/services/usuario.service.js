/**
 * services/usuario.service.js
 * ---------------------------------------------------------
 * Lógica de negocio de usuarios.
 * ---------------------------------------------------------
 */

const usuarioModel =
  require('../models/usuario.model');

const AppError =
  require('../utils/AppError');

/*
|--------------------------------------------------------------------------
| BUSCAR USUARIO
|--------------------------------------------------------------------------
*/

async function obtenerPorDocumento(
  documento
) {

  const usuario =
    await usuarioModel.findById(
      documento
    );

  if (!usuario) {

    throw AppError.notFound(
      `No existe un usuario con ID ${documento}`
    );
  }

  return usuario;
}

/*
|--------------------------------------------------------------------------
| LISTAR ESPECIALISTAS
|--------------------------------------------------------------------------
*/

async function listarEspecialistas() {

  return usuarioModel.findEspecialistas();
}

module.exports = {
  obtenerPorDocumento,
  listarEspecialistas
};

