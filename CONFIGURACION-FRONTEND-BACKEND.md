# Configuración Frontend-Backend

## 🔌 Puertos

- **Frontend (Vite):** `http://localhost:5173`
- **Backend (Express):** `http://localhost:3000`

## ⚠️ Problema Común

El frontend está haciendo peticiones al puerto incorrecto (5173) en lugar del backend (3000).

## ✅ Solución: Configurar el Base URL en el Frontend

### Opción 1: Configurar Axios

En tu archivo de configuración de API (ej: `src/api/axios.js` o `src/config/api.js`):

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // ✅ Puerto del BACKEND
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

Luego usa `api` en lugar de `axios`:

```javascript
// ✅ Correcto
import api from './api/axios';

// Obtener gastos
const getExpenses = async () => {
  const response = await api.get('/expenses'); // Se convierte en http://localhost:3000/expenses
  return response.data;
};

// Crear categoría
const createCategory = async (name) => {
  const response = await api.post('/categories', { name });
  return response.data;
};
```

### Opción 2: Usar Variables de Entorno (Recomendado)

1. **Crear archivo `.env` en el frontend:**

```env
VITE_API_URL=http://localhost:3000
```

2. **Configurar axios:**

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Opción 3: Usar Fetch con URL Completa

Si usas `fetch` directamente:

```javascript
const API_URL = 'http://localhost:3000'; // ✅ Puerto del backend

const getExpenses = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/expenses`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.json();
};
```

## 🔍 Verificar la Configuración

### 1. Revisa tu archivo de API

Busca dónde haces las peticiones HTTP y verifica que usen el puerto 3000:

```javascript
// ❌ INCORRECTO
fetch('http://localhost:5173/expenses') // Puerto del frontend
fetch('http://localhost/expenses')      // Sin puerto

// ✅ CORRECTO
fetch('http://localhost:3000/expenses') // Puerto del backend
```

### 2. Verifica en DevTools

1. Abre DevTools (F12)
2. Ve a la pestaña **Network**
3. Intenta acceder a categorías/gastos
4. Verifica que la petición vaya a `http://localhost:3000/...`

## 📝 Ejemplo Completo de Configuración

### `src/api/axios.js`
```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### `src/api/expenses.js`
```javascript
import api from './axios';

export const getExpenses = () => {
  return api.get('/expenses');
};

export const getExpenseById = (id) => {
  return api.get(`/expenses/${id}`);
};

export const createExpense = (expenseData) => {
  return api.post('/expenses', expenseData);
};

export const updateExpense = (id, expenseData) => {
  return api.put(`/expenses/${id}`, expenseData);
};

export const deleteExpense = (id) => {
  return api.delete(`/expenses/${id}`);
};
```

### `src/api/categories.js`
```javascript
import api from './axios';

export const getCategories = () => {
  return api.get('/categories');
};

export const createCategory = (name) => {
  return api.post('/categories', { name });
};
```

## 🚀 CORS ya está Configurado

El backend ya tiene CORS habilitado, así que no necesitas configurar nada adicional en el backend.

## ✅ Checklist

- [ ] El baseURL de axios/fetch apunta a `http://localhost:3000`
- [ ] No estás usando `http://localhost:5173` para las peticiones API
- [ ] El token se envía en el header `Authorization: Bearer TOKEN`
- [ ] Las peticiones funcionan en Postman (puerto 3000)
- [ ] En Network de DevTools, las peticiones van al puerto 3000

## 🔧 Si el Problema Persiste

1. **Verifica en Network (DevTools):**
   - ¿A qué URL se está haciendo la petición?
   - ¿Es `http://localhost:3000/expenses` o `http://localhost:5173/expenses`?

2. **Revisa tu código:**
   - Busca todas las instancias de `localhost:5173` en peticiones API
   - Cámbialas a `localhost:3000`

3. **Verifica el archivo de configuración:**
   - ¿Tienes un archivo de configuración de API?
   - ¿Está usando el puerto correcto?


