const { body } = require('express-validator');

// Validaciones para crear gasto
const createExpenseValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ min: 1, max: 200 })
    .withMessage('El título debe tener entre 1 y 200 caracteres'),
  
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('El monto debe ser un número positivo mayor a 0'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('La categoría es requerida')
    .isLength({ min: 1, max: 100 })
    .withMessage('La categoría debe tener entre 1 y 100 caracteres'),
  
  body('date')
    .isISO8601()
    .withMessage('La fecha debe ser una fecha válida en formato ISO8601'),
  
  body('method')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('El método de pago no debe exceder 50 caracteres'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripción no debe exceder 500 caracteres')
];

// Validaciones para actualizar gasto
const updateExpenseValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('El título debe tener entre 1 y 200 caracteres'),
  
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('El monto debe ser un número positivo mayor a 0'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('La categoría debe tener entre 1 y 100 caracteres'),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('La fecha debe ser una fecha válida en formato ISO8601'),
  
  body('method')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('El método de pago no debe exceder 50 caracteres'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripción no debe exceder 500 caracteres')
];

module.exports = {
  createExpenseValidator,
  updateExpenseValidator
};


