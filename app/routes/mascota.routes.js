// app/routes/mascota.routes.js
/**
 * routes/mascota.routes.js
 * Endpoints de mascotas.
 */

const { Router } = require('express');
const controller = require('../controllers/mascota.controller');

const router = Router();

router.get('/', controller.listar);
router.get('/:id', controller.obtener);

module.exports = router;