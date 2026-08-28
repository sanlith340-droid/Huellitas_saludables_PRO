/**
 * routes/index.js
 * Registro central de las rutas de la API.
 */

const { Router } = require('express');

const mascotaRoutes = require('./mascota.routes');
const usuarioRoutes = require('./usuario.routes');
const citaRoutes = require('./cita.routes');
const disponibilidadRoutes = require('./disponibilidad.routes');

const router = Router();

router.use('/mascotas', mascotaRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/citas', citaRoutes);
router.use('/disponibilidad', disponibilidadRoutes);

module.exports = router;