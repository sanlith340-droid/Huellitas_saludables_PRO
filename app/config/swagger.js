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
      schemas: {
        // ============================================================
        // DISPONIBILIDAD SCHEMAS
        // ============================================================
        Disponibilidad: {
          type: 'object',
          properties: {
            id_disponibilidad: {
              type: 'integer',
              example: 1,
            },
            id_usuario: {
              type: 'string',
              example: 'ESP001',
            },
            fecha: {
              type: 'string',
              format: 'date',
              example: '2026-08-22',
            },
            hora: {
              type: 'string',
              example: '10:00:00',
            },
            estado: {
              type: 'string',
              enum: ['disponible', 'ocupado'],
              example: 'disponible',
            },
            especialista_nombre: {
              type: 'string',
              example: 'Alejandro',
            },
            especialista_apellidos: {
              type: 'string',
              example: 'Castillo Moreno',
            },
            especializacion: {
              type: 'string',
              example: 'Medicina Veterinaria General',
            },
          },
        },
        CrearDisponibilidad: {
          type: 'object',
          required: ['id_usuario', 'fecha', 'hora'],
          properties: {
            id_usuario: {
              type: 'string',
              description: 'ID del especialista',
              example: 'ESP001',
            },
            fecha: {
              type: 'string',
              format: 'date',
              description: 'Fecha de la disponibilidad (YYYY-MM-DD)',
              example: '2026-08-22',
            },
            hora: {
              type: 'string',
              description: 'Hora de la disponibilidad (HH:MM:SS)',
              example: '10:00:00',
            },
            estado: {
              type: 'string',
              enum: ['disponible', 'ocupado'],
              description: 'Estado de la disponibilidad (opcional, por defecto "disponible")',
              example: 'disponible',
            },
          },
        },
        ActualizarDisponibilidad: {
          type: 'object',
          properties: {
            id_usuario: {
              type: 'string',
              description: 'ID del especialista',
              example: 'ESP001',
            },
            fecha: {
              type: 'string',
              format: 'date',
              description: 'Fecha de la disponibilidad (YYYY-MM-DD)',
              example: '2026-08-22',
            },
            hora: {
              type: 'string',
              description: 'Hora de la disponibilidad (HH:MM:SS)',
              example: '10:00:00',
            },
            estado: {
              type: 'string',
              enum: ['disponible', 'ocupado'],
              description: 'Estado de la disponibilidad',
              example: 'ocupado',
            },
          },
        },
        // ============================================================
        // CITA SCHEMAS
        // ============================================================
        CrearCita: {
          type: 'object',
          required: ['id_mascota', 'id_disponibilidad'],
          properties: {
            id_mascota: {
              type: 'integer',
              example: 1,
            },
            id_disponibilidad: {
              type: 'integer',
              example: 1,
            },
            motivo: {
              type: 'string',
              maxLength: 200,
              example: 'Consulta de control',
            },
          },
        },
      },
    },
    paths: {
      // ============================================================
      // USUARIOS
      // ============================================================
      '/api/usuarios/especialistas': {
        get: {
          summary: 'Listar especialistas',
          tags: ['Usuarios'],
          parameters: [
            { $ref: '#/components/parameters/UserId' },
            { $ref: '#/components/parameters/UserRole' },
          ],
          responses: {
            200: {
              description: 'Especialistas listados correctamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Especialistas listados correctamente' },
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id_usuario: { type: 'string', example: 'ESP001' },
                            nombre: { type: 'string', example: 'Alejandro' },
                            apellidos: { type: 'string', example: 'Castillo Moreno' },
                            especializacion: { type: 'string', example: 'Medicina Veterinaria General' },
                            rol: { type: 'string', example: 'especialista' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
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
              description: 'ID del usuario (ej: USU001, ESP001)',
              example: 'USU001',
            },
            { $ref: '#/components/parameters/UserId' },
            { $ref: '#/components/parameters/UserRole' },
          ],
          responses: {
            200: {
              description: 'Usuario encontrado correctamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Usuario encontrado correctamente' },
                      data: {
                        type: 'object',
                        properties: {
                          id_usuario: { type: 'string', example: 'USU001' },
                          nombre: { type: 'string', example: 'Pedro' },
                          apellidos: { type: 'string', example: 'Gonzalez Ramirez' },
                          rol: { type: 'string', example: 'usuario' },
                        },
                      },
                    },
                  },
                },
              },
            },
            404: { description: 'Usuario no encontrado' },
          },
        },
      },

      // ============================================================
      // MASCOTAS
      // ============================================================
      '/api/mascotas': {
        get: {
          summary: 'Listar todas las mascotas',
          tags: ['Mascotas'],
          parameters: [
            { $ref: '#/components/parameters/UserId' },
            { $ref: '#/components/parameters/UserRole' },
          ],
          responses: {
            200: {
              description: 'Mascotas listadas correctamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Mascotas listadas correctamente' },
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id_mascota: { type: 'integer', example: 1 },
                            mascota: { type: 'string', example: 'Max' },
                            especie: { type: 'string', example: 'perro' },
                            raza: { type: 'string', example: 'Labrador Retriever' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
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
              description: 'ID de la mascota',
              example: 1,
            },
            { $ref: '#/components/parameters/UserId' },
            { $ref: '#/components/parameters/UserRole' },
          ],
          responses: {
            200: {
              description: 'Mascota encontrada correctamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Mascota encontrada correctamente' },
                      data: {
                        type: 'object',
                        properties: {
                          id_mascota: { type: 'integer', example: 1 },
                          mascota: { type: 'string', example: 'Max' },
                          especie: { type: 'string', example: 'perro' },
                          raza: {
                            type: 'object',
                            properties: {
                              id_raza: { type: 'integer', example: 1 },
                              nombre: { type: 'string', example: 'Labrador Retriever' },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            404: { description: 'Mascota no encontrada' },
          },
        },
      },

      // ============================================================
      // DISPONIBILIDAD - SIN DELETE
      // ============================================================
      '/api/disponibilidad': {
        get: {
          summary: 'Listar disponibilidades',
          tags: ['Disponibilidad'],
          parameters: [
            {
              name: 'id_usuario',
              in: 'query',
              schema: { type: 'string' },
              description: 'Filtrar por ID del especialista',
              example: 'ESP001',
            },
            {
              name: 'fecha',
              in: 'query',
              schema: { type: 'string', format: 'date' },
              description: 'Filtrar por fecha (YYYY-MM-DD)',
              example: '2026-08-22',
            },
            {
              name: 'estado',
              in: 'query',
              schema: { type: 'string', enum: ['disponible', 'ocupado'] },
              description: 'Filtrar por estado',
              example: 'disponible',
            },
            { $ref: '#/components/parameters/UserId' },
            { $ref: '#/components/parameters/UserRole' },
          ],
          responses: {
            200: {
              description: 'Disponibilidades listadas correctamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Disponibilidades listadas correctamente' },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Disponibilidad' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Crear disponibilidad',
          tags: ['Disponibilidad'],
          description: 'Crea una nueva disponibilidad para un especialista (Solo recepcionistas y admin)',
          parameters: [
            { $ref: '#/components/parameters/UserId' },
            { $ref: '#/components/parameters/UserRole' },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CrearDisponibilidad' },
                examples: {
                  'Disponibilidad básica': {
                    value: {
                      id_usuario: 'ESP001',
                      fecha: '2026-08-22',
                      hora: '10:00:00',
                      estado: 'disponible',
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Disponibilidad creada correctamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Disponibilidad creada correctamente' },
                      data: { $ref: '#/components/schemas/Disponibilidad' },
                    },
                  },
                },
              },
            },
            400: { description: 'Datos inválidos o el usuario no es especialista' },
            401: { description: 'Usuario no autenticado' },
            403: { description: 'No tiene permisos para crear disponibilidades' },
            409: { description: 'Conflicto - ya existe disponibilidad para esa fecha y hora' },
          },
        },
      },
      '/api/disponibilidad/{id}': {
        get: {
          summary: 'Obtener disponibilidad por ID',
          tags: ['Disponibilidad'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID de la disponibilidad',
              example: 1,
            },
            { $ref: '#/components/parameters/UserId' },
            { $ref: '#/components/parameters/UserRole' },
          ],
          responses: {
            200: {
              description: 'Disponibilidad encontrada correctamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Disponibilidad encontrada correctamente' },
                      data: { $ref: '#/components/schemas/Disponibilidad' },
                    },
                  },
                },
              },
            },
            404: { description: 'Disponibilidad no encontrada' },
          },
        },
        put: {
          summary: 'Actualizar disponibilidad',
          tags: ['Disponibilidad'],
          description: 'Actualiza una disponibilidad existente (Solo recepcionistas y admin)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID de la disponibilidad',
              example: 1,
            },
            { $ref: '#/components/parameters/UserId' },
            { $ref: '#/components/parameters/UserRole' },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ActualizarDisponibilidad' },
                examples: {
                  'Cambiar estado': {
                    value: {
                      estado: 'ocupado',
                    },
                  },
                  'Cambiar horario': {
                    value: {
                      fecha: '2026-08-23',
                      hora: '11:00:00',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Disponibilidad actualizada correctamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Disponibilidad actualizada correctamente' },
                      data: { $ref: '#/components/schemas/Disponibilidad' },
                    },
                  },
                },
              },
            },
            401: { description: 'Usuario no autenticado' },
            403: { description: 'No tiene permisos para actualizar disponibilidades' },
            404: { description: 'Disponibilidad no encontrada' },
            409: { description: 'Conflicto - no se puede modificar una disponibilidad ocupada' },
          },
        },
        // ❌ DELETE ELIMINADO
      },

      // ============================================================
      // CITAS
      // ============================================================
      '/api/citas': {
        get: {
          summary: 'Listar citas',
          tags: ['Citas'],
          parameters: [
            {
              name: 'estado',
              in: 'query',
              schema: { type: 'string', enum: ['pendiente', 'confirmado', 'cancelado', 'atendido'] },
              description: 'Filtrar por estado',
              example: 'pendiente',
            },
            {
              name: 'fecha',
              in: 'query',
              schema: { type: 'string', format: 'date' },
              description: 'Filtrar por fecha (YYYY-MM-DD)',
              example: '2026-08-22',
            },
            {
              name: 'id_mascota',
              in: 'query',
              schema: { type: 'integer' },
              description: 'Filtrar por ID de mascota',
              example: 1,
            },
            { $ref: '#/components/parameters/UserId' },
            { $ref: '#/components/parameters/UserRole' },
          ],
          responses: {
            200: {
              description: 'Citas listadas correctamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Citas listadas correctamente' },
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id_cita: { type: 'integer', example: 1 },
                            id_mascota: { type: 'integer', example: 1 },
                            mascota_nombre: { type: 'string', example: 'Max' },
                            fecha_cita: { type: 'string', example: '2026-08-22' },
                            hora_cita: { type: 'string', example: '10:00:00' },
                            estado: { type: 'string', example: 'pendiente' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Crear cita',
          tags: ['Citas'],
          description: 'Crea una nueva cita para una mascota en una disponibilidad libre',
          parameters: [
            { $ref: '#/components/parameters/UserId' },
            { $ref: '#/components/parameters/UserRole' },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CrearCita' },
                examples: {
                  'Cita de control': {
                    value: {
                      id_mascota: 1,
                      id_disponibilidad: 1,
                      motivo: 'Consulta de control',
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Cita creada correctamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Cita creada correctamente' },
                      data: {
                        type: 'object',
                        properties: {
                          id_cita: { type: 'integer', example: 1 },
                          id_mascota: { type: 'integer', example: 1 },
                          estado: { type: 'string', example: 'pendiente' },
                          fecha_cita: { type: 'string', example: '2026-08-22' },
                          hora_cita: { type: 'string', example: '10:00:00' },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: { description: 'Datos inválidos' },
            403: { description: 'La mascota no pertenece al usuario' },
            404: { description: 'Disponibilidad no encontrada' },
            409: { description: 'Conflicto - disponibilidad ocupada' },
          },
        },
      },
      '/api/citas/{id}': {
        get: {
          summary: 'Obtener cita por ID',
          tags: ['Citas'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID de la cita',
              example: 1,
            },
            { $ref: '#/components/parameters/UserId' },
            { $ref: '#/components/parameters/UserRole' },
          ],
          responses: {
            200: { description: 'Cita encontrada correctamente' },
            404: { description: 'Cita no encontrada' },
          },
        },
        put: {
          summary: 'Editar cita',
          tags: ['Citas'],
          description: 'Edita una cita existente',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID de la cita',
              example: 1,
            },
            { $ref: '#/components/parameters/UserId' },
            { $ref: '#/components/parameters/UserRole' },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id_mascota: { type: 'integer', example: 2 },
                    id_disponibilidad: { type: 'integer', example: 5 },
                    motivo: { type: 'string', example: 'Consulta de urgencia' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cita editada correctamente' },
            404: { description: 'Cita no encontrada' },
            409: { description: 'Conflicto' },
          },
        },
      },
      '/api/citas/especialista/{id_especialista}': {
        get: {
          summary: 'Listar citas de un especialista',
          tags: ['Citas'],
          description: 'Lista todas las citas asignadas a un especialista (RF10)',
          parameters: [
            {
              name: 'id_especialista',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'ID del especialista',
              example: 'ESP001',
            },
            { $ref: '#/components/parameters/UserId' },
            { $ref: '#/components/parameters/UserRole' },
          ],
          responses: {
            200: {
              description: 'Citas del especialista listadas correctamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Citas del especialista listadas correctamente' },
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id_cita: { type: 'integer' },
                            mascota_nombre: { type: 'string' },
                            fecha_cita: { type: 'string' },
                            hora_cita: { type: 'string' },
                            estado: { type: 'string' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            404: { description: 'Especialista no encontrado' },
          },
        },
      },
      '/api/citas/{id}/cancelar': {
        patch: {
          summary: 'Cancelar cita',
          tags: ['Citas'],
          description: 'Cancela una cita existente y libera la disponibilidad',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID de la cita',
              example: 1,
            },
            { $ref: '#/components/parameters/UserId' },
            { $ref: '#/components/parameters/UserRole' },
          ],
          responses: {
            200: {
              description: 'Cita cancelada correctamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Cita cancelada correctamente' },
                      data: {
                        type: 'object',
                        properties: {
                          id_cita: { type: 'integer', example: 1 },
                          estado: { type: 'string', example: 'cancelado' },
                        },
                      },
                    },
                  },
                },
              },
            },
            404: { description: 'Cita no encontrada' },
            409: { description: 'Conflicto - cita ya cancelada' },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;