const express = require('express');
const { body } = require('express-validator');
const { validationResult } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { registerValidator, loginValidator } = require('../validators/auth.validator');

const router = express.Router();

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

// POST /auth/register
router.post(
  '/register',
  registerValidator,
  handleValidationErrors,
  authController.register
);

// POST /auth/login
router.post(
  '/login',
  loginValidator,
  handleValidationErrors,
  authController.login
);

module.exports = router;


