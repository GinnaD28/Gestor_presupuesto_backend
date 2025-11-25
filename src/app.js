const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const expenseRoutes = require('./routes/expense.routes');
const categoryRoutes = require('./routes/category.routes');
const reportRoutes = require('./routes/report.routes');

// Importar middleware de errores
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

// Middlewares globales
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);
app.use('/categories', categoryRoutes);
app.use('/reports', reportRoutes);

// Ruta de prueba
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Expense Tracker Pro API está funcionando',
    timestamp: new Date().toISOString()
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorMiddleware);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

module.exports = app;


