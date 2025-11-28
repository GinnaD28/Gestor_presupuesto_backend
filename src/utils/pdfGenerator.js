const PDFDocument = require('pdfkit');

// Colores del diseño
const COLORS = {
  primary: '#052B5B',      // Azul oscuro
  secondary: '#0B4F8A',    // Azul medio
  text: '#333333',         // Gris oscuro
  lightGray: '#F3F4F6',    // Gris claro para fondos
  veryLightGray: '#F9FAFB', // Gris muy claro para filas alternadas
  white: '#FFFFFF',
  border: '#E5E7EB'        // Gris para bordes
};

// Dimensiones de página
const PAGE_MARGIN = 50;
const PAGE_WIDTH = 595; // A4 width en puntos
const CONTENT_WIDTH = PAGE_WIDTH - (PAGE_MARGIN * 2);

/**
 * Genera un PDF profesional con diseño empresarial
 */
function generateExpensesPDF(expenses, stats, user) {
  const doc = new PDFDocument({ 
    margin: PAGE_MARGIN,
    size: 'A4',
    info: {
      Title: 'Reporte de Gastos',
      Author: 'Expense Tracker Pro',
      Subject: 'Reporte de gastos del usuario'
    }
  });

  let currentY = PAGE_MARGIN;

  // Función helper para agregar nueva página si es necesario
  const checkPageBreak = (requiredHeight) => {
    if (currentY + requiredHeight > doc.page.height - 100) {
      doc.addPage();
      currentY = PAGE_MARGIN;
      // Redibujar encabezado en nueva página
      drawHeader(doc, user, true);
      currentY += 80;
    }
  };

  // Dibujar encabezado principal
  currentY = drawHeader(doc, user, false);
  
  // Espacio después del encabezado
  currentY += 20;

  // Dibujar tarjetas de resumen
  currentY = drawSummaryCards(doc, stats, currentY);
  currentY += 30;

  // Dibujar tabla de gastos por categoría
  if (Object.keys(stats.byCategory).length > 0) {
    checkPageBreak(150);
    currentY = drawCategoryTable(doc, stats.byCategory, currentY, user);
    currentY += 30;
  }

  // Dibujar tabla principal de gastos
  if (expenses.length > 0) {
    checkPageBreak(100);
    currentY = drawExpensesTable(doc, expenses, currentY, user);
  } else {
    checkPageBreak(50);
    drawNoExpensesMessage(doc, currentY);
  }

  // Dibujar pie de página en todas las páginas
  drawFooter(doc);

  return doc;
}

/**
 * Dibuja el encabezado del documento
 */
function drawHeader(doc, user, isSubsequentPage = false) {
  const headerY = PAGE_MARGIN;

  // Fondo azul oscuro para el título
  doc.rect(PAGE_MARGIN, headerY, CONTENT_WIDTH, 50)
     .fillColor(COLORS.primary)
     .fill();

  // Título principal
  doc.fontSize(24)
     .fillColor(COLORS.white)
     .font('Helvetica-Bold')
     .text('Reporte de Gastos', PAGE_MARGIN + 20, headerY + 12, {
       width: CONTENT_WIDTH - 40,
       align: 'center'
     });

  // Línea divisoria delgada
  doc.strokeColor(COLORS.secondary)
     .lineWidth(2)
     .moveTo(PAGE_MARGIN, headerY + 50)
     .lineTo(PAGE_MARGIN + CONTENT_WIDTH, headerY + 50)
     .stroke();

  // Información del usuario
  const infoY = headerY + 60;
  doc.fontSize(10)
     .fillColor(COLORS.text)
     .font('Helvetica');

  const userName = user.name || user.email;
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  doc.text(`Usuario: ${userName}`, PAGE_MARGIN, infoY);
  doc.text(`Fecha de generación: ${currentDate}`, PAGE_MARGIN + 250, infoY);

  if (isSubsequentPage) {
    doc.fontSize(8)
       .fillColor(COLORS.secondary)
       .text('(continuación)', PAGE_MARGIN, infoY + 15);
  }

  return infoY + 25;
}

/**
 * Dibuja las tarjetas de resumen (Total de gastos, Monto total, Promedio)
 */
