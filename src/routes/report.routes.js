const express = require('express');
const reportController = require('../controllers/report.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// GET /reports/expenses-pdf
router.get('/expenses-pdf', reportController.generateExpensesPDF);

module.exports = router;


