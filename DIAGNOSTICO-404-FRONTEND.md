# Diagnóstico: Error 404 en Categorías y Gastos

## 🔍 Problema
Al acceder a categorías y gastos después de iniciar sesión, aparece error 404.

## ✅ Verificaciones del Backend

Las rutas del backend están correctas:
- `GET /expenses` - ✅ Funciona
- `GET /categories` - ✅ Funciona
- Ambas requieren autenticación con token JWT

## 🔧 Posibles Causas en el Frontend

### 1. Rutas de React Router Incorrectas

Verifica que las rutas en tu `App.jsx` o archivo de rutas sean correctas:

```jsx
// Ejemplo correcto
<Route path="/expenses" element={<Expenses />} />
<Route path="/categories" element={<Categories />} />
```

**Problema común:** Rutas con mayúsculas o rutas anidadas incorrectas.

### 2. URL Base Incorrecta en las Peticiones

Verifica que las peticiones HTTP usen la URL correcta:

```javascript
// ✅ Correcto
axios.get('http://localhost:3000/expenses', {
  headers: { Authorization: `Bearer ${token}` }
})

// ❌ Incorrecto (falta el puerto)
axios.get('http://localhost/expenses', ...)

// ❌ Incorrecto (ruta incorrecta)
axios.get('http://localhost:3000/api/expenses', ...)
```

### 3. Token No Se Está Enviando

Verifica que el token se esté enviando en el header:

```javascript
// En tu archivo de API (ej: api.js o axios config)
const token = localStorage.getItem('token'); // o donde guardes el token

axios.get('http://localhost:3000/expenses', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

### 4. Problema con el Router de React

El warning de React Router sugiere que hay un problema con rutas relativas. Verifica:

```jsx
// Si usas rutas anidadas, asegúrate de usar rutas absolutas
<Routes>
  <Route path="/" element={<Layout />}>
    <Route path="expenses" element={<Expenses />} />  {/* ❌ Relativa */}
    <Route path="/expenses" element={<Expenses />} /> {/* ✅ Absoluta */}
  </Route>
</Routes>
```

## 🧪 Pasos para Diagnosticar

### Paso 1: Verificar en la Consola del Navegador

Abre las **DevTools** (F12) y ve a la pestaña **Network**:

1. Intenta acceder a categorías o gastos
2. Busca la petición que falla
3. Verifica:
   - **URL completa** de la petición
   - **Status Code** (404, 401, etc.)
   - **Headers** (especialmente `Authorization`)
   - **Response** del servidor

### Paso 2: Verificar el Token

En la consola del navegador, ejecuta:

```javascript
// Verificar si el token existe
console.log('Token:', localStorage.getItem('token'));

// O donde guardes el token
console.log('Token:', sessionStorage.getItem('token'));
```

### Paso 3: Probar con Postman/Thunder Client

Prueba las rutas directamente:

1. **GET /expenses**
   - URL: `http://localhost:3000/expenses`
   - Header: `Authorization: Bearer TU_TOKEN`

2. **GET /categories**
   - URL: `http://localhost:3000/categories`
   - Header: `Authorization: Bearer TU_TOKEN`

Si funcionan en Postman pero no en el frontend, el problema está en el frontend.

### Paso 4: Verificar la Configuración de Axios/Fetch

Busca tu archivo de configuración de API (ej: `api.js`, `axios.js`, `config.js`):

```javascript
// Ejemplo de configuración correcta
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // ✅ Con puerto
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## 🔍 Errores Comunes

### Error 1: "Ruta no encontrada" del Backend
**Causa:** La URL de la petición no coincide con las rutas del backend.
**Solución:** Verifica que uses `/expenses` y `/categories` (no `/api/expenses`).

### Error 2: 401 Unauthorized
**Causa:** El token no se está enviando o es inválido.
**Solución:** Verifica que el token se guarde después del login y se envíe en cada petición.

### Error 3: 404 del Frontend (React Router)
**Causa:** La ruta en React Router no existe o está mal configurada.
**Solución:** Verifica las rutas en tu componente de rutas.

## 📝 Checklist de Verificación

- [ ] El servidor backend está corriendo en `http://localhost:3000`
- [ ] Las rutas del backend son `/expenses` y `/categories` (sin `/api`)
- [ ] El token se guarda correctamente después del login
- [ ] El token se envía en el header `Authorization: Bearer TOKEN`
- [ ] Las rutas de React Router están correctamente configuradas
- [ ] La URL base de las peticiones incluye el puerto `:3000`
- [ ] No hay errores de CORS en la consola

## 🚀 Solución Rápida

Si el problema es que cambiaste las rutas del frontend, verifica:

1. **Rutas de React Router:**
```jsx
// Asegúrate de que coincidan con las URLs que usas
<Route path="/expenses" element={<Expenses />} />
<Route path="/categories" element={<Categories />} />
```

2. **URLs de las peticiones API:**
```javascript
// Deben ser exactamente estas (con el puerto)
GET http://localhost:3000/expenses
GET http://localhost:3000/categories
```

3. **Headers de autenticación:**
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## 💡 Si Necesitas Más Ayuda

Comparte:
1. El código de tus rutas de React Router
2. El código de tu archivo de configuración de API (axios/fetch)
3. Una captura de la pestaña Network de DevTools mostrando la petición que falla


