const categoryService = require('../services/category.service');

// Obtener todas las categorías
async function getCategories(req, res, next) {
  try {
    const categories = await categoryService.getAllCategories();

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
}

// Crear una nueva categoría
async function createCategory(req, res, next) {
  try {
    const categoryData = req.body;

    const category = await categoryService.createCategory(categoryData);

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


