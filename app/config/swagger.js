const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'Huellitas Saludables API',
      version: '1.0.0',
      description: 'API para gestión de citas y disponibilidad veterinaria',
    },

    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
    ],

    components: {
      parameters: {
        UserId: {
          name: 'x-user-id',
          in: 'header',
          required: true,
          schema: {
            type: 'string',
          },
          example: '1000000001',
        },

        UserRole: {
          name: 'x-user-role',
          in: 'header',
          required: true,
          schema: {
            type: 'string',
            enum: [
              'usuario',
              'recepcionista',
              'veterinario',
              'admin',
            ],
          },
          example: 'usuario',
        },
      },

      schemas: {
        CrearCita: {
          type: 'object',
          required: [
            'id_mascota',
            'id_disponibilidad',
          ],
          properties: {
            id_mascota: {
              type: 'integer',
              minimum: 1,
              example: 1,
            },

            id_disponibilidad: {
              type: 'integer',
              minimum: 1,
              example: 9,
            },

            motivos: {
              type: 'string',
              maxLength: 1000,
              nullable: true,
              example: 'Consulta de prueba desde Swagger',
            },
          },
        },

        ActualizarEstadoCita: {
          type: 'object',
          required: [
            'estado',
          ],
          properties: {
            estado: {
              type: 'string',
              enum: [
                'p',
                'c',
                'cdo',
              ],
              example: 'c',
            },
          },
        },
      },
    },
  },

  apis: [
    './app/config/swagger.js',
    './app/routes/*.js',
  ],
};

module.exports = swaggerJsdoc(options);