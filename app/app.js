/**
 * app.js
 * ---------------------------------------------------------
 * Configura la instancia de Express: middlewares globales,
 * rutas del modulo y manejo de errores. No arranca el servidor
 * (eso lo hace server.js) para poder testear "app" por separado
 * si mas adelante se agregan pruebas de integracion.
 * ---------------------------------------------------------
 */
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const apiRoutes = require('./routes');
const { identifyUser } = require('./middlewares/identifyUser');
const auditLog = require('./middlewares/auditLog');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const { testConnection } = require('./config/database');
const { ok } = require('./utils/response');

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck (no requiere autenticacion)
app.get('/health', async (_req, res) => {
  try {
    const now = await testConnection();
    return ok(res, { db_time: now }, 'Servicio y base de datos activos');
  } catch (err) {
    return res.status(503).json({ success: false, message: 'Sin conexion a la base de datos', detail: err.message });
  }
});

// Autenticacion temporal (headers) + auditoria (RF15) para todo /api
app.use('/api', identifyUser, auditLog, apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
