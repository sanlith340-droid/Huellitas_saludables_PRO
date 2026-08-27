/**
 * services/cita.service.js
 * ---------------------------------------------------------
 * Lógica de negocio de citas.
 * ---------------------------------------------------------
 */

const citaModel =
  require('../models/cita.model');

const mascotaModel =
  require('../models/mascota.model');

const disponibilidadModel =
  require('../models/disponibilidad.model');

const usuarioModel =
  require('../models/usuario.model');

const AppError =
  require('../utils/AppError');


/*
|--------------------------------------------------------------------------
| LISTAR CITAS
|--------------------------------------------------------------------------
*/

async function listar(filtros) {

  return citaModel.findAll(
    filtros
  );
}


/*
|--------------------------------------------------------------------------
| OBTENER CITA
|--------------------------------------------------------------------------
*/

async function obtenerPorId(id_cita) {

  const cita =
    await citaModel.findById(
      id_cita
    );

  if (!cita) {

    throw AppError.notFound(
      `No existe cita con id ${id_cita}`
    );
  }

  return cita;
}


/*
|--------------------------------------------------------------------------
| CITAS POR ESPECIALISTA
|--------------------------------------------------------------------------
*/

async function listarPorEspecialista(
  id_especialista
) {

  const especialista =
    await usuarioModel.findByIdAndRol(
      id_especialista,
      'especialista'
    );

  if (!especialista) {

    throw AppError.notFound(
      `No existe especialista con ID ${id_especialista}`
    );
  }


  return citaModel.findByEspecialista(
    id_especialista
  );
}


/*
|--------------------------------------------------------------------------
| CREAR CITA
|--------------------------------------------------------------------------
*/

async function crear({
  id_mascota,
  id_disponibilidad,
  motivo,
  solicitante
}) {

  /*
  |--------------------------------------------------------------------------
  | Validar mascota
  |--------------------------------------------------------------------------
  */

  const mascota =
    await mascotaModel.findById(
      id_mascota
    );

  if (!mascota) {

    throw AppError.notFound(
      `No existe la mascota con id ${id_mascota}`
    );
  }


  /*
  |--------------------------------------------------------------------------
  | Usuario normal:
  | solamente puede crear cita para su mascota
  |--------------------------------------------------------------------------
  */

  if (
    solicitante.rol === 'usuario'
  ) {

    const pertenece =
      await mascotaModel.perteneceAUsuario(
        id_mascota,
        solicitante.id
      );

    if (!pertenece) {

      throw AppError.forbidden(
        'La mascota no pertenece al usuario autenticado'
      );
    }
  }


  /*
  |--------------------------------------------------------------------------
  | Validar disponibilidad
  |--------------------------------------------------------------------------
  */

  const disponibilidad =
    await disponibilidadModel.findById(
      id_disponibilidad
    );

  if (!disponibilidad) {

    throw AppError.notFound(
      `No existe disponibilidad con id ${id_disponibilidad}`
    );
  }


  if (
    disponibilidad.estado !== 'disponible'
  ) {

    throw AppError.conflict(
      'La disponibilidad seleccionada no está disponible'
    );
  }


  /*
  |--------------------------------------------------------------------------
  | Determinar recepcionista
  |--------------------------------------------------------------------------
  */

  let id_recepcionista;


  if (
    solicitante.rol === 'recepcionista'
  ) {

    id_recepcionista =
      solicitante.id;

  } else {

    id_recepcionista =
      await citaModel.obtenerPrimerRecepcionista();
  }


  if (!id_recepcionista) {

    throw AppError.badRequest(
      'No existe un recepcionista registrado para crear la cita'
    );
  }


  /*
  |--------------------------------------------------------------------------
  | Crear cita
  |--------------------------------------------------------------------------
  */

  try {

    return await citaModel.crearConTransaccion(
      {
        id_mascota,
        id_disponibilidad,
        id_recepcionista,
        motivo
      }
    );

  } catch (error) {

    /*
    |--------------------------------------------------------------------------
    | Disponibilidad inexistente
    |--------------------------------------------------------------------------
    */

    if (
      error.code ===
      'DISPONIBILIDAD_NO_EXISTE'
    ) {

      throw AppError.notFound(
        'La disponibilidad no existe'
      );
    }


    /*
    |--------------------------------------------------------------------------
    | Disponibilidad ocupada
    |--------------------------------------------------------------------------
    */

    if (
      error.code ===
      'DISPONIBILIDAD_NO_LIBRE'
    ) {

      throw AppError.conflict(
        'La disponibilidad ya está ocupada'
      );
    }


    /*
    |--------------------------------------------------------------------------
    | Restricción UNIQUE:
    | una disponibilidad solo puede tener una cita
    |--------------------------------------------------------------------------
    */

    if (
      error.code === '23505'
    ) {

      throw AppError.conflict(
        'La disponibilidad seleccionada ya tiene una cita'
      );
    }


    throw error;
  }
}


/*
|--------------------------------------------------------------------------
| EDITAR CITA
|--------------------------------------------------------------------------
*/

async function editar(
  id_cita,
  cambios,
  solicitante
) {

  const cita =
    await obtenerPorId(
      id_cita
    );


  /*
  |--------------------------------------------------------------------------
  | Usuario solamente puede editar sus propias mascotas
  |--------------------------------------------------------------------------
  */

  if (
    solicitante.rol === 'usuario'
  ) {

    const pertenece =
      await mascotaModel.perteneceAUsuario(
        cita.id_mascota,
        solicitante.id
      );

    if (!pertenece) {

      throw AppError.forbidden(
        'No puede editar una cita de una mascota que no le pertenece'
      );
    }
  }


  /*
  |--------------------------------------------------------------------------
  | Verificar nueva disponibilidad
  |--------------------------------------------------------------------------
  */

  if (
    cambios.id_disponibilidad &&
    cambios.id_disponibilidad !==
      cita.id_disponibilidad
  ) {

    const nuevaDisponibilidad =
      await disponibilidadModel.findById(
        cambios.id_disponibilidad
      );

    if (!nuevaDisponibilidad) {

      throw AppError.notFound(
        'La nueva disponibilidad no existe'
      );
    }


    if (
      nuevaDisponibilidad.estado !==
      'disponible'
    ) {

      throw AppError.conflict(
        'La nueva disponibilidad no está disponible'
      );
    }
  }


  return citaModel.editarConTransaccion(
    id_cita,
    cambios
  );
}


/*
|--------------------------------------------------------------------------
| CANCELAR CITA
|--------------------------------------------------------------------------
*/

async function cancelar(
  id_cita,
  solicitante
) {

  const cita =
    await obtenerPorId(
      id_cita
    );


  /*
  |--------------------------------------------------------------------------
  | Usuario solamente puede cancelar sus propias citas
  |--------------------------------------------------------------------------
  */

  if (
    solicitante.rol === 'usuario'
  ) {

    const pertenece =
      await mascotaModel.perteneceAUsuario(
        cita.id_mascota,
        solicitante.id
      );

    if (!pertenece) {

      throw AppError.forbidden(
        'No puede cancelar una cita de una mascota que no le pertenece'
      );
    }
  }


  /*
  |--------------------------------------------------------------------------
  | Evitar cancelar dos veces
  |--------------------------------------------------------------------------
  */

  if (
    cita.estado === 'cancelado'
  ) {

    throw AppError.conflict(
      'La cita ya está cancelada'
    );
  }


  return citaModel.cancelarConTransaccion(
    id_cita
  );
}


module.exports = {
  listar,
  obtenerPorId,
  listarPorEspecialista,
  crear,
  editar,
  cancelar
};