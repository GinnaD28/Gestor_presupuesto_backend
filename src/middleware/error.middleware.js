// Middleware para manejo centralizado de errores
const errorMiddleware = (err, req, res, next) => {
  // Error de validación de express-validator
  if (err.array && typeof err.array === 'function') {
    const errors = err.array();
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: errors.map(error => ({
        field: error.path || error.param,
        message: error.msg
      }))
    });
  }

  // Error de Prisma
  if (err.code && err.code.startsWith('P')) {
    let statusCode = 500;
    let message = 'Error en la base de datos';

    // Error de duplicado
    if (err.code === 'P2002') {
      statusCode = 409;
      message = 'El registro ya existe';
    }

    // Error de registro no encontrado
    if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Registro no encontrado';
    }

    return res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado'
    });
  }

  // Error personalizado con statusCode
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message || 'Error en la solicitud',
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  // Error genérico
  console.error('Error no manejado:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorMiddleware;


