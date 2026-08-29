// app/services/auth.service.js
/**
 * services/auth.service.js
 * Lógica de negocio para autenticación.
 */

const authModel = require('../models/auth.model');
const AppError = require('../utils/AppError');

async function login({ correo, contrasena }) {
  const usuario = await authModel.findByEmail(correo);
  
  if (!usuario) {
    throw AppError.unauthorized('Credenciales inválidas. Verifica tu correo y contraseña.');
  }

  // NOTA: En producción usar bcrypt.compare()
  const passwordMatch = contrasena === usuario.contrasena;
  
  if (!passwordMatch) {
    throw AppError.unauthorized('Credenciales inválidas. Verifica tu correo y contraseña.');
  }

  const { contrasena: _, ...usuarioSinPassword } = usuario;

  return {
    usuario: usuarioSinPassword,
    token: `mock-token-${usuario.id_usuario}-${Date.now()}`
  };
}

async function registro(datosUsuario) {
  const {
    nombre,
    apellidos,
    telefono,
    correo,
    direccion,
    contrasena,
    tipo
  } = datosUsuario;

  const emailExists = await authModel.existsByEmail(correo);
  if (emailExists) {
    throw AppError.conflict('El correo electrónico ya está registrado');
  }

  const id_usuario = await authModel.generarIdUsuario('usuario');

  // NOTA: En producción usar bcrypt.hash()
  const hashedPassword = contrasena;

  const nuevoUsuario = await authModel.create({
    id_usuario,
    nombre,
    apellidos,
    telefono,
    direccion,
    correo,
    contrasena: hashedPassword,
    especializacion: null,
    tipo: tipo || 'principal',
    rol: 'usuario'
  });

  const { contrasena: _, ...usuarioSinPassword } = nuevoUsuario;

  return {
    usuario: usuarioSinPassword,
    token: `mock-token-${nuevoUsuario.id_usuario}-${Date.now()}`
  };
}

async function registroAdmin(datosUsuario, adminId) {
  const {
    nombre,
    apellidos,
    telefono,
    correo,
    direccion,
    contrasena,
    especializacion,
    tipo,
    rol
  } = datosUsuario;

  const admin = await authModel.findById(adminId);
  if (!admin || admin.rol !== 'admin') {
    throw AppError.forbidden('Solo los administradores pueden crear cuentas de otros roles');
  }

  const rolesPermitidos = ['admin', 'especialista', 'recepcionista'];
  if (!rolesPermitidos.includes(rol)) {
    throw AppError.badRequest(`El rol "${rol}" no puede ser creado por un administrador`);
  }

  const emailExists = await authModel.existsByEmail(correo);
  if (emailExists) {
    throw AppError.conflict('El correo electrónico ya está registrado');
  }

  const id_usuario = await authModel.generarIdUsuario(rol);
  const hashedPassword = contrasena;

  const nuevoUsuario = await authModel.create({
    id_usuario,
    nombre,
    apellidos,
    telefono,
    direccion,
    correo,
    contrasena: hashedPassword,
    especializacion: rol === 'especialista' ? especializacion : null,
    tipo: rol === 'usuario' ? (tipo || 'principal') : null,
    rol
  });

  const { contrasena: _, ...usuarioSinPassword } = nuevoUsuario;

  return {
    usuario: usuarioSinPassword,
    token: `mock-token-${nuevoUsuario.id_usuario}-${Date.now()}`
  };
}

module.exports = {
  login,
  registro,
  registroAdmin
};