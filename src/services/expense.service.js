const { prisma } = require('../config/db');

// Obtener todos los gastos del usuario
async function getUserExpenses(userId, filters = {}) {
  const where = {
    userId,
    ...(filters.category && { category: filters.category }),
    ...(filters.startDate && filters.endDate && {
      date: {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate)
      }
    })
  };

  const expenses = await prisma.expense.findMany({
    where,
    orderBy: {
      date: 'desc'
    }
  });

  return expenses;
}

// Obtener un gasto por ID
async function getExpenseById(expenseId, userId) {
  const expense = await prisma.expense.findFirst({
    where: {
      id: expenseId,
      userId
    }
  });

  if (!expense) {
    const error = new Error('Gasto no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return expense;
}

// Crear un nuevo gasto
async function createExpense(expenseData, userId) {
  const expense = await prisma.expense.create({
    data: {
      ...expenseData,
      userId,
      date: new Date(expenseData.date)
    }
  });

  return expense;
}

// Actualizar un gasto
async function updateExpense(expenseId, expenseData, userId) {
  // Verificar que el gasto existe y pertenece al usuario
  await getExpenseById(expenseId, userId);

  const updateData = { ...expenseData };
  if (updateData.date) {
    updateData.date = new Date(updateData.date);
  }

  const expense = await prisma.expense.update({
    where: { id: expenseId },
    data: updateData
  });

  return expense;
}

// Eliminar un gasto
async function deleteExpense(expenseId, userId) {
  // Verificar que el gasto existe y pertenece al usuario
  await getExpenseById(expenseId, userId);

  await prisma.expense.delete({
    where: { id: expenseId }
  });

  return { message: 'Gasto eliminado exitosamente' };
}

// Obtener estadísticas de gastos
async function getExpenseStats(userId, filters = {}) {
  const where = {
    userId,
    ...(filters.startDate && filters.endDate && {
      date: {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate)
      }
    })
  };

  const expenses = await prisma.expense.findMany({
    where,
    select: {
      amount: true,
      category: true
    }
  });

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const byCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  return {
    total,
    count: expenses.length,
    byCategory
  };
}

module.exports = {
  getUserExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats
};


