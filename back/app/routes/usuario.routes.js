/**
 * routes/usuario.routes.js
 * Endpoints de usuarios.
 */

const { Router } = require('express');
const controller = require('../controllers/usuario.controller');

const router = Router();

// IMPORTANTE: La ruta /especialistas debe estar ANTES de /:documento
router.get('/especialistas', controller.listarEspecialistas);

// Buscar usuario por documento/ID
router.get('/:documento', controller.obtenerPorDocumento);

module.exports = router;