# Documentación Técnica — Backend Huellitas Saludables

**Módulo:** Gestión de Citas y Disponibilidad Veterinaria  
**Tecnologías:** Node.js, Express, PostgreSQL, Joi, CORS, dotenv, Swagger/OpenAPI  
**Fecha:** Agosto de 2026

---

## 1. Objetivo

Este documento reúne el procedimiento realizado para poner en funcionamiento, verificar y documentar el backend de **Huellitas Saludables**.

Incluye:

- Configuración de PostgreSQL.
- Configuración de variables de entorno.
- Instalación y ejecución de Node.js/Express.
- Autenticación temporal mediante headers.
- Pruebas de los endpoints de Citas y Disponibilidad.
- Creación y consulta de citas.
- Configuración de Swagger/OpenAPI.
- Pruebas realizadas mediante `curl`.
- Observaciones y problemas encontrados.
- Estado actual del proyecto.

---

## 2. Arquitectura comprobada

```text
Cliente REST / Swagger / Lite Client
              ↓
       Node.js + Express
              ↓
 CORS + JSON + autenticación
       temporal + auditoría
              ↓
 Routes → Controllers → Services → Schemas
              ↓
          PostgreSQL
              ↓
     huellitas_saludables
```

---

## 3. Estructura del proyecto

Ruta utilizada:

```text
C:\Users\Jorge Torres\Desktop\SENA JORGE TORRES 3°TRIMESTRE\BACKEND
```

Estructura principal:

```text
app/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── schemas/
├── services/
├── utils/
├── app.js
└── server.js

database/
.env
.env.example
package.json
```

---

## 4. Configuración de PostgreSQL

La base de datos utilizada por el backend es:

```text
huellitas_saludables
```

Durante las pruebas apareció inicialmente un error al intentar conectarse a:

```text
huellitas-saludables
```

PostgreSQL indicó:

```text
FATAL: no existe la base de datos «huellitas-saludables»
```

Se corrigió utilizando el nombre real:

```text
huellitas_saludables
```

### PostgreSQL ya estaba activo

En una de las pruebas se ejecutó `pg_ctl` y apareció:

```text
FATAL: el archivo de bloqueo «postmaster.pid» ya existe
HINT: ¿Hay otro postmaster (PID 14844) en ejecución?
```

Esto indicó que PostgreSQL ya estaba ejecutándose en:

```text
C:/Formacion/pgsql/data
```

Por lo tanto, no era necesario iniciar una segunda instancia.

---

## 5. Configuración del archivo `.env`

El backend utiliza una configuración similar a:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=huellitas_saludables
DB_USER=postgres
DB_PASSWORD=TU_CONTRASEÑA

