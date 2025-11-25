const authService = require('../services/auth.service');

// Controlador para registro
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    
    const result = await authService.registerUser({ name, email, password });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

// Controlador para login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    
    const result = await authService.loginUser({ email, password });

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login
};


