const reportService = require('../services/report.service');
const pdfGenerator = require('../utils/pdfGenerator');

// Generar PDF de gastos
async function generateExpensesPDF(req, res, next) {
  try {
    const userId = req.user.id;
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };

    // Obtener gastos (una sola consulta)
    const expenses = await reportService.getExpensesForReport(userId, filters);
    
    // Calcular estadísticas desde los gastos obtenidos
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const byCategory = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = { total: 0, count: 0 };
      }
      acc[expense.category].total += expense.amount;
      acc[expense.category].count += 1;
      return acc;
    }, {});

    const stats = {
      total,
      count: expenses.length,
      byCategory,
      average: expenses.length > 0 ? total / expenses.length : 0
    };

    // Generar PDF
    const pdfDoc = pdfGenerator.generateExpensesPDF(expenses, stats, req.user);

    // Configurar headers para descarga
    const filename = `gastos_${new Date().toISOString().split('T')[0]}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Enviar PDF
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  generateExpensesPDF
};

