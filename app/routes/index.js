/**
 * routes/index.js
 * ---------------------------------------------------------
 * Punto unico donde se registran todos los sub-routers del
 * modulo bajo el prefijo /api.
 * ---------------------------------------------------------
 */
const { Router } = require('express');
const disponibilidadRoutes = require('./disponibilidad.routes');
const citaRoutes = require('./cita.routes');

const router = Router();

router.use('/disponibilidad', disponibilidadRoutes);
router.use('/citas', citaRoutes);

module.exports = router;
