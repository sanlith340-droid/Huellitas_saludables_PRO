/**
 * routes/mascota.routes.js
 * Endpoints para consultar mascotas y sus propietarios.
 */

const { Router } = require('express');
const controller = require('../controllers/mascota.controller');

const router = Router();

router.get('/', controller.listar);
router.get('/:id', controller.obtener);

module.exports = router;