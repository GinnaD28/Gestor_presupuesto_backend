require('dotenv').config();
const app = require('./app');
const { connectDB, disconnectDB } = require('./config/db');

const PORT = process.env.PORT || 3000;

// Función para iniciar el servidor
async function startServer() {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGTERM', async () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  await disconnectDB();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT recibido, cerrando servidor...');
  await disconnectDB();
  process.exit(0);
});

// Iniciar servidor
startServer();