CORS_ORIGIN=*
```

La contraseña debe corresponder al usuario `postgres` de la instalación local.

---

## 6. Instalación de dependencias

Desde la carpeta del backend:

```cmd
npm install
```

Para iniciar el servidor en desarrollo:

```cmd
npm run dev
```

El backend queda disponible en:

```text
http://localhost:3000
```

La ventana donde se ejecuta `npm run dev` debe mantenerse abierta durante las pruebas.

---

# 7. Healthcheck

El primer endpoint probado fue:

```http
GET /health
```

Comando:

```cmd
curl http://localhost:3000/health
```

Resultado obtenido:

```json
{
  "success": true,
  "message": "Servicio y base de datos activos",
  "data": {
    "db_time": "2026-08-22T05:42:07.630Z"
  }
}
```

### Resultado

Esta prueba confirmó que:

- Node.js estaba funcionando.
- Express estaba funcionando.
- El servidor estaba escuchando en el puerto `3000`.
- PostgreSQL estaba activo.
- El backend podía conectarse correctamente a la base de datos.

---

# 8. Autenticación temporal

El proyecto todavía no utiliza JWT para estas pruebas.

Actualmente se utilizan los headers:

```text
x-user-id
x-user-role
```

Roles contemplados:

```text
usuario
recepcionista
veterinario
admin
```

Ejemplo:

```cmd
curl -H "x-user-id: 1000000001" -H "x-user-role: usuario" http://localhost:3000/api/disponibilidad
```

Sin los headers, el backend respondió:

```json
{
  "success": false,
  "message": "Faltan headers x-user-id / x-user-role (autenticacion temporal mientras se integra JWT)",
  "code": "UNAUTHORIZED",
  "details": null
}
```

Esto confirmó que la autenticación temporal estaba funcionando.

---

# 9. Estructura de rutas

El archivo:

```text
app/routes/index.js
```

registra:

```javascript
router.use('/disponibilidad', disponibilidadRoutes);
router.use('/citas', citaRoutes);
```

Por lo tanto, las rutas principales son:

```text
/api/disponibilidad
/api/citas
```

---

# 10. Endpoints de Citas

## 10.1 Listar citas

```http
GET /api/citas
```

Ejemplo:

```cmd
curl -H "x-user-id: 1000000001" -H "x-user-role: usuario" http://localhost:3000/api/citas
```

El endpoint devolvió correctamente las citas registradas.

Los datos incluyen:

- `id_cita`
- `id_mascota`
- `id_disponibilidad`
- `id_recepcionista`
- `motivos`
- `estado`
- `fecha_registro`
- nombre y especie de la mascota
- fecha de la cita
- hora de inicio
- hora de finalización
- veterinario
- recepcionista

---

## 10.2 Obtener una cita

```http
GET /api/citas/{id}
```

Ejemplo:

```cmd
curl -H "x-user-id: 1000000001" -H "x-user-role: usuario" http://localhost:3000/api/citas/10
```

---

## 10.3 Consultar citas de un veterinario

```http
GET /api/citas/veterinario/{id_veterinario}
```

Ejemplo:

```cmd
curl -H "x-user-id: 2000000001" -H "x-user-role: veterinario" http://localhost:3000/api/citas/veterinario/2000000001
```

Esto permite consultar las citas asignadas a un veterinario.

---

## 10.4 Crear una cita

```http
POST /api/citas
```

Roles permitidos:

```text
usuario
recepcionista
admin
```

Body:

```json
{
  "id_mascota": 1,
  "id_disponibilidad": 9,
  "motivos": "Consulta de prueba desde Swagger"
}
```

La validación se realiza mediante Joi.

### Campos

| Campo | Tipo | Obligatorio |
|---|---|---|
| `id_mascota` | integer positivo | Sí |
| `id_disponibilidad` | integer positivo | Sí |
| `motivos` | string, máximo 1000 | No |

---

# 11. Prueba de creación de cita

Inicialmente se intentó crear una cita utilizando:

```json
{
  "id_mascota": 9,
  "id_disponibilidad": 9,
  "motivos": "Consulta de prueba"
}
```

El backend respondió:

```json
{
  "success": false,
  "message": "La mascota indicada no pertenece al usuario autenticado",
  "code": "FORBIDDEN",
  "details": null
}
```

Esto demostró que existe una validación de autorización adicional:

> La mascota debe pertenecer al usuario autenticado.

Posteriormente se utilizó una mascota válida:

```json
{
  "id_mascota": 1,
  "id_disponibilidad": 9,
  "motivos": "Consulta de prueba desde Swagger"
}
```

La cita fue creada correctamente.

Resultado posteriormente observado mediante `GET /api/citas`:

```json
{
  "id_cita": 10,
  "id_mascota": 1,
  "id_disponibilidad": 9,
  "id_recepcionista": "1000000001",
  "motivos": "Consulta de prueba desde Swagger",
  "estado": "p"
}
```

Por lo tanto:

```text
POST /api/citas
        ↓
Cita creada
        ↓
PostgreSQL
        ↓
GET /api/citas
        ↓
Cita 10 confirmada como persistida
```

---

# 12. Estados de una cita

El esquema `cita.schema.js` permite:

```text
p
c
cdo
```

Interpretación utilizada:

| Estado | Significado |
|---|---|
| `p` | Pendiente |
| `c` | Confirmada |
| `cdo` | Cancelada |

---

# 13. Cambiar estado de una cita

Endpoint:

```http
PATCH /api/citas/{id}/estado
```

Roles permitidos:

```text
recepcionista
veterinario
admin
```

Body:

```json
{
  "estado": "c"
}
```

Otros valores válidos:

```json
{
  "estado": "p"
}
```

o:

```json
{
  "estado": "cdo"
}
```

---

# 14. Endpoints de Disponibilidad

El archivo:

```text
app/routes/disponibilidad.routes.js
```

contiene:

```http
GET    /api/disponibilidad
GET    /api/disponibilidad/{id}
POST   /api/disponibilidad
PUT    /api/disponibilidad/{id}
DELETE /api/disponibilidad/{id}
```

---

## 14.1 Listar disponibilidad

```http
GET /api/disponibilidad
```

Ejemplo:

```cmd
curl -H "x-user-id: 1000000001" -H "x-user-role: usuario" http://localhost:3000/api/disponibilidad
```

La respuesta mostró disponibilidades correspondientes a varios veterinarios.

Entre los datos obtenidos:

```text
Ricardo Fonseca
Alejandra Nino
Esteban Salazar
```

y estados:

```text
ocupado
disponible
```

---

## 14.2 Obtener disponibilidad por ID

Ejemplo probado:

```cmd
curl -H "x-user-id: 1000000001" -H "x-user-role: usuario" http://localhost:3000/api/disponibilidad/9
```

Resultado:

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id_disponibilidad": 9,
    "id_usuario": "2000000003",
    "fecha": "2026-08-22T05:00:00.000Z",
    "estado": "disponible",
    "hora_inicio": "10:00:00",
    "hora_fin": "11:00:00"
  }
}
```

