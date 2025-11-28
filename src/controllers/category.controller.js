const categoryService = require('../services/category.service');

// Obtener todas las categorías del usuario
async function getCategories(req, res, next) {
  try {
    const userId = req.user.id;
    const categories = await categoryService.getAllCategories(userId);

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
}

// Crear una nueva categoría para el usuario
async function createCategory(req, res, next) {
  try {
    const userId = req.user.id;
    const categoryData = req.body;

    const category = await categoryService.createCategory(categoryData, userId);

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: category
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCategories,
  createCategory
};


