const { body } = require('express-validator');

// Validaciones para crear categoría
const createCategoryValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la categoría es requerido')
    .isLength({ min: 1, max: 100 })
    .withMessage('El nombre debe tener entre 1 y 100 caracteres')
];

module.exports = {
  createCategoryValidator
};


