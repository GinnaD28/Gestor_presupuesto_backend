# 📮 Guía Completa para Postman - Expense Tracker Pro

**Base URL:** `http://localhost:3000`

---

## 🔐 AUTENTICACIÓN

### 1. Registrar Usuario
- **Método:** `POST`
- **URL:** `http://localhost:3000/auth/register`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (JSON):**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Password123"
}
```

---

### 2. Iniciar Sesión
- **Método:** `POST`
- **URL:** `http://localhost:3000/auth/login`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (JSON):**
```json
{
  "email": "juan@example.com",
  "password": "Password123"
}
```

**⚠️ IMPORTANTE:** Copia el `token` de la respuesta para usarlo en los siguientes endpoints.

---

## 💰 GASTOS (Requieren Token)

### 3. Obtener Todos los Gastos
- **Método:** `GET`
- **URL:** `http://localhost:3000/expenses`
- **Headers:**
  ```
  Authorization: Bearer TU_TOKEN_AQUI
  ```
- **Body:** No requiere body

---

### 4. Obtener un Gasto por ID
- **Método:** `GET`
- **URL:** `http://localhost:3000/expenses/1`
- **Headers:**
  ```
  Authorization: Bearer TU_TOKEN_AQUI
  ```
- **Body:** No requiere body
- **Nota:** Reemplaza `1` con el ID del gasto que quieres obtener

---

### 5. Crear un Nuevo Gasto
- **Método:** `POST`
- **URL:** `http://localhost:3000/expenses`
- **Headers:**
  ```
  Authorization: Bearer TU_TOKEN_AQUI
  Content-Type: application/json
  ```
- **Body (JSON):**
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

**Ejemplo alternativo (mínimo requerido):**
```json
{
  "title": "Gasolina",
  "amount": 45.00,
  "category": "Transporte",
  "date": "2024-01-15T10:00:00Z"
}
```

---

### 6. Actualizar un Gasto
- **Método:** `PUT`
- **URL:** `http://localhost:3000/expenses/1`
- **Headers:**
  ```
  Authorization: Bearer TU_TOKEN_AQUI
  Content-Type: application/json
  ```
- **Body (JSON):** (Todos los campos son opcionales, solo envía los que quieres actualizar)
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

**Ejemplo de actualización parcial:**
```json
{
  "amount": 200.00
}
```

---

### 7. Eliminar un Gasto
- **Método:** `DELETE`
- **URL:** `http://localhost:3000/expenses/1`
- **Headers:**
  ```
  Authorization: Bearer TU_TOKEN_AQUI
  ```
- **Body:** No requiere body
- **Nota:** Reemplaza `1` con el ID del gasto que quieres eliminar

---

### 8. Filtrar Gastos por Categoría
- **Método:** `GET`
- **URL:** `http://localhost:3000/expenses?category=Alimentación`
- **Headers:**
  ```
  Authorization: Bearer TU_TOKEN_AQUI
  ```
- **Body:** No requiere body
- **Query Params:**
  - `category`: Nombre de la categoría (ej: "Alimentación", "Transporte")

---

### 9. Filtrar Gastos por Rango de Fechas
- **Método:** `GET`
- **URL:** `http://localhost:3000/expenses?startDate=2024-01-01&endDate=2024-01-31`
- **Headers:**
  ```
  Authorization: Bearer TU_TOKEN_AQUI
  ```
- **Body:** No requiere body
- **Query Params:**
  - `startDate`: Fecha inicial (formato: YYYY-MM-DD o ISO 8601)
  - `endDate`: Fecha final (formato: YYYY-MM-DD o ISO 8601)

---

### 10. Filtrar Gastos por Categoría y Fechas
- **Método:** `GET`
- **URL:** `http://localhost:3000/expenses?category=Alimentación&startDate=2024-01-01&endDate=2024-01-31`
- **Headers:**
  ```
  Authorization: Bearer TU_TOKEN_AQUI
  ```
- **Body:** No requiere body

---

## 📂 CATEGORÍAS (Requieren Token)