---

# 15. Observación sobre el filtrado de Disponibilidad

Durante las pruebas se observó que:

```http
GET /api/disponibilidad
```

devuelve disponibilidades de diferentes veterinarios.

Esto puede ser correcto porque el archivo `disponibilidad.routes.js` indica:

```javascript
// Lectura: cualquier rol autenticado puede consultar la agenda
```

Por lo tanto, actualmente la ruta permite consultar la agenda general.

Si el requerimiento funcional exige que un usuario vea únicamente determinados horarios, debe revisarse:

```text
app/controllers/disponibilidad.controller.js
app/services/
app/schemas/disponibilidad.schema.js
```

Antes de modificar el código, se debe confirmar la regla funcional esperada.

---

# 16. Ruta /api/mascotas

Se probó:

```cmd
curl -H "x-user-id: 1000000001" -H "x-user-role: usuario" http://localhost:3000/api/mascotas
```

Resultado:

```json
{
  "success": false,
  "message": "Ruta no encontrada: GET /api/mascotas",
  "code": "NOT_FOUND",
  "details": null
}
```

Esto ocurre porque actualmente `app/routes/index.js` solamente registra:

```javascript
router.use('/disponibilidad', disponibilidadRoutes);
router.use('/citas', citaRoutes);
```

No existe actualmente:

```text
/api/mascotas
```

---

# 17. Swagger / OpenAPI

Se agregaron las dependencias:

```cmd
npm install swagger-jsdoc swagger-ui-express
```

La configuración se creó en:

```text
app/config/swagger.js
```

La definición utiliza:

```text
OpenAPI 3.0.0
```

Información:

```text
Título: Huellitas Saludables API
Versión: 1.0.0
Servidor: http://localhost:3000
```

También se documentaron los parámetros reutilizables:

```text
x-user-id
x-user-role
```

---

# 18. Swagger UI

La interfaz se configuró para poder consultar la documentación de forma interactiva.

URL:

```text
http://localhost:3000/api-docs
```

Desde Swagger se pueden ejecutar las operaciones directamente contra el backend.

Para las rutas `/api` se deben configurar:

```text
x-user-id
x-user-role
```

Ejemplo:

```text
x-user-id: 1000000001
x-user-role: usuario
```

---

# 19. Documentación Swagger de Citas

Actualmente se documentaron las operaciones:

```text
GET    /api/citas
GET    /api/citas/{id}
GET    /api/citas/veterinario/{id_veterinario}
POST   /api/citas
PATCH  /api/citas/{id}/estado
```

La creación de una cita se probó exitosamente desde Swagger.

---

# 20. Documentación Swagger de Disponibilidad

Se agregaron anotaciones OpenAPI para que Swagger muestre:

```text
GET    /api/disponibilidad
GET    /api/disponibilidad/{id}
POST   /api/disponibilidad
PUT    /api/disponibilidad/{id}
DELETE /api/disponibilidad/{id}
```

Si Swagger solamente muestra Citas, normalmente significa que las rutas de Disponibilidad todavía no tienen las anotaciones `@swagger` correspondientes o que Swagger no está leyendo correctamente el archivo.

---

# 21. Pruebas con Lite Client

Lite Client puede utilizarse como cliente REST alternativo a Swagger.

Configuración general:

```text
Method: GET / POST / PUT / PATCH / DELETE
URL: http://localhost:3000/...
```

Headers:

```text
x-user-id: 1000000001
x-user-role: usuario
Content-Type: application/json
```

Para POST, por ejemplo:

```json
{
  "id_mascota": 1,
  "id_disponibilidad": 9,
  "motivos": "Consulta desde Lite Client"
}
```

---

# 22. Pruebas realizadas

## Prueba 1 — Healthcheck

```text
GET /health
```

Resultado:

```text
EXITOSA
```

---

## Prueba 2 — Endpoint sin autenticación

```text
GET /api/disponibilidad
```

Resultado:

```text
UNAUTHORIZED
```

Resultado esperado.

---

## Prueba 3 — Disponibilidad autenticada

```text
GET /api/disponibilidad
```

Resultado:

```text
EXITOSA
```

