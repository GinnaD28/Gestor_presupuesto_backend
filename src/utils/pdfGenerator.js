const PDFDocument = require('pdfkit');

// Generar PDF con tabla de gastos
function generateExpensesPDF(expenses, stats, user) {
  const doc = new PDFDocument({ margin: 50 });

  // Encabezado
  doc.fontSize(20).text('Reporte de Gastos', { align: 'center' });
  doc.moveDown();
  
  // Información del usuario
  doc.fontSize(12);
  doc.text(`Usuario: ${user.name || user.email}`, { align: 'left' });
  doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, { align: 'left' });
  doc.moveDown();

  // Estadísticas
  doc.fontSize(14).text('Resumen', { underline: true });
  doc.fontSize(11);
  doc.text(`Total de gastos: ${stats.count}`);
  doc.text(`Monto total: $${stats.total.toFixed(2)}`);
  doc.text(`Promedio por gasto: $${stats.average.toFixed(2)}`);
  doc.moveDown();

  // Gastos por categoría
  if (Object.keys(stats.byCategory).length > 0) {
    doc.fontSize(14).text('Gastos por Categoría', { underline: true });
    doc.fontSize(11);
    Object.entries(stats.byCategory).forEach(([category, data]) => {
      doc.text(`${category}: $${data.total.toFixed(2)} (${data.count} gastos)`);
    });
    doc.moveDown();
  }

  // Tabla de gastos
  if (expenses.length > 0) {
    doc.fontSize(14).text('Detalle de Gastos', { underline: true });
    doc.moveDown(0.5);

    // Encabezados de la tabla
    const tableTop = doc.y;
    const itemHeight = 20;
    const pageHeight = doc.page.height - 100;
    
    // Encabezados
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Fecha', 50, tableTop);
    doc.text('Título', 120, tableTop);
    doc.text('Categoría', 250, tableTop);
    doc.text('Monto', 350, tableTop, { width: 100, align: 'right' });
    doc.text('Método', 450, tableTop);
    
    // Línea separadora
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
    
    // Datos de la tabla
    doc.font('Helvetica').fontSize(9);
    let y = tableTop + 25;
    
    expenses.forEach((expense, index) => {
      // Verificar si necesitamos una nueva página
      if (y > pageHeight) {
        doc.addPage();
        y = 50;
      }

      const date = new Date(expense.date).toLocaleDateString('es-ES');
      const title = expense.title.length > 30 ? expense.title.substring(0, 27) + '...' : expense.title;
      const category = expense.category.length > 15 ? expense.category.substring(0, 12) + '...' : expense.category;
      const amount = `$${expense.amount.toFixed(2)}`;
      const method = expense.method || 'N/A';

      doc.text(date, 50, y);
      doc.text(title, 120, y, { width: 120 });
      doc.text(category, 250, y, { width: 90 });
      doc.text(amount, 350, y, { width: 100, align: 'right' });
      doc.text(method, 450, y, { width: 100 });

      // Línea separadora entre filas
      if (index < expenses.length - 1) {
        doc.moveTo(50, y + 15).lineTo(550, y + 15).stroke();
      }

      y += itemHeight;
    });
  } else {
    doc.fontSize(12).text('No hay gastos registrados en el período seleccionado.', { align: 'center' });
  }

  // Pie de página
  const totalPages = doc.bufferedPageRange().count;
  for (let i = 0; i < totalPages; i++) {
    doc.switchToPage(i);
    doc.fontSize(8)
       .text(
         `Página ${i + 1} de ${totalPages}`,
         50,
         doc.page.height - 30,
         { align: 'center', width: 500 }
       );
  }

  return doc;
}

module.exports = {
  generateExpensesPDF
};


