const { Router } = require('express');

const controller = require('../controllers/usuario.controller');

const router = Router();

/*
|--------------------------------------------------------------------------
| GET /api/usuarios/especialistas
|--------------------------------------------------------------------------
| Lista los especialistas registrados en la base de datos.
|
| IMPORTANTE:
| Esta ruta debe estar ANTES de /:documento.
|
*/

router.get(
  '/especialistas',
  controller.listarEspecialistas
);


/*
|--------------------------------------------------------------------------
| GET /api/usuarios/:documento
|--------------------------------------------------------------------------
| Busca un usuario por su documento / ID.
|
*/

router.get(
  '/:documento',
  controller.obtenerPorDocumento
);


module.exports = router;