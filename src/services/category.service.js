const { prisma } = require('../config/db');

// Obtener todas las categorías del usuario
async function getAllCategories(userId) {
  const categories = await prisma.category.findMany({
    where: {
      userId
    },
    orderBy: {
      name: 'asc'
    }
  });

  return categories;
}

// Crear una nueva categoría para el usuario
async function createCategory(categoryData, userId) {
  // Verificar si la categoría ya existe para este usuario
  const existingCategory = await prisma.category.findUnique({
    where: {
      name_userId: {
        name: categoryData.name,
        userId: userId
      }
    }
  });

  if (existingCategory) {
    const error = new Error('La categoría ya existe para este usuario');
    error.statusCode = 409;
    throw error;
  }

  const category = await prisma.category.create({
    data: {
      ...categoryData,
      userId
    }
  });

  return category;
}

// Obtener una categoría por ID (solo si pertenece al usuario)
async function getCategoryById(categoryId, userId) {
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId
    }
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


