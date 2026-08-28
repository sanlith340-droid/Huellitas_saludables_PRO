/**
 * routes/index.js
 * ---------------------------------------------------------
 * Registro central de las rutas de la API.
 * ---------------------------------------------------------
 */

const { Router } = require('express');

const mascotaRoutes = require('./mascota.routes');
const usuarioRoutes = require('./usuario.routes');
const citaRoutes = require('./cita.routes');
const disponibilidadRoutes = require('./disponibilidad.routes');  // <-- IMPORTANTE

const router = Router();

/*
|--------------------------------------------------------------------------
| MASCOTAS
|--------------------------------------------------------------------------
*/
router.use('/mascotas', mascotaRoutes);

/*
|--------------------------------------------------------------------------
| USUARIOS
|--------------------------------------------------------------------------
*/
router.use('/usuarios', usuarioRoutes);

/*
|--------------------------------------------------------------------------
| CITAS
|--------------------------------------------------------------------------
*/
router.use('/citas', citaRoutes);

/*
|--------------------------------------------------------------------------
| DISPONIBILIDAD  ← ESTO ES LO QUE FALTA
|--------------------------------------------------------------------------
*/
router.use('/disponibilidad', disponibilidadRoutes);

module.exports = router;