const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'Huellitas Saludables API',
      version: '1.0.0',
      description:
        'API para gestión de mascotas, usuarios, citas y disponibilidad veterinaria',
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
          description: 'Documento o ID del usuario autenticado',
          schema: {
            type: 'string',
          },
          example: '1000000001',
        },

        UserRole: {
          name: 'x-user-role',
          in: 'header',
          required: true,
          description: 'Rol del usuario',
          schema: {
            type: 'string',
            enum: [
            'usuario',
            'recepcionista',
            'especialista',
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

    paths: {
      /*
       * -----------------------------------------------------------------------
       * USUARIOS
       * -----------------------------------------------------------------------
       */

      '/api/usuarios/veterinarios': {
        get: {
          summary: 'Listar veterinarios',

          description:
            'Obtiene la lista de especialistas/veterinarios registrados en la base de datos.',

          tags: [
            'Usuarios',
          ],

          parameters: [
            {
              $ref: '#/components/parameters/UserId',
            },

            {
              $ref: '#/components/parameters/UserRole',
            },
          ],

          responses: {
            200: {
              description:
                'Especialistas listados correctamente',
            },

            401: {
              description:
                'Usuario no autenticado',
            },

            500: {
              description:
                'Error interno del servidor',
            },
          },
        },
      },

      /*
       * -----------------------------------------------------------------------
       * BUSCAR USUARIO POR DOCUMENTO
       * -----------------------------------------------------------------------
       */

      '/api/usuarios/{documento}': {
        get: {
          summary: 'Buscar usuario por documento',

          description:
            'Obtiene un usuario utilizando su documento como identificador.',

          tags: [
            'Usuarios',
          ],

          parameters: [
            {
              name: 'documento',
              in: 'path',
              required: true,

              description:
                'Documento o ID del usuario',

              schema: {
                type: 'string',
              },

              example: '1000000001',
            },

            {
              $ref: '#/components/parameters/UserId',
            },

            {
              $ref: '#/components/parameters/UserRole',
            },
          ],

          responses: {
            200: {
              description:
                'Usuario encontrado correctamente',
            },

            404: {
              description:
                'Usuario no encontrado',
            },

            401: {
              description:
                'Usuario no autenticado',
            },

            500: {
              description:
                'Error interno del servidor',
            },
          },
        },
      },
    },
  },

  /*
   * swagger-jsdoc requiere que "apis" exista
   * y sea un arreglo.
   *
   * Las rutas se están definiendo directamente
   * dentro de definition.paths.
   */

  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;