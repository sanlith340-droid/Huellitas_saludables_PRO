const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Huellitas Saludables API',
      version: '1.0.0',
      description: 'API para gestión de mascotas, usuarios, citas y disponibilidad veterinaria',
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
          description: 'ID del usuario autenticado (ej: USU001, ESP001, REC001)',
          schema: { type: 'string' },
          example: 'USU001',
        },
        UserRole: {
          name: 'x-user-role',
          in: 'header',
          required: true,
          description: 'Rol del usuario',
          schema: {
            type: 'string',
            enum: ['usuario', 'recepcionista', 'especialista', 'admin'],
          },
          example: 'usuario',
        },
      },
    },
    paths: {
      '/api/usuarios/especialistas': {
        get: {
          summary: 'Listar especialistas',
          tags: ['Usuarios'],
          parameters: [
            { $ref: '#/components/parameters/UserId' },
            { $ref: '#/components/parameters/UserRole' },
          ],
          responses: {
            200: { description: 'Especialistas listados correctamente' },
            401: { description: 'Usuario no autenticado' },
          },
        },
      },
      '/api/usuarios/{documento}': {
        get: {
          summary: 'Buscar usuario por documento',
          tags: ['Usuarios'],
          parameters: [
            {
              name: 'documento',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              example: 'USU001',
            },
            { $ref: '#/components/parameters/UserId' },
            { $ref: '#/components/parameters/UserRole' },
          ],
          responses: {
            200: { description: 'Usuario encontrado correctamente' },
            404: { description: 'Usuario no encontrado' },
          },
        },
      },
      '/api/mascotas': {
        get: {
          summary: 'Listar todas las mascotas',
          tags: ['Mascotas'],
          parameters: [
            { $ref: '#/components/parameters/UserId' },
            { $ref: '#/components/parameters/UserRole' },
          ],
          responses: {
            200: { description: 'Mascotas listadas correctamente' },
          },
        },
      },
      '/api/mascotas/{id}': {
        get: {
          summary: 'Obtener mascota por ID',
          tags: ['Mascotas'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              example: 1,
            },
            { $ref: '#/components/parameters/UserId' },
            { $ref: '#/components/parameters/UserRole' },
          ],
          responses: {
            200: { description: 'Mascota encontrada correctamente' },
            404: { description: 'Mascota no encontrada' },
          },
        },
      },
      '/api/disponibilidad': {
        get: {
          summary: 'Listar disponibilidades',
          tags: ['Disponibilidad'],
          parameters: [
            {
              name: 'id_usuario',
              in: 'query',
              schema: { type: 'string' },
              description: 'Filtrar por ID de especialista',
            },
            {
              name: 'fecha',
              in: 'query',
              schema: { type: 'string', format: 'date' },
              description: 'Filtrar por fecha (YYYY-MM-DD)',
            },
            { $ref: '#/components/parameters/UserId' },
            { $ref: '#/components/parameters/UserRole' },
          ],
          responses: {
            200: { description: 'Disponibilidades listadas correctamente' },
          },
        },
      },
      '/api/citas': {
        get: {
          summary: 'Listar citas',
          tags: ['Citas'],
          parameters: [
            {
              name: 'estado',
              in: 'query',
              schema: { type: 'string', enum: ['pendiente', 'confirmado', 'cancelado', 'atendido'] },
            },
            {
              name: 'fecha',
              in: 'query',
              schema: { type: 'string', format: 'date' },
            },
            { $ref: '#/components/parameters/UserId' },
            { $ref: '#/components/parameters/UserRole' },
          ],
          responses: {
            200: { description: 'Citas listadas correctamente' },
          },
        },
        post: {
          summary: 'Crear cita',
          tags: ['Citas'],
          parameters: [
            { $ref: '#/components/parameters/UserId' },
            { $ref: '#/components/parameters/UserRole' },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['id_mascota', 'id_disponibilidad'],
                  properties: {
                    id_mascota: { type: 'integer', example: 1 },
                    id_disponibilidad: { type: 'integer', example: 1 },
                    motivo: { type: 'string', example: 'Consulta general' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Cita creada correctamente' },
            400: { description: 'Datos inválidos' },
            409: { description: 'Conflicto - disponibilidad ocupada' },
          },
        },
      },
      '/api/citas/{id}/cancelar': {
        patch: {
          summary: 'Cancelar cita',
          tags: ['Citas'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
            { $ref: '#/components/parameters/UserId' },
            { $ref: '#/components/parameters/UserRole' },
          ],
          responses: {
            200: { description: 'Cita cancelada correctamente' },
            404: { description: 'Cita no encontrada' },
            409: { description: 'Cita ya cancelada' },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;