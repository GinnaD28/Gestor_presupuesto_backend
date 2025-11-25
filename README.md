# Expense Tracker Pro - Backend API

API REST para la gestión de gastos personales con autenticación JWT, validación de datos y generación de reportes PDF.

## 🚀 Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación con tokens
- **bcryptjs** - Hash de contraseñas
- **express-validator** - Validación de datos
- **pdfkit** - Generación de reportes PDF

## 📁 Estructura del Proyecto

```
expense-tracker-api/
├── src/
│   ├── controllers/    # Controladores de endpoints
│   ├── routes/         # Definición de rutas
│   ├── services/       # Lógica de negocio
│   ├── middleware/     # Middlewares (auth, errores)
│   ├── validators/     # Validaciones de datos
│   ├── config/         # Configuración (DB)
│   ├── utils/          # Utilidades (PDF)
│   ├── app.js          # Configuración de Express
│   └── server.js       # Punto de entrada
├── prisma/
│   └── schema.prisma   # Schema de base de datos
└── package.json
```

## 🔧 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
# Editar .env con DATABASE_URL y JWT_SECRET

# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Iniciar servidor
npm run dev
```

## 🛠️ Scripts

- `npm run dev` - Servidor en desarrollo (nodemon)
- `npm start` - Servidor en producción
- `npm run prisma:generate` - Generar cliente Prisma
- `npm run prisma:migrate` - Ejecutar migraciones
- `npm run prisma:studio` - Abrir Prisma Studio

## 📚 Documentación

- **API Documentation:** Ver `API-DOCUMENTATION.md`
- **Postman Guide:** Ver `POSTMAN-GUIDE.md`
- **OpenAPI Spec:** Ver `openapi.yaml`

## 🔑 Endpoints Principales

- **Auth:** `/auth/register`, `/auth/login`
- **Expenses:** `/expenses` (GET, POST, PUT, DELETE)
- **Categories:** `/categories` (GET, POST)
- **Reports:** `/reports/expenses-pdf` (GET)
- **Health:** `/health` (GET)