---

## Prueba 4 — Disponibilidad individual

```text
GET /api/disponibilidad/9
```

Resultado:

```text
EXITOSA
```

---

## Prueba 5 — Listar citas

```text
GET /api/citas
```

Resultado:

```text
EXITOSA
```

---

## Prueba 6 — Crear cita con mascota incorrecta

Resultado:

```text
FORBIDDEN
```

Resultado esperado.

---

## Prueba 7 — Crear cita con mascota válida

Resultado:

```text
EXITOSA
```

Se creó:

```text
id_cita = 10
```

---

# 23. Problemas encontrados y soluciones

| Problema | Resultado | Solución |
|---|---|---|
| Base inexistente | No se encontraba `huellitas_saludables` | Se utilizó la base correcta |
| Nombre con guion | `huellitas-saludables` no existía | Se utilizó `huellitas_saludables` |
| PostgreSQL ya iniciado | Existía `postmaster.pid` | Se dejó la instancia existente activa |
| Headers faltantes | `UNAUTHORIZED` | Se enviaron headers temporales |
| Mascota incorrecta | `FORBIDDEN` | Se utilizó una mascota perteneciente al usuario |
| `/api/mascotas` | `NOT_FOUND` | La ruta no existe actualmente |
| Swagger sin Disponibilidad | Solo aparecían Citas | Se agregaron anotaciones OpenAPI |

---

# 24. Checklist del proyecto

### Base de datos

- [x] PostgreSQL instalado
- [x] PostgreSQL activo
- [x] Base `huellitas_saludables`
- [x] Conexión desde backend
- [x] Tablas disponibles

### Backend

- [x] Node.js
- [x] npm
- [x] Dependencias instaladas
- [x] `.env`
- [x] Express
- [x] CORS
- [x] PostgreSQL mediante `pg`
- [x] Joi
- [x] Endpoint `/health`

### Autenticación

- [x] `x-user-id`
- [x] `x-user-role`
- [x] Validación de headers
- [ ] Integración JWT

### Citas

- [x] GET listar
- [x] GET por ID
- [x] GET por veterinario
- [x] POST crear
- [x] PATCH estado
- [x] Validación Joi
- [x] Validación de pertenencia de mascota
- [x] Persistencia en PostgreSQL

### Disponibilidad

- [x] GET listar
- [x] GET por ID
- [ ] Probar POST
- [ ] Probar PUT
- [ ] Probar DELETE
- [ ] Confirmar regla definitiva de filtrado

### Swagger

- [x] swagger-jsdoc
- [x] swagger-ui-express
- [x] OpenAPI 3
- [x] Citas documentadas
- [x] Disponibilidad documentada
- [x] Headers documentados
- [x] Prueba de creación de cita

### Lite Client

- [ ] Probar GET Citas
- [ ] Probar POST Citas
- [ ] Probar PATCH Citas
- [ ] Probar GET Disponibilidad
- [ ] Probar POST Disponibilidad
- [ ] Probar PUT Disponibilidad
- [ ] Probar DELETE Disponibilidad

---

# 25. Comandos de referencia

Entrar al proyecto:

```cmd
cd "C:\Users\Jorge Torres\Desktop\SENA JORGE TORRES 3°TRIMESTRE\BACKEND"
```

Instalar dependencias:

```cmd
npm install
```

Iniciar backend:

```cmd
npm run dev
```

Healthcheck:

```cmd
curl http://localhost:3000/health
```

Disponibilidad:

```cmd
curl -H "x-user-id: 1000000001" -H "x-user-role: usuario" http://localhost:3000/api/disponibilidad
```

Citas:

```cmd
curl -H "x-user-id: 1000000001" -H "x-user-role: usuario" http://localhost:3000/api/citas
```

Swagger:

```text
http://localhost:3000/api-docs
```

---

# 26. Conclusión

El backend de **Huellitas Saludables** quedó operativo para el módulo trabajado.

Se comprobó:

1. PostgreSQL funcionando.
2. Conexión del backend con PostgreSQL.
3. Express funcionando.
4. Variables de entorno correctamente configuradas.
5. Autenticación temporal mediante headers.
6. Consulta de disponibilidad.
7. Consulta de citas.
8. Validación de autorización sobre las mascotas.
9. Creación y persistencia de una nueva cita.
10. Consulta posterior de la cita creada.
11. Configuración de Swagger/OpenAPI.
12. Documentación interactiva de Citas y Disponibilidad.

El siguiente paso recomendado es completar las pruebas **POST, PUT y DELETE de Disponibilidad** tanto en Swagger como en Lite Client y registrar sus resultados en esta documentación.
