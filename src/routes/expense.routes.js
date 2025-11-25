const express = require('express');
const { validationResult } = require('express-validator');
const expenseController = require('../controllers/expense.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { createExpenseValidator, updateExpenseValidator } = require('../validators/expense.validator');

const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: errors.array()
    });
  }
  next();
};

// GET /expenses
router.get('/', expenseController.getExpenses);

// GET /expenses/:id
router.get('/:id', expenseController.getExpenseById);

// POST /expenses
router.post(
  '/',
  createExpenseValidator,
  handleValidationErrors,
  expenseController.createExpense
);

// PUT /expenses/:id
router.put(
  '/:id',
  updateExpenseValidator,
  handleValidationErrors,
  expenseController.updateExpense
);

// DELETE /expenses/:id
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;


