/**
 * routes/cita.routes.js
 * ---------------------------------------------------------
 * RF07: el dueno solicita citas.
 * RF10: el veterinario consulta sus citas asignadas.
 * ---------------------------------------------------------
 */

const { Router } = require('express');
const controller = require('../controllers/cita.controller');
const validate = require('../middlewares/validate');
const { requireRole } = require('../middlewares/identifyUser');

const {
  crearCitaSchema,
  actualizarEstadoCitaSchema,
  idParamSchema,
  listarCitasQuerySchema,
} = require('../schemas/cita.schema');

const Joi = require('joi');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Citas
 *   description: Gestión de citas veterinarias
 */

/**
 * @swagger
 * /api/citas:
 *   get:
 *     summary: Listar citas
 *     description: Lista las citas del usuario autenticado según su rol y filtros.
 *     tags: [Citas]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *       - $ref: '#/components/parameters/UserRole'
 *       - in: query
 *         name: id_mascota
 *         schema:
 *           type: integer
 *         description: Filtrar por mascota
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [p, c, cdo]
 *         description: Filtrar por estado
 *       - in: query
 *         name: fecha
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar por fecha
 *     responses:
 *       200:
 *         description: Citas listadas correctamente
 *       401:
 *         description: Headers de autenticación faltantes
 */
router.get(
  '/',
  validate(listarCitasQuerySchema, 'query'),
  controller.listar
);

/**
 * @swagger
 * /api/citas/veterinario/{id_veterinario}:
 *   get:
 *     summary: Listar citas de un veterinario
 *     description: Consulta las citas asignadas a un veterinario.
 *     tags: [Citas]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *       - $ref: '#/components/parameters/UserRole'
 *       - in: path
 *         name: id_veterinario
 *         required: true
 *         schema:
 *           type: string
 *         example: "2000000001"
 *     responses:
 *       200:
 *         description: Citas del veterinario
 *       401:
 *         description: Headers de autenticación faltantes
 *       404:
 *         description: Veterinario no encontrado
 */
router.get(
  '/veterinario/:id_veterinario',
  validate(
    Joi.object({
      id_veterinario: Joi.string().max(15).required(),
    }),
    'params'
  ),
  controller.listarPorVeterinario
);

/**
 * @swagger
 * /api/citas/{id}:
 *   get:
 *     summary: Obtener una cita
 *     description: Obtiene una cita específica por su ID.
 *     tags: [Citas]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *       - $ref: '#/components/parameters/UserRole'
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 9
 *     responses:
 *       200:
 *         description: Cita encontrada
 *       404:
 *         description: Cita no encontrada
 */
router.get(
  '/:id',
  validate(idParamSchema, 'params'),
  controller.obtener
);

/**
 * @swagger
 * /api/citas:
 *   post:
 *     summary: Crear una cita
 *     description: Solicita una cita usando una disponibilidad libre.
 *     tags: [Citas]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *       - $ref: '#/components/parameters/UserRole'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearCita'
 *           example:
 *             id_mascota: 1
 *             id_disponibilidad: 9
 *             motivos: "Consulta de prueba desde Swagger"
 *     responses:
 *       201:
 *         description: Cita creada correctamente
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: La mascota no pertenece al usuario o el rol no tiene permiso
 *       409:
 *         description: La disponibilidad ya está ocupada
 */
router.post(
  '/',
  requireRole('usuario', 'recepcionista', 'admin'),
  validate(crearCitaSchema, 'body'),
  controller.solicitar
);

/**
 * @swagger
 * /api/citas/{id}/estado:
 *   patch:
 *     summary: Cambiar estado de una cita
 *     description: Confirma, cancela o marca como cumplida una cita.
 *     tags: [Citas]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *       - $ref: '#/components/parameters/UserRole'
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 9
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActualizarEstadoCita'
 *           example:
 *             estado: "c"
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       400:
 *         description: Estado inválido
 *       404:
 *         description: Cita no encontrada
 */
router.patch(
  '/:id/estado',
  requireRole('recepcionista', 'veterinario', 'admin'),
  validate(idParamSchema, 'params'),
  validate(actualizarEstadoCitaSchema, 'body'),
  controller.cambiarEstado
);

module.exports = router;