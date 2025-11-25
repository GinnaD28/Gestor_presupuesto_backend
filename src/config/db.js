const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Función para conectar a la base de datos
async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ Base de datos conectada exitosamente');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    process.exit(1);
  }
}

// Función para desconectar de la base de datos
async function disconnectDB() {
  await prisma.$disconnect();
  console.log('🔌 Desconectado de la base de datos');
}

module.exports = {
  prisma,
  connectDB,
  disconnectDB,
};


