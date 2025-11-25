const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');

// Registrar un nuevo usuario
async function registerUser(userData) {
  const { name, email, password } = userData;

  // Verificar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    const error = new Error('El email ya está registrado');
    error.statusCode = 409;
    throw error;
  }

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear usuario
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true
    }
  });

  // Generar token JWT
  const token = generateToken(user.id);

  return {
    user,
    token
  };
}

// Iniciar sesión
async function loginUser(credentials) {
  const { email, password } = credentials;

  // Buscar usuario
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  // Verificar contraseña
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  // Generar token JWT
  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    },
    token
  };
}

// Generar token JWT
function generateToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

module.exports = {
  registerUser,
  loginUser,
  generateToken
};


