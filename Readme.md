# Huellitas Saludables — Backend (Módulo Citas + Disponibilidad)

Backend en **Node.js + Express**, conectado directamente a **PostgreSQL**
(sin ORM, SQL puro con el driver `pg`), implementando el módulo de
**Citas + Disponibilidad** según el PDF *Taller Diagnóstico Inicial del
Proyecto de Software* y el modelo entidad-relación real del proyecto
(`database/huellitas_saludables_backup.sql`).

> ⚠️ El backup entregado es un dump de **PostgreSQL** (`pg_dump`), no de
> MySQL. Todo este módulo está escrito para PostgreSQL (tipos `SERIAL`,
> `timestamp`, `time`, sintaxis `$1,$2,...`).

## Requisitos funcionales cubiertos

| RF | Requisito | Dónde está implementado |
|----|-----------|--------------------------|
| RF07 | El dueño podrá solicitar citas veterinarias según disponibilidad del sistema. | `POST /api/citas` → `services/cita.service.js#solicitar` |
| RF08 | El agendador podrá gestionar la disponibilidad y organizar la agenda de los veterinarios. | `routes/disponibilidad.routes.js` (CRUD completo) |
| RF09 | El agendador podrá notificar a los veterinarios sobre sus citas, cambios y disponibilidad horaria. | `services/notificacion.service.js` (stub, se invoca automáticamente al crear cita, cambiar estado de cita y cambiar estado de disponibilidad) |
| RF10 | El veterinario podrá consultar las citas que tiene asignadas. | `GET /api/citas/veterinario/:id_veterinario` |
| RF15 | Registro de acciones de administradores/agendadores para auditoría. | `middlewares/auditLog.js` (log estructurado; ver nota abajo) |

## Estructura de carpetas

