/**
 * routes/disponibilidad.routes.js
 * ---------------------------------------------------------
 * RF08: gestion de disponibilidad.
 * ---------------------------------------------------------
 */

const { Router } = require('express');
const controller = require('../controllers/disponibilidad.controller');
const validate = require('../middlewares/validate');
const { requireRole } = require('../middlewares/identifyUser');

const {
  crearDisponibilidadSchema,
  actualizarDisponibilidadSchema,
  idParamSchema,
  listarDisponibilidadQuerySchema,
} = require('../schemas/disponibilidad.schema');

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Disponibilidad
 *     description: Gestión de horarios disponibles de veterinarios
 */

/**
 * @swagger
 * /api/disponibilidad:
 *   get:
 *     tags:
 *       - Disponibilidad
 *     summary: Listar disponibilidades
 *     description: Consulta los horarios disponibles de los veterinarios.
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *       - $ref: '#/components/parameters/UserRole'
 *     responses:
 *       200:
 *         description: Disponibilidades listadas correctamente
 *       401:
 *         description: Falta autenticación temporal
 */
router.get(
  '/',
  validate(listarDisponibilidadQuerySchema, 'query'),
  controller.listar
);

/**
 * @swagger
 * /api/disponibilidad/{id}:
 *   get:
 *     tags:
 *       - Disponibilidad
 *     summary: Obtener una disponibilidad
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *       - $ref: '#/components/parameters/UserRole'
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 9
 *     responses:
 *       200:
 *         description: Disponibilidad encontrada
 *       404:
 *         description: Disponibilidad no encontrada
 */
router.get(
  '/:id',
  validate(idParamSchema, 'params'),
  controller.obtener
);

/**
 * @swagger
 * /api/disponibilidad:
 *   post:
 *     tags:
 *       - Disponibilidad
 *     summary: Crear disponibilidad
 *     description: Crea un nuevo horario disponible para un veterinario.
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *       - $ref: '#/components/parameters/UserRole'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             id_usuario: "2000000001"
 *             fecha: "2026-08-25"
 *             hora_inicio: "08:00:00"
 *             hora_fin: "09:00:00"
 *             estado: "disponible"
 *     responses:
 *       201:
 *         description: Disponibilidad creada correctamente
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: Rol no autorizado
 */
router.post(
  '/',
  requireRole('recepcionista', 'admin'),
  validate(crearDisponibilidadSchema, 'body'),
  controller.crear
);

/**
 * @swagger
 * /api/disponibilidad/{id}:
 *   put:
 *     tags:
 *       - Disponibilidad
 *     summary: Actualizar disponibilidad
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *       - $ref: '#/components/parameters/UserRole'
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 9
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             estado: "disponible"
 *     responses:
 *       200:
 *         description: Disponibilidad actualizada correctamente
 *       404:
 *         description: Disponibilidad no encontrada
 */
router.put(
  '/:id',
  requireRole('recepcionista', 'admin'),
  validate(idParamSchema, 'params'),
  validate(actualizarDisponibilidadSchema, 'body'),
  controller.actualizar
);

/**
 * @swagger
 * /api/disponibilidad/{id}:
 *   delete:
 *     tags:
 *       - Disponibilidad
 *     summary: Eliminar disponibilidad
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *       - $ref: '#/components/parameters/UserRole'
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 9
 *     responses:
 *       200:
 *         description: Disponibilidad eliminada correctamente
 *       404:
 *         description: Disponibilidad no encontrada
 */
router.delete(
  '/:id',
  requireRole('recepcionista', 'admin'),
  validate(idParamSchema, 'params'),
  controller.eliminar
);

module.exports = router;
