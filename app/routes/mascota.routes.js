/**
 * routes/mascota.routes.js
 * ---------------------------------------------------------
 * Endpoints para consultar mascotas y sus propietarios.
 * ---------------------------------------------------------
 */

const {
  Router
} = require('express');

const controller = require('../controllers/mascota.controller');

const router = Router();

/*
|--------------------------------------------------------------------------
| GET /api/mascotas
|--------------------------------------------------------------------------
| Lista todas las mascotas junto con sus propietarios.
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  controller.listar
);

/*
|--------------------------------------------------------------------------
| GET /api/mascotas/:id
|--------------------------------------------------------------------------
| Busca una mascota por su ID.
|--------------------------------------------------------------------------
*/

router.get(
  '/:id',
  controller.obtener
);

module.exports = router;

