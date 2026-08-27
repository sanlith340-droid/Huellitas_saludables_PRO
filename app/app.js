/**
 * app.js
 * ---------------------------------------------------------
 * Configuración principal de Express.
 *
 * Aquí se registran:
 * - Middlewares globales
 * - Swagger
 * - Healthcheck
 * - Autenticación temporal
 * - Auditoría
 * - Rutas de la API
 * - Manejo de errores
 *
 * El servidor se inicia desde server.js.
 * ---------------------------------------------------------
 */

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');
const apiRoutes = require('./routes');

const { identifyUser } = require('./middlewares/identifyUser');
const auditLog = require('./middlewares/auditLog');

const {
  notFoundHandler,
  errorHandler
} = require('./middlewares/errorHandler');

const {
  testConnection
} = require('./config/database');

const {
  ok
} = require('./utils/response');

const app = express();

/*
|--------------------------------------------------------------------------
| SWAGGER
|--------------------------------------------------------------------------
*/

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

/*
|--------------------------------------------------------------------------
| MIDDLEWARES GLOBALES
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*'
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

/*
|--------------------------------------------------------------------------
| HEALTHCHECK
|--------------------------------------------------------------------------
| No necesita autenticación.
|--------------------------------------------------------------------------
*/

app.get('/health', async (_req, res) => {
  try {
    const now = await testConnection();

    return ok(
      res,
      {
        db_time: now
      },
      'Servicio y base de datos activos'
    );

  } catch (err) {

    return res.status(503).json({
      success: false,
      message: 'Sin conexión a la base de datos',
      detail: err.message
    });
  }
});

/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
|
| Todos los endpoints /api utilizan:
|
| x-user-id
| x-user-role
|
| Ejemplo:
|
| x-user-id: USU001
| x-user-role: usuario
|
|--------------------------------------------------------------------------
*/

app.use(
  '/api',
  identifyUser,
  auditLog,
  apiRoutes
);

/*
|--------------------------------------------------------------------------
| MANEJO DE ERRORES
|--------------------------------------------------------------------------
*/

app.use(notFoundHandler);

app.use(errorHandler);

module.exports = app;

