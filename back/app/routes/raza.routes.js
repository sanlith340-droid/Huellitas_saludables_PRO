// app/routes/raza.routes.js
/**
 * routes/raza.routes.js
 * Endpoint para consultar el catálogo de razas.
 */

const { Router } = require('express');
const controller = require('../controllers/raza.controller');

const router = Router();

/**
 * GET /api/razas
 * Listar todas las razas (requiere autenticación, sin restricción de rol)
 */
router.get('/', controller.listar);

module.exports = router;