function drawSummaryCards(doc, stats, startY) {
  const cardWidth = (CONTENT_WIDTH - 40) / 3; // 3 tarjetas con espaciado
  const cardHeight = 80;
  const cardSpacing = 20;

  const cards = [
    {
      title: 'Total de Gastos',
      value: stats.count.toString(),
      suffix: 'gastos'
    },
    {
      title: 'Monto Total',
      value: `$${stats.total.toFixed(2)}`,
      suffix: ''
    },
    {
      title: 'Promedio por Gasto',
      value: `$${stats.average.toFixed(2)}`,
      suffix: ''
    }
  ];

  cards.forEach((card, index) => {
    const cardX = PAGE_MARGIN + (index * (cardWidth + cardSpacing));
    const cardY = startY;

    // Fondo de la tarjeta con borde redondeado (simulado)
    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 5)
       .fillColor(COLORS.lightGray)
       .fill()
       .strokeColor(COLORS.border)
       .lineWidth(1)
       .stroke();

    // Título de la tarjeta
    doc.fontSize(9)
       .fillColor(COLORS.text)
       .font('Helvetica')
       .text(card.title, cardX + 15, cardY + 12, {
         width: cardWidth - 30,
         align: 'left'
       });

    // Valor grande
    doc.fontSize(20)
       .fillColor(COLORS.primary)
       .font('Helvetica-Bold')
       .text(card.value, cardX + 15, cardY + 30, {
         width: cardWidth - 30,
         align: 'left'
       });

    // Sufijo si existe
    if (card.suffix) {
      doc.fontSize(8)
         .fillColor(COLORS.text)
         .font('Helvetica')
         .text(card.suffix, cardX + 15, cardY + 55, {
           width: cardWidth - 30,
           align: 'left'
         });
    }
  });

  return startY + cardHeight + 20;
}

/**
 * Dibuja la tabla de gastos por categoría
 */
function drawCategoryTable(doc, byCategory, startY, user) {
  const tableTop = startY;
  const rowHeight = 25;
  const headerHeight = 30;

  // Título de la sección
  doc.fontSize(14)
     .fillColor(COLORS.secondary)
     .font('Helvetica-Bold')
     .text('Gastos por Categoría', PAGE_MARGIN, tableTop);

  const tableStartY = tableTop + 25;

  // Encabezado de la tabla
  doc.rect(PAGE_MARGIN, tableStartY, CONTENT_WIDTH, headerHeight)
     .fillColor(COLORS.primary)
     .fill();

  // Texto del encabezado
  doc.fontSize(10)
     .fillColor(COLORS.white)
     .font('Helvetica-Bold');

  const colWidths = {
    category: CONTENT_WIDTH * 0.5,
    total: CONTENT_WIDTH * 0.25,
    count: CONTENT_WIDTH * 0.25
  };

  doc.text('Categoría', PAGE_MARGIN + 10, tableStartY + 8);
  doc.text('Total', PAGE_MARGIN + 10 + colWidths.category, tableStartY + 8, {
    width: colWidths.total - 10,
    align: 'right'
  });
  doc.text('Cantidad', PAGE_MARGIN + 10 + colWidths.category + colWidths.total, tableStartY + 8, {
    width: colWidths.count - 10,
    align: 'right'
  });

  // Filas de datos
  const categories = Object.entries(byCategory).sort((a, b) => b[1].total - a[1].total);
  let currentRowY = tableStartY + headerHeight;

  categories.forEach(([category, data], index) => {
    // Verificar si necesitamos nueva página
    if (currentRowY + rowHeight > doc.page.height - 80) {
      doc.addPage();
      drawHeader(doc, user, true);
      currentRowY = PAGE_MARGIN + 80 + 25;
      
      // Redibujar título y encabezado de tabla
      doc.fontSize(14)
         .fillColor(COLORS.secondary)
         .font('Helvetica-Bold')
         .text('Gastos por Categoría', PAGE_MARGIN, currentRowY);
      
      currentRowY += 25;
      
      doc.rect(PAGE_MARGIN, currentRowY, CONTENT_WIDTH, headerHeight)
         .fillColor(COLORS.primary)
         .fill();

      doc.fontSize(10)
         .fillColor(COLORS.white)
         .font('Helvetica-Bold');

      doc.text('Categoría', PAGE_MARGIN + 10, currentRowY + 8);
      doc.text('Total', PAGE_MARGIN + 10 + colWidths.category, currentRowY + 8, {
        width: colWidths.total - 10,
        align: 'right'
      });
      doc.text('Cantidad', PAGE_MARGIN + 10 + colWidths.category + colWidths.total, currentRowY + 8, {
        width: colWidths.count - 10,
        align: 'right'
      });

      currentRowY += headerHeight;
    }

    // Fondo alternado
    if (index % 2 === 0) {
      doc.rect(PAGE_MARGIN, currentRowY, CONTENT_WIDTH, rowHeight)
         .fillColor(COLORS.veryLightGray)
         .fill();
    }

    // Borde inferior
    doc.strokeColor(COLORS.border)
       .lineWidth(0.5)
       .moveTo(PAGE_MARGIN, currentRowY + rowHeight)
       .lineTo(PAGE_MARGIN + CONTENT_WIDTH, currentRowY + rowHeight)
       .stroke();

    // Texto de la fila
    doc.fontSize(9)
       .fillColor(COLORS.text)
       .font('Helvetica');

    doc.text(category, PAGE_MARGIN + 10, currentRowY + 7, {
      width: colWidths.category - 10
    });

    doc.font('Helvetica-Bold')
       .text(`$${data.total.toFixed(2)}`, PAGE_MARGIN + 10 + colWidths.category, currentRowY + 7, {
         width: colWidths.total - 10,
         align: 'right'
       });

    doc.font('Helvetica')
       .text(data.count.toString(), PAGE_MARGIN + 10 + colWidths.category + colWidths.total, currentRowY + 7, {
         width: colWidths.count - 10,
         align: 'right'
       });

    currentRowY += rowHeight;
  });

  return currentRowY;
}