### 11. Obtener Todas las Categorías
- **Método:** `GET`
- **URL:** `http://localhost:3000/categories`
- **Headers:**
  ```
  Authorization: Bearer TU_TOKEN_AQUI
  ```
- **Body:** No requiere body

---

### 12. Crear una Nueva Categoría
- **Método:** `POST`
- **URL:** `http://localhost:3000/categories`
- **Headers:**
  ```
  Authorization: Bearer TU_TOKEN_AQUI
  Content-Type: application/json
  ```
- **Body (JSON):**
```json
{
  "name": "Transporte"
}
```

**Más ejemplos de categorías:**
```json
{
  "name": "Entretenimiento"
}
```

```json
{
  "name": "Salud"
}
```

```json
{
  "name": "Educación"
}
```

---

## 📊 REPORTES (Requieren Token)

### 13. Generar PDF de Gastos
- **Método:** `GET`
- **URL:** `http://localhost:3000/reports/expenses-pdf`
- **Headers:**
  ```
  Authorization: Bearer TU_TOKEN_AQUI
  ```
- **Body:** No requiere body
- **Nota:** El PDF se descargará automáticamente. En Postman, haz click en "Send and Download" o guarda la respuesta.

---

### 14. Generar PDF con Filtro de Fechas
- **Método:** `GET`
- **URL:** `http://localhost:3000/reports/expenses-pdf?startDate=2024-01-01&endDate=2024-01-31`
- **Headers:**
  ```
  Authorization: Bearer TU_TOKEN_AQUI
  ```
- **Body:** No requiere body
- **Query Params:**
  - `startDate`: Fecha inicial
  - `endDate`: Fecha final

---

## 🏥 SALUD DEL SERVIDOR

### 15. Verificar que el Servidor Está Funcionando
- **Método:** `GET`
- **URL:** `http://localhost:3000/health`
- **Headers:** No requiere headers
- **Body:** No requiere body

---

## 📝 CONFIGURACIÓN EN POSTMAN

### Configurar Variable de Token (Recomendado)

1. Después de hacer Login o Register, copia el token de la respuesta
2. En Postman, ve a la pestaña "Tests" del request de Login/Register
3. Agrega este código:
```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const jsonData = pm.response.json();
    if (jsonData.data && jsonData.data.token) {
        pm.environment.set("token", jsonData.data.token);
    }
}
```
4. Crea un Environment en Postman
5. En los demás requests, usa en el header:
   ```
   Authorization: Bearer {{token}}
   ```

### Alternativa Manual

En cada request que requiera autenticación, reemplaza `TU_TOKEN_AQUI` en el header con el token que obtuviste del login/register.

---

## 🔄 FLUJO RECOMENDADO DE PRUEBAS

1. **Health Check** → Verifica que el servidor funciona
2. **Register** → Crea un usuario nuevo (o usa Login si ya existe)
3. **Login** → Obtén el token (si no lo tienes del Register)
4. **Create Category** → Crea algunas categorías
5. **Get Categories** → Verifica que se crearon
6. **Create Expense** → Crea algunos gastos
7. **Get Expenses** → Lista todos los gastos
8. **Get Expense by ID** → Obtén un gasto específico
9. **Update Expense** → Actualiza un gasto
10. **Generate PDF** → Descarga el reporte PDF

---

## ⚠️ ERRORES COMUNES

### 401 Unauthorized
- **Causa:** Token inválido, expirado o no proporcionado
- **Solución:** Haz login nuevamente y copia el nuevo token

### 400 Bad Request
- **Causa:** Error de validación en los datos enviados
- **Solución:** Revisa el formato del JSON y que todos los campos requeridos estén presentes

### 404 Not Found
- **Causa:** El recurso no existe o la URL es incorrecta
- **Solución:** Verifica la URL y que el ID del recurso exista

### 409 Conflict
- **Causa:** Intento de crear un recurso que ya existe (email duplicado, categoría duplicada)
- **Solución:** Usa un email o nombre de categoría diferente

