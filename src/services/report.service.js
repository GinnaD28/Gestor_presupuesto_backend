const { prisma } = require('../config/db');

// Obtener todos los gastos del usuario para el reporte
async function getExpensesForReport(userId, filters = {}) {
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
    orderBy: {
      date: 'desc'
    },
    select: {
      id: true,
      title: true,
      amount: true,
      category: true,
      date: true,
      method: true,
      description: true
    }
  });

  return expenses;
}

// Obtener estadísticas para el reporte
async function getReportStats(userId, filters = {}) {
  const expenses = await getExpensesForReport(userId, filters);

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const byCategory = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = { total: 0, count: 0 };
    }
    acc[expense.category].total += expense.amount;
    acc[expense.category].count += 1;
    return acc;
  }, {});

  return {
    total,
    count: expenses.length,
    byCategory,
    average: expenses.length > 0 ? total / expenses.length : 0
  };
}

module.exports = {
  getExpensesForReport,
  getReportStats
};


