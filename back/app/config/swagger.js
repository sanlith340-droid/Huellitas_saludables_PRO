// app/config/swagger.js
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
          description: 'ID del usuario autenticado',
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
        Usuario: {
          type: 'object',
          properties: {
            id_usuario: { type: 'string', example: 'USU001' },
            nombre: { type: 'string', example: 'Juan' },
            apellidos: { type: 'string', example: 'Perez' },
            correo: { type: 'string', example: 'juan@email.com' },
            rol: { type: 'string', enum: ['usuario', 'recepcionista', 'especialista', 'admin'] },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['correo', 'contrasena'],
          properties: {
            correo: { type: 'string', example: 'juan@email.com' },
            contrasena: { type: 'string', example: '123456' },
          },
        },
        RegistroRequest: {
          type: 'object',
          required: ['nombre', 'apellidos', 'telefono', 'correo', 'direccion', 'contrasena'],
          properties: {
            nombre: { type: 'string', example: 'Juan' },
            apellidos: { type: 'string', example: 'Perez' },
            telefono: { type: 'string', example: '3001234567' },
            correo: { type: 'string', example: 'juan@email.com' },
            direccion: { type: 'string', example: 'Calle 123' },
            contrasena: { type: 'string', example: '123456' },
            tipo: { type: 'string', enum: ['principal', 'acudiente'], default: 'principal' },
          },
        },
      },
    },
    paths: {
      '/api/auth/login': {
        post: {
          summary: 'Iniciar sesión',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' },
              },
            },
          },
          responses: {
            200: {
              description: 'Login exitoso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Login exitoso' },
                      data: {
                        type: 'object',
                        properties: {
                          usuario: { $ref: '#/components/schemas/Usuario' },
                          token: { type: 'string', example: 'mock-token-...' },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { description: 'Credenciales inválidas' },
          },
        },
      },
      '/api/auth/registro': {
        post: {
          summary: 'Registrar nuevo usuario',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegistroRequest' },
              },
            },
          },
          responses: {
            201: {
              description: 'Usuario registrado exitosamente',
            },
            409: { description: 'El correo ya está registrado' },
          },
        },
      },
      '/api/auth/registro-admin': {
        post: {
          summary: 'Registrar usuario por administrador',
          tags: ['Auth'],
          security: [{ apiKey: [] }],
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
                  required: ['nombre', 'apellidos', 'correo', 'contrasena', 'rol'],
                  properties: {
                    nombre: { type: 'string' },
                    apellidos: { type: 'string' },
                    telefono: { type: 'string' },
                    correo: { type: 'string' },
                    direccion: { type: 'string' },
                    contrasena: { type: 'string' },
                    especializacion: { type: 'string' },
                    tipo: { type: 'string', enum: ['principal', 'acudiente'] },
                    rol: { type: 'string', enum: ['admin', 'especialista', 'recepcionista'] },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Usuario creado exitosamente' },
            403: { description: 'Solo administradores pueden crear cuentas' },
          },
        },
      },
      '/api/auth/perfil': {
        get: {
          summary: 'Obtener perfil del usuario autenticado',
          tags: ['Auth'],
          security: [{ apiKey: [] }],
          parameters: [
            { $ref: '#/components/parameters/UserId' },
            { $ref: '#/components/parameters/UserRole' },
          ],
          responses: {
            200: {
              description: 'Perfil obtenido correctamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/Usuario' },
                    },
                  },
                },
              },
            },
            401: { description: 'No autenticado' },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;