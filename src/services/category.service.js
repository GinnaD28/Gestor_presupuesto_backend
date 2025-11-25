const { prisma } = require('../config/db');

// Obtener todas las categorías
async function getAllCategories() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  return categories;
}

// Crear una nueva categoría
async function createCategory(categoryData) {
  const category = await prisma.category.create({
    data: categoryData
  });

  return category;
}

// Obtener una categoría por ID
async function getCategoryById(categoryId) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });

  if (!category) {
    const error = new Error('Categoría no encontrada');
    error.statusCode = 404;
    throw error;
  }

  return category;
}

module.exports = {
  getAllCategories,
  createCategory,
  getCategoryById
};


