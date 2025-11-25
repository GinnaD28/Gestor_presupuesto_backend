# Guía para Probar los Endpoints - Expense Tracker Pro

## 🔐 Endpoints de Autenticación

### 1. Registrar Usuario
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "Password123"
  }'
```

**Respuesta esperada:**
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

### 2. Iniciar Sesión
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "Password123"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**⚠️ IMPORTANTE:** Guarda el `token` de la respuesta para usarlo en los siguientes endpoints.

---

## 💰 Endpoints de Gastos (Requieren Autenticación)

**Reemplaza `TU_TOKEN_AQUI` con el token que obtuviste del login/register**

### 3. Obtener Todos los Gastos
```bash
curl -X GET http://localhost:3000/expenses \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 4. Obtener un Gasto por ID
```bash
curl -X GET http://localhost:3000/expenses/1 \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 5. Crear un Nuevo Gasto
```bash
curl -X POST http://localhost:3000/expenses \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Compra supermercado",
    "amount": 150.50,
    "category": "Alimentación",
    "date": "2024-01-15T10:00:00Z",
    "method": "Tarjeta",
    "description": "Compra semanal de alimentos"
  }'
```

### 6. Actualizar un Gasto
```bash
curl -X PUT http://localhost:3000/expenses/1 \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Supermercado actualizado",
    "amount": 175.00
  }'
```

### 7. Eliminar un Gasto
```bash
curl -X DELETE http://localhost:3000/expenses/1 \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 8. Filtrar Gastos por Categoría
```bash
curl -X GET "http://localhost:3000/expenses?category=Alimentación" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 9. Filtrar Gastos por Rango de Fechas
```bash
curl -X GET "http://localhost:3000/expenses?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 📂 Endpoints de Categorías (Requieren Autenticación)

### 10. Obtener Todas las Categorías
```bash
curl -X GET http://localhost:3000/categories \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 11. Crear una Nueva Categoría
```bash
curl -X POST http://localhost:3000/categories \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Transporte"
  }'
```

---

## 📊 Endpoints de Reportes (Requieren Autenticación)

### 12. Generar PDF de Gastos
```bash
curl -X GET http://localhost:3000/reports/expenses-pdf \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  --output reporte-gastos.pdf
```

### 13. Generar PDF con Filtro de Fechas
```bash
curl -X GET "http://localhost:3000/reports/expenses-pdf?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  --output reporte-enero.pdf
```

---

## 🏥 Endpoint de Salud

### 14. Verificar que el Servidor Está Funcionando
```bash
curl -X GET http://localhost:3000/health
```

**Respuesta esperada:**
```json
{
  "status": "OK",
  "message": "Expense Tracker Pro API está funcionando",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

---

## 📝 Notas Importantes

1. **Token JWT**: Todos los endpoints excepto `/auth/register`, `/auth/login` y `/health` requieren el header `Authorization: Bearer <token>`

2. **Formato de Fechas**: Usa formato ISO 8601: `2024-01-15T10:00:00Z`

3. **Puerto**: Si cambiaste el puerto en `.env`, ajusta las URLs (por defecto es 3000)

4. **Errores Comunes**:
   - `401 Unauthorized`: Token inválido o expirado
   - `400 Bad Request`: Error de validación (revisa el formato de los datos)
   - `404 Not Found`: El recurso no existe o la ruta es incorrecta

