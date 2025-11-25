/**
 * Script de prueba para los endpoints de Expense Tracker Pro
 * Ejecutar con: node test-api.js
 */

const BASE_URL = 'http://localhost:3000';
let authToken = '';

// Función helper para hacer requests
async function makeRequest(method, endpoint, data = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`${method} ${endpoint}`);
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(result, null, 2));
    console.log('='.repeat(60));
    
    return { response, result };
  } catch (error) {
    console.error(`Error en ${method} ${endpoint}:`, error.message);
    return null;
  }
}

// Función principal de pruebas
async function runTests() {
  console.log('🚀 Iniciando pruebas de la API Expense Tracker Pro\n');

  // 1. Verificar salud del servidor
  console.log('\n📋 1. Verificando salud del servidor...');
  await makeRequest('GET', '/health');

  // 2. Registrar usuario
  console.log('\n📋 2. Registrando nuevo usuario...');
  const registerResult = await makeRequest('POST', '/auth/register', {
    name: 'Usuario Prueba',
    email: `test${Date.now()}@example.com`,
    password: 'Password123'
  });

  if (registerResult && registerResult.result.success) {
    authToken = registerResult.result.data.token;
    console.log('✅ Token obtenido:', authToken.substring(0, 20) + '...');
  }

  // 3. Login
  console.log('\n📋 3. Iniciando sesión...');
  const loginResult = await makeRequest('POST', '/auth/login', {
    email: 'test@example.com',
    password: 'Password123'
  });

  if (loginResult && loginResult.result.success) {
    authToken = loginResult.result.data.token;
    console.log('✅ Token obtenido del login');
  }

  if (!authToken) {
    console.log('\n⚠️ No se pudo obtener token. Creando usuario de prueba...');
    const newUser = await makeRequest('POST', '/auth/register', {
      name: 'Usuario Prueba',
      email: `test${Date.now()}@example.com`,
      password: 'Password123'
    });
    if (newUser && newUser.result.success) {
      authToken = newUser.result.data.token;
    }
  }

  if (!authToken) {
    console.log('\n❌ No se pudo obtener token. Abortando pruebas.');
    return;
  }

  // 4. Crear categoría
  console.log('\n📋 4. Creando categoría...');
  await makeRequest('POST', '/categories', {
    name: 'Alimentación'
  }, authToken);

  // 5. Obtener categorías
  console.log('\n📋 5. Obteniendo categorías...');
  await makeRequest('GET', '/categories', null, authToken);

  // 6. Crear gasto
  console.log('\n📋 6. Creando gasto...');
  const expenseResult = await makeRequest('POST', '/expenses', {
    title: 'Compra supermercado',
    amount: 150.50,
    category: 'Alimentación',
    date: new Date().toISOString(),
    method: 'Tarjeta',
    description: 'Compra semanal de alimentos'
  }, authToken);

  let expenseId = null;
  if (expenseResult && expenseResult.result.success) {
    expenseId = expenseResult.result.data.id;
  }

  // 7. Obtener todos los gastos
  console.log('\n📋 7. Obteniendo todos los gastos...');
  await makeRequest('GET', '/expenses', null, authToken);

  // 8. Obtener un gasto por ID
  if (expenseId) {
    console.log('\n📋 8. Obteniendo gasto por ID...');
    await makeRequest('GET', `/expenses/${expenseId}`, null, authToken);
  }

  // 9. Actualizar gasto
  if (expenseId) {
    console.log('\n📋 9. Actualizando gasto...');
    await makeRequest('PUT', `/expenses/${expenseId}`, {
      title: 'Supermercado actualizado',
      amount: 175.00
    }, authToken);
  }

  // 10. Filtrar gastos por categoría
  console.log('\n📋 10. Filtrando gastos por categoría...');
  await makeRequest('GET', '/expenses?category=Alimentación', null, authToken);

  console.log('\n✅ Pruebas completadas!\n');
}

// Ejecutar pruebas
runTests().catch(console.error);

