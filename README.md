# Expense Tracker Pro - Backend API

Backend profesional desarrollado con Node.js, Express, Prisma y PostgreSQL para la gestión de gastos personales.

## 🚀 Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación con tokens
- **bcryptjs** - Hash de contraseñas
- **express-validator** - Validación de datos
- **pdfkit** - Generación de reportes PDF

## 📋 Prerrequisitos

- Node.js (v18 o superior)
- PostgreSQL (v14 o superior)
- npm o yarn

## 🔧 Instalación

1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd expense-tracker-api
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
```bash
cp .env .env.local
# Editar .env.local con tus credenciales de base de datos
```

4. Configurar la base de datos
```bash
# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate
```

5. Iniciar el servidor
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
expense-tracker-api/
├── src/
│   ├── controllers/    # Lógica de controladores
│   ├── routes/         # Definición de rutas
│   ├── services/       # Lógica de negocio
│   ├── middleware/     # Middlewares personalizados
│   ├── validators/     # Validaciones con express-validator
│   ├── config/         # Configuraciones
│   ├── utils/          # Utilidades
│   ├── app.js          # Configuración de Express
│   └── server.js       # Punto de entrada
├── prisma/
│   └── schema.prisma   # Schema de Prisma
└── package.json
```

## 🔐 Endpoints de Autenticación

### POST /auth/register
Registrar un nuevo usuario
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "contraseña123"
}
```

### POST /auth/login
Iniciar sesión
```json
{
  "email": "juan@example.com",
  "password": "contraseña123"
}
```

## 💰 Endpoints de Gastos

### GET /expenses
Obtener todos los gastos del usuario autenticado

### GET /expenses/:id
Obtener un gasto específico

### POST /expenses
Crear un nuevo gasto
```json
{
  "title": "Compra supermercado",
  "amount": 150.50,
  "category": "Alimentación",
  "date": "2024-01-15T10:00:00Z",
  "method": "Tarjeta",
  "description": "Compra semanal"
}
```

### PUT /expenses/:id
Actualizar un gasto existente

### DELETE /expenses/:id
Eliminar un gasto

## 📂 Endpoints de Categorías

### GET /categories
Obtener todas las categorías

### POST /categories
Crear una nueva categoría
```json
{
  "name": "Transporte"
}
```

## 📊 Endpoints de Reportes

### GET /reports/expenses-pdf
Generar y descargar un PDF con todos los gastos del usuario

## 🔒 Autenticación

La mayoría de los endpoints requieren autenticación. Incluye el token JWT en el header:

```
Authorization: Bearer <tu_token_jwt>
```

## 🛠️ Scripts Disponibles

- `npm run dev` - Iniciar servidor en modo desarrollo con nodemon
- `npm start` - Iniciar servidor en producción
- `npm run prisma:generate` - Generar cliente de Prisma
- `npm run prisma:migrate` - Ejecutar migraciones
- `npm run prisma:studio` - Abrir Prisma Studio

## 📝 Notas

- Asegúrate de cambiar el `JWT_SECRET` en producción
- Configura correctamente la `DATABASE_URL` en el archivo `.env`
- Las migraciones de Prisma se ejecutan automáticamente en desarrollo

## 📄 Licencia

ISC


