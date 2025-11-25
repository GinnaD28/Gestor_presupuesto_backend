const expenseService = require('../services/expense.service');

// Obtener todos los gastos del usuario
async function getExpenses(req, res, next) {
  try {
    const userId = req.user.id;
    const filters = {
      category: req.query.category,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };

    const expenses = await expenseService.getUserExpenses(userId, filters);

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    next(error);
  }
}

// Obtener un gasto por ID
async function getExpenseById(req, res, next) {
  try {
    const userId = req.user.id;
    const expenseId = parseInt(req.params.id);

    const expense = await expenseService.getExpenseById(expenseId, userId);

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    next(error);
  }
}

// Crear un nuevo gasto
async function createExpense(req, res, next) {
  try {
    const userId = req.user.id;
    const expenseData = req.body;

    const expense = await expenseService.createExpense(expenseData, userId);

    res.status(201).json({
      success: true,
      message: 'Gasto creado exitosamente',
      data: expense
    });
  } catch (error) {
    next(error);
  }
}

// Actualizar un gasto
async function updateExpense(req, res, next) {
  try {
    const userId = req.user.id;
    const expenseId = parseInt(req.params.id);
    const expenseData = req.body;

    const expense = await expenseService.updateExpense(expenseId, expenseData, userId);

    res.status(200).json({
      success: true,
      message: 'Gasto actualizado exitosamente',
      data: expense
    });
  } catch (error) {
    next(error);
  }
}

// Eliminar un gasto
async function deleteExpense(req, res, next) {
  try {
    const userId = req.user.id;
    const expenseId = parseInt(req.params.id);

    await expenseService.deleteExpense(expenseId, userId);

    res.status(200).json({
      success: true,
      message: 'Gasto eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
};