```
BACKEND/
├── app/
│   ├── config/database.js        # Pool pg, sin ORM
│   ├── controllers/               # Traducción HTTP <-> service
│   ├── middlewares/                # identifyUser, validate, auditLog, errorHandler
│   ├── models/                     # SQL puro por tabla
│   ├── routes/                     # Definición de endpoints
│   ├── schemas/                    # Validación con Joi
│   ├── services/                   # Reglas de negocio
│   ├── app.js                      # Configuración de Express
│   └── server.js                   # Arranque del servidor
├── database/
│   └── huellitas_saludables_backup.sql
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

Cada carpeta tiene una única responsabilidad (principio de responsabilidad
única): `models` solo habla SQL, `services` solo tiene reglas de negocio,
`controllers` solo traduce request/response, `routes` solo declara el
mapa de endpoints + middlewares.

## Puesta en marcha

```bash
cd BACKEND
npm install
cp .env.example .env      # ajustar credenciales de tu PostgreSQL local
# la base de datos ya existe en el dump: restaurarla con
#   psql -U postgres -d huellitas_saludables -f database/huellitas_saludables_backup.sql
npm run dev                # con nodemon
# o
npm start
```

Verifica que todo esté arriba:

```bash
curl http://localhost:3000/health
```

## Autenticación temporal (⚠️ placeholder)

El módulo de login/JWT **no está incluido** en este entregable (solo
Citas + Disponibilidad). Para poder probar los endpoints protegidos por
rol sin bloquear el desarrollo, `middlewares/identifyUser.js` simula el
usuario autenticado leyendo dos headers:

```
x-user-id:   1000000001        # id_usuario tal cual está en la tabla usuario
x-user-role: usuario            # usuario | veterinario | recepcionista | admin
```

Cuando se integre JWT real, basta con reemplazar `identifyUser.js` por un
middleware que decodifique el token y llene `req.user = { id, rol }` de
la misma forma — el resto del código (`requireRole`, services,
controllers) no cambia.

Usuarios de ejemplo ya cargados en el dump:

| id_usuario | rol | nombre |
|---|---|---|
| 1000000001 | usuario (dueño) | Carlos Ramirez |
| 2000000001 | veterinario | Ricardo Fonseca |
| 3000000001 | recepcionista | Katherine Pena |

## Endpoints

Prefijo común: `/api`. Todos requieren los headers `x-user-id` /
`x-user-role` salvo `/health`.

### Disponibilidad (RF08)

| Método | Ruta | Rol requerido | Descripción |
|---|---|---|---|
| GET | `/disponibilidad` | cualquiera autenticado | Lista, admite filtros `?id_usuario=&fecha=&estado=` |
| GET | `/disponibilidad/:id` | cualquiera autenticado | Detalle |
| POST | `/disponibilidad` | recepcionista, admin | Crea franja para un veterinario |
| PUT | `/disponibilidad/:id` | recepcionista, admin | Actualiza franja (valida solapes de horario) |
| DELETE | `/disponibilidad/:id` | recepcionista, admin | Elimina franja (no permite si está `ocupado`) |

Body `POST /disponibilidad`:
```json
{
  "id_usuario": "2000000001",
  "fecha": "2026-09-01",
  "hora_inicio": "08:00",
  "hora_fin": "09:00",
  "estado": "disponible"
}
```

### Citas (RF07, RF10)

| Método | Ruta | Rol requerido | Descripción |
|---|---|---|---|
| GET | `/citas` | cualquiera autenticado | Lista, admite filtros `?id_mascota=&estado=&fecha=` |
| GET | `/citas/:id` | cualquiera autenticado | Detalle |
| GET | `/citas/veterinario/:id_veterinario` | cualquiera autenticado | RF10: citas asignadas al veterinario |
| POST | `/citas` | usuario, recepcionista, admin | RF07: solicita cita sobre una franja `disponible` |
| PATCH | `/citas/:id/estado` | recepcionista, veterinario, admin | Cambia estado (`p`/`c`/`cdo`) |

Body `POST /citas`:
```json
{
  "id_mascota": 1,
  "id_disponibilidad": 3,
  "motivos": "Consulta de rutina"
}
```

`solicitar()` corre en **una transacción**: valida que la franja siga
`disponible` (con `SELECT ... FOR UPDATE` para evitar condiciones de
carrera si dos personas reservan al mismo tiempo), inserta la cita y
marca la disponibilidad como `ocupado`. Si algo falla, se hace
`ROLLBACK` completo.

Body `PATCH /citas/:id/estado`:
```json
{ "estado": "cdo" }
```
Al pasar a `cdo` (cancelada) se libera automáticamente la franja de
disponibilidad asociada (vuelve a `disponible`), también en transacción.

> **Nota sobre `estado`**: el `CHECK` real de la base de datos solo
> permite `'p' | 'c' | 'cdo'`. En este módulo se documentan como
> `pendiente | confirmada | cancelada`. Si el equipo definió otro
> significado, solo hay que actualizar los comentarios en
> `schemas/cita.schema.js`, no la lógica.

## Auditoría (RF15)

`middlewares/auditLog.js` registra en consola cada operación de
escritura (`POST/PUT/PATCH/DELETE`) hecha por `recepcionista` o `admin`,
con usuario, acción y resultado. El modelo entidad-relación actual
**no tiene todavía una tabla `auditoria`**; el TODO en ese archivo indica
exactamente dónde reemplazar el `console.log` por un `INSERT` real
cuando esa tabla se agregue, sin tocar el resto del módulo.

## Notificaciones (RF09)

`services/notificacion.service.js` es un stub que loggea la
notificación (destinatario, asunto, mensaje). Se invoca automáticamente:
- al crear una cita (avisa al veterinario asignado),
- al cambiar el estado de una cita,
- al cambiar el estado de una franja de disponibilidad.

Cuando exista un proveedor real (correo/SMS/push) solo se reemplaza la
función `enviar()`.

## Pruebas manuales sugeridas (Postman/curl)

1. `GET /health` → confirma conexión a la BD.
2. Con `x-user-id: 3000000001`, `x-user-role: recepcionista`:
   `POST /api/disponibilidad` para crear una franja del veterinario
   `2000000001`.
3. Con `x-user-id: 1000000001`, `x-user-role: usuario`:
   `POST /api/citas` usando el `id_disponibilidad` recién creado y una
   mascota que le pertenezca (ver tabla `mascota_usuario` del dump).
4. Repetir el mismo `POST /api/citas` → debe responder `409 CONFLICT`
   (la franja ya quedó `ocupado`).
5. Con `x-user-id: 2000000001`, `x-user-role: veterinario`:
   `GET /api/citas/veterinario/2000000001` → debe listar la cita creada.
6. Con `x-user-id: 3000000001`, `x-user-role: recepcionista`:
   `PATCH /api/citas/:id/estado` con `{ "estado": "cdo" }` → cancela y
   libera la disponibilidad.

## Pendiente para siguientes fases

- Módulo de autenticación real (login + JWT) para reemplazar
  `identifyUser.js`.
- Tabla `auditoria` en el modelo de datos + INSERT real en
  `auditLog.js`.
- Proveedor real de notificaciones en `notificacion.service.js`.
- Pruebas automatizadas (unitarias sobre `services/`, integración sobre
  `app.js` con supertest).
