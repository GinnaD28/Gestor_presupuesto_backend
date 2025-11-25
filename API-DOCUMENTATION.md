# 📚 Documentación REST API - Expense Tracker Pro

**Versión:** 1.0.0  
**Base URL:** `http://localhost:3000`  
**Formato de Datos:** JSON

---

## 📋 Tabla de Contenidos

1. [Información General](#información-general)
2. [Autenticación](#autenticación)
3. [Códigos de Estado HTTP](#códigos-de-estado-http)
4. [Formato de Respuestas](#formato-de-respuestas)
5. [Endpoints de Autenticación](#endpoints-de-autenticación)
6. [Endpoints de Gastos](#endpoints-de-gastos)
7. [Endpoints de Categorías](#endpoints-de-categorías)
8. [Endpoints de Reportes](#endpoints-de-reportes)
9. [Endpoints de Salud](#endpoints-de-salud)
10. [Manejo de Errores](#manejo-de-errores)

---

## 🔍 Información General

### Descripción
API REST para la gestión de gastos personales con autenticación JWT, validación de datos, y generación de reportes PDF.

### Características
- Autenticación basada en JWT (JSON Web Tokens)
- Validación de datos con express-validator
- Hash de contraseñas con bcryptjs
- Generación de reportes PDF
- Filtrado y búsqueda de gastos
- Arquitectura modular y escalable

### Tecnologías
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT
- PDFKit

---

## 🔐 Autenticación

La mayoría de los endpoints requieren autenticación mediante JWT. Para autenticarte:

1. Registra un usuario o inicia sesión usando los endpoints `/auth/register` o `/auth/login`
2. Copia el `token` de la respuesta
3. Incluye el token en el header `Authorization` de todas las solicitudes protegidas:

```
Authorization: Bearer <tu_token_jwt>
```

### Ejemplo
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYxMDk2ODAwMCwiZXhwIjoxNjExNTcyODAwfQ...
```

---

## 📊 Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| `200` | OK - Solicitud exitosa |
| `201` | Created - Recurso creado exitosamente |
| `400` | Bad Request - Error de validación o datos inválidos |
| `401` | Unauthorized - Token inválido o no proporcionado |
| `404` | Not Found - Recurso no encontrado |
| `409` | Conflict - Recurso ya existe (duplicado) |
| `500` | Internal Server Error - Error del servidor |

---

## 📦 Formato de Respuestas

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": {
    // Datos del recurso
  }
}
```

### Respuesta con Lista
```json
{
  "success": true,
  "count": 10,
  "data": [
    // Array de recursos
  ]
}
```

### Respuesta de Error
```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [
    {
      "field": "campo",
      "message": "Mensaje de error específico"
    }
  ]
}
```

---

## 🔑 Endpoints de Autenticación

### POST /auth/register

Registra un nuevo usuario en el sistema.

**Autenticación:** No requerida

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Password123"
}
```

**Validaciones:**
- `name`: Opcional, entre 2 y 100 caracteres
- `email`: Requerido, formato de email válido
- `password`: Requerido, mínimo 6 caracteres, debe contener al menos una mayúscula, una minúscula y un número

**Response 201 (Created):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "createdAt": "2024-01-15T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response 400 (Bad Request):**
```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    {
      "field": "email",
      "message": "Debe ser un email válido"
    },
    {
      "field": "password",
      "message": "La contraseña debe tener al menos 6 caracteres"
    }
  ]
}
```

**Response 409 (Conflict):**
```json
{
  "success": false,
  "message": "El email ya está registrado"
}
```

---

### POST /auth/login

Inicia sesión con email y contraseña.

**Autenticación:** No requerida

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "Password123"
}
```

**Validaciones:**
- `email`: Requerido, formato de email válido
- `password`: Requerido

**Response 200 (OK):**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "createdAt": "2024-01-15T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response 401 (Unauthorized):**
```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

---

## 💰 Endpoints de Gastos

Todos los endpoints de gastos requieren autenticación JWT.

### GET /expenses

Obtiene todos los gastos del usuario autenticado.

**Autenticación:** Requerida

**Query Parameters:**
| Parámetro | Tipo | Descripción | Requerido |
|-----------|------|-------------|-----------|
| `category` | string | Filtrar por categoría | No |
| `startDate` | string | Fecha inicial (ISO 8601) | No |
| `endDate` | string | Fecha final (ISO 8601) | No |

**Ejemplos de URL:**
- `GET /expenses`
- `GET /expenses?category=Alimentación`
- `GET /expenses?startDate=2024-01-01&endDate=2024-01-31`
- `GET /expenses?category=Transporte&startDate=2024-01-01&endDate=2024-01-31`

**Response 200 (OK):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "title": "Compra supermercado",
      "amount": 150.50,
      "category": "Alimentación",
      "date": "2024-01-15T10:00:00.000Z",
      "method": "Tarjeta",
      "description": "Compra semanal de alimentos",
      "userId": 1,
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

**Response 401 (Unauthorized):**
```json
{
  "success": false,
  "message": "Token de autenticación requerido"
}
```

---

### GET /expenses/:id

Obtiene un gasto específico por su ID.

**Autenticación:** Requerida

**Path Parameters:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | integer | ID del gasto |

**Response 200 (OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Compra supermercado",
    "amount": 150.50,
    "category": "Alimentación",
    "date": "2024-01-15T10:00:00.000Z",
    "method": "Tarjeta",
    "description": "Compra semanal de alimentos",
    "userId": 1,
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Response 404 (Not Found):**
```json
{
  "success": false,
  "message": "Gasto no encontrado"
}
```

---

### POST /expenses

Crea un nuevo gasto.

**Autenticación:** Requerida

**Request Body:**
```json
{
  "title": "Compra supermercado",
  "amount": 150.50,
  "category": "Alimentación",
  "date": "2024-01-15T10:00:00Z",
  "method": "Tarjeta",
  "description": "Compra semanal de alimentos"
}
```

**Validaciones:**
- `title`: Requerido, entre 1 y 200 caracteres
- `amount`: Requerido, número positivo mayor a 0
- `category`: Requerido, entre 1 y 100 caracteres
- `date`: Requerido, formato ISO 8601
- `method`: Opcional, máximo 50 caracteres
- `description`: Opcional, máximo 500 caracteres

**Response 201 (Created):**
```json
{
  "success": true,
  "message": "Gasto creado exitosamente",
  "data": {
    "id": 1,
    "title": "Compra supermercado",
    "amount": 150.50,
    "category": "Alimentación",
    "date": "2024-01-15T10:00:00.000Z",
    "method": "Tarjeta",
    "description": "Compra semanal de alimentos",
    "userId": 1,
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Response 400 (Bad Request):**
```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    {
      "field": "title",
      "message": "El título es requerido"
    },
    {
      "field": "amount",
      "message": "El monto debe ser un número positivo mayor a 0"
    }
  ]
}
```

---

### PUT /expenses/:id

Actualiza un gasto existente.

**Autenticación:** Requerida

**Path Parameters:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | integer | ID del gasto |

**Request Body:** (Todos los campos son opcionales)
```json
{
  "title": "Supermercado actualizado",
  "amount": 175.00,
  "category": "Alimentación",
  "date": "2024-01-16T10:00:00Z",
  "method": "Efectivo",
  "description": "Compra mensual actualizada"
}
```

**Validaciones:** (Mismas que POST, pero todos opcionales)

**Response 200 (OK):**
```json
{
  "success": true,
  "message": "Gasto actualizado exitosamente",
  "data": {
    "id": 1,
    "title": "Supermercado actualizado",
    "amount": 175.00,
    "category": "Alimentación",
    "date": "2024-01-16T10:00:00.000Z",
    "method": "Efectivo",
    "description": "Compra mensual actualizada",
    "userId": 1,
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Response 404 (Not Found):**
```json
{
  "success": false,
  "message": "Gasto no encontrado"
}
```

---

### DELETE /expenses/:id

Elimina un gasto.

**Autenticación:** Requerida

**Path Parameters:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | integer | ID del gasto |

**Response 200 (OK):**
```json
{
  "success": true,
  "message": "Gasto eliminado exitosamente"
}
```

**Response 404 (Not Found):**
```json
{
  "success": false,
  "message": "Gasto no encontrado"
}
```

---

## 📂 Endpoints de Categorías

Todos los endpoints de categorías requieren autenticación JWT.

### GET /categories

Obtiene todas las categorías disponibles.

**Autenticación:** Requerida

**Response 200 (OK):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "name": "Alimentación",
      "createdAt": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Transporte",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### POST /categories

Crea una nueva categoría.

**Autenticación:** Requerida

**Request Body:**
```json
{
  "name": "Transporte"
}
```

**Validaciones:**
- `name`: Requerido, entre 1 y 100 caracteres, único

**Response 201 (Created):**
```json
{
  "success": true,
  "message": "Categoría creada exitosamente",
  "data": {
    "id": 1,
    "name": "Transporte",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Response 400 (Bad Request):**
```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    {
      "field": "name",
      "message": "El nombre de la categoría es requerido"
    }
  ]
}
```

**Response 409 (Conflict):**
```json
{
  "success": false,
  "message": "El registro ya existe"
}
```

---

## 📊 Endpoints de Reportes

Todos los endpoints de reportes requieren autenticación JWT.

### GET /reports/expenses-pdf

Genera y descarga un PDF con todos los gastos del usuario autenticado.

**Autenticación:** Requerida

**Query Parameters:**
| Parámetro | Tipo | Descripción | Requerido |
|-----------|------|-------------|-----------|
| `startDate` | string | Fecha inicial (ISO 8601) | No |
| `endDate` | string | Fecha final (ISO 8601) | No |

**Ejemplos de URL:**
- `GET /reports/expenses-pdf`
- `GET /reports/expenses-pdf?startDate=2024-01-01&endDate=2024-01-31`

**Response 200 (OK):**
- **Content-Type:** `application/pdf`
- **Content-Disposition:** `attachment; filename="gastos_YYYY-MM-DD.pdf"`
- **Body:** Archivo PDF binario

El PDF incluye:
- Información del usuario
- Resumen de gastos (total, promedio, cantidad)
- Gastos por categoría
- Tabla detallada de todos los gastos

**Response 401 (Unauthorized):**
```json
{
  "success": false,
  "message": "Token de autenticación requerido"
}
```

---

## 🏥 Endpoints de Salud

### GET /health

Verifica el estado del servidor.

**Autenticación:** No requerida

**Response 200 (OK):**
```json
{
  "status": "OK",
  "message": "Expense Tracker Pro API está funcionando",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

---

## ⚠️ Manejo de Errores

### Errores de Validación (400)

Cuando los datos enviados no cumplen con las validaciones:

```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    {
      "field": "email",
      "message": "Debe ser un email válido"
    }
  ]
}
```

### Errores de Autenticación (401)

**Token no proporcionado:**
```json
{
  "success": false,
  "message": "Token de autenticación requerido"
}
```

**Token inválido:**
```json
{
  "success": false,
  "message": "Token inválido"
}
```

**Token expirado:**
```json
{
  "success": false,
  "message": "Token expirado"
}
```

### Errores de Recurso No Encontrado (404)

```json
{
  "success": false,
  "message": "Gasto no encontrado"
}
```

### Errores de Conflicto (409)

Cuando se intenta crear un recurso que ya existe:

```json
{
  "success": false,
  "message": "El email ya está registrado"
}
```

o

```json
{
  "success": false,
  "message": "El registro ya existe"
}
```

### Errores del Servidor (500)

```json
{
  "success": false,
  "message": "Error interno del servidor",
  "error": "Detalles del error (solo en desarrollo)"
}
```

---

## 📝 Notas Importantes

### Formato de Fechas
Todas las fechas deben estar en formato **ISO 8601**:
- `2024-01-15T10:00:00Z`
- `2024-01-15T10:00:00.000Z`

### Tokens JWT
- Los tokens expiran según la configuración en `JWT_EXPIRES_IN` (por defecto: 7 días)
- Si el token expira, debes hacer login nuevamente
- El token debe incluirse en el header `Authorization` con el prefijo `Bearer`

### Validación de Contraseñas
Las contraseñas deben cumplir:
- Mínimo 6 caracteres
- Al menos una letra mayúscula
- Al menos una letra minúscula
- Al menos un número

### Filtrado de Gastos
Puedes combinar múltiples filtros:
- Por categoría: `?category=Alimentación`
- Por rango de fechas: `?startDate=2024-01-01&endDate=2024-01-31`
- Ambos: `?category=Alimentación&startDate=2024-01-01&endDate=2024-01-31`

---

## 🔄 Flujo de Uso Típico

1. **Registrar usuario** → `POST /auth/register`
2. **Obtener token** → Guardar el token de la respuesta
3. **Crear categorías** → `POST /categories` (opcional)
4. **Crear gastos** → `POST /expenses`
5. **Listar gastos** → `GET /expenses`
6. **Generar reporte** → `GET /reports/expenses-pdf`

---

## 📞 Soporte

Para más información o soporte, consulta el README.md del proyecto.

---

**Última actualización:** Enero 2024  
**Versión de la API:** 1.0.0