/**
 * Dibuja la tabla principal de gastos
 */
function drawExpensesTable(doc, expenses, startY, user) {
  const tableTop = startY;
  const rowHeight = 20;
  const headerHeight = 30;

  // Título de la sección
  doc.fontSize(14)
     .fillColor(COLORS.secondary)
     .font('Helvetica-Bold')
     .text('Detalle de Gastos', PAGE_MARGIN, tableTop);

  const tableStartY = tableTop + 25;
  let currentRowY = tableStartY;

  // Anchos de columnas
  const colWidths = {
    date: CONTENT_WIDTH * 0.15,
    title: CONTENT_WIDTH * 0.30,
    category: CONTENT_WIDTH * 0.20,
    amount: CONTENT_WIDTH * 0.15,
    method: CONTENT_WIDTH * 0.20
  };

  const colPositions = {
    date: PAGE_MARGIN + 10,
    title: PAGE_MARGIN + 10 + colWidths.date,
    category: PAGE_MARGIN + 10 + colWidths.date + colWidths.title,
    amount: PAGE_MARGIN + 10 + colWidths.date + colWidths.title + colWidths.category,
    method: PAGE_MARGIN + 10 + colWidths.date + colWidths.title + colWidths.category + colWidths.amount
  };

  // Encabezado de la tabla
  doc.rect(PAGE_MARGIN, tableStartY, CONTENT_WIDTH, headerHeight)
     .fillColor(COLORS.primary)
     .fill();

  doc.fontSize(9)
     .fillColor(COLORS.white)
     .font('Helvetica-Bold');

  doc.text('Fecha', colPositions.date, tableStartY + 10, { width: colWidths.date - 10 });
  doc.text('Título', colPositions.title, tableStartY + 10, { width: colWidths.title - 10 });
  doc.text('Categoría', colPositions.category, tableStartY + 10, { width: colWidths.category - 10 });
  doc.text('Monto', colPositions.amount, tableStartY + 10, { 
    width: colWidths.amount - 10,
    align: 'right'
  });
  doc.text('Método', colPositions.method, tableStartY + 10, { width: colWidths.method - 10 });

  currentRowY = tableStartY + headerHeight;

  // Filas de datos
  expenses.forEach((expense, index) => {
    // Verificar si necesitamos nueva página
    if (currentRowY + rowHeight > doc.page.height - 80) {
      doc.addPage();
      drawHeader(doc, user, true);
      currentRowY = PAGE_MARGIN + 80 + 25;
      
      // Redibujar encabezado de tabla
      doc.rect(PAGE_MARGIN, currentRowY, CONTENT_WIDTH, headerHeight)
         .fillColor(COLORS.primary)
         .fill();

      doc.fontSize(9)
         .fillColor(COLORS.white)
         .font('Helvetica-Bold');

      doc.text('Fecha', colPositions.date, currentRowY + 10, { width: colWidths.date - 10 });
      doc.text('Título', colPositions.title, currentRowY + 10, { width: colWidths.title - 10 });
      doc.text('Categoría', colPositions.category, currentRowY + 10, { width: colWidths.category - 10 });
      doc.text('Monto', colPositions.amount, currentRowY + 10, { 
        width: colWidths.amount - 10,
        align: 'right'
      });
      doc.text('Método', colPositions.method, currentRowY + 10, { width: colWidths.method - 10 });

      currentRowY += headerHeight;
    }

    // Fondo alternado
    if (index % 2 === 0) {
      doc.rect(PAGE_MARGIN, currentRowY, CONTENT_WIDTH, rowHeight)
         .fillColor(COLORS.veryLightGray)
         .fill();
    }

    // Borde inferior
    doc.strokeColor(COLORS.border)
       .lineWidth(0.5)
       .moveTo(PAGE_MARGIN, currentRowY + rowHeight)
       .lineTo(PAGE_MARGIN + CONTENT_WIDTH, currentRowY + rowHeight)
       .stroke();

    // Datos de la fila
    doc.fontSize(8)
       .fillColor(COLORS.text)
       .font('Helvetica');

    const date = new Date(expense.date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const title = expense.title.length > 35 ? expense.title.substring(0, 32) + '...' : expense.title;
    const category = expense.category.length > 20 ? expense.category.substring(0, 17) + '...' : expense.category;
    const amount = `$${expense.amount.toFixed(2)}`;
    const method = expense.method || 'N/A';

    doc.text(date, colPositions.date, currentRowY + 6, { width: colWidths.date - 10 });
    doc.text(title, colPositions.title, currentRowY + 6, { width: colWidths.title - 10 });
    doc.text(category, colPositions.category, currentRowY + 6, { width: colWidths.category - 10 });
    
    doc.font('Helvetica-Bold')
       .text(amount, colPositions.amount, currentRowY + 6, { 
         width: colWidths.amount - 10,
         align: 'right'
       });
    
    doc.font('Helvetica')
       .text(method, colPositions.method, currentRowY + 6, { width: colWidths.method - 10 });

    currentRowY += rowHeight;
  });

  return currentRowY;
}

/**
 * Dibuja mensaje cuando no hay gastos
 */
function drawNoExpensesMessage(doc, startY) {
  doc.fontSize(12)
     .fillColor(COLORS.text)
     .font('Helvetica')
     .text('No hay gastos registrados en el período seleccionado.', 
           PAGE_MARGIN, startY, {
             width: CONTENT_WIDTH,
             align: 'center'
           });
}

/**
 * Dibuja el pie de página en todas las páginas
 */
function drawFooter(doc) {
  const totalPages = doc.bufferedPageRange().count;
  const footerText = 'Reporte generado automáticamente por la plataforma Expense Tracker Pro';
  const pageText = 'Página {page} de {total}';

  for (let i = 0; i < totalPages; i++) {
    doc.switchToPage(i);
    
    const footerY = doc.page.height - 40;

    // Línea divisoria
    doc.strokeColor(COLORS.border)
       .lineWidth(0.5)
       .moveTo(PAGE_MARGIN, footerY - 10)
       .lineTo(PAGE_MARGIN + CONTENT_WIDTH, footerY - 10)
       .stroke();

    // Texto del pie de página
    doc.fontSize(7)
       .fillColor(COLORS.text)
       .font('Helvetica')
       .text(footerText, PAGE_MARGIN, footerY, {
         width: CONTENT_WIDTH * 0.7,
         align: 'left'
       });

    // Número de página
    doc.text(pageText.replace('{page}', (i + 1).toString()).replace('{total}', totalPages.toString()), 
             PAGE_MARGIN + CONTENT_WIDTH * 0.7, footerY, {
               width: CONTENT_WIDTH * 0.3,
               align: 'right'
             });
  }
}

module.exports = {
  generateExpensesPDF
};
