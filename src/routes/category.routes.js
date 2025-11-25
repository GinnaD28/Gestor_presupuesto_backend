const express = require('express');
const { validationResult } = require('express-validator');
const categoryController = require('../controllers/category.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { createCategoryValidator } = require('../validators/category.validator');

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

// GET /categories
router.get('/', categoryController.getCategories);

// POST /categories
router.post(
  '/',
  createCategoryValidator,
  handleValidationErrors,
  categoryController.createCategory
);

module.exports = router;


