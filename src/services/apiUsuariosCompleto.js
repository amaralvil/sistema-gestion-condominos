let usuariosSimulados = [
  { id: 1, nombre: 'Ana María Torres', email: 'ana.torres@condominio.com', rol: { id: 1, nombre: 'Administrador' }, unidad: 'Administración', telefono: '555-0101', dosFactorActivado: true, activo: true },
  { id: 2, nombre: 'Carlos López', email: 'carlos.lopez@condominio.com', rol: { id: 2, nombre: 'Residente' }, unidad: '101', telefono: '555-0102', dosFactorActivado: false, activo: true },
  { id: 3, nombre: 'María Fernández', email: 'maria.fernandez@condominio.com', rol: { id: 2, nombre: 'Residente' }, unidad: '205', telefono: '555-0103', dosFactorActivado: false, activo: true }
];

const rolesSimulados = [
  { id: 1, nombre: 'Administrador', descripcion: 'Acceso total al sistema' },
  { id: 2, nombre: 'Residente', descripcion: 'Acceso a pagos, historial y perfil' },
  { id: 3, nombre: 'Seguridad', descripcion: 'Acceso a control de accesos y emergencias' }
];

let nextId = 4;

export const obtenerUsuarios = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return [...usuariosSimulados];
};

export const obtenerRoles = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return [...rolesSimulados];
};

export const crearUsuario = async (usuarioData) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  if (usuariosSimulados.some(u => u.email === usuarioData.email)) throw new Error('El email ya está registrado');
  const rolEncontrado = rolesSimulados.find(r => r.id === parseInt(usuarioData.rol));
  if (!rolEncontrado) throw new Error('Rol no válido');
  const nuevoUsuario = { id: nextId++, nombre: usuarioData.nombre, email: usuarioData.email, rol: rolEncontrado, unidad: usuarioData.unidad, telefono: usuarioData.telefono || '', dosFactorActivado: false, activo: true, fechaRegistro: new Date().toISOString().slice(0, 10) };
  usuariosSimulados.push(nuevoUsuario);
  return nuevoUsuario;
};

export const actualizarUsuario = async (id, usuarioData) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const index = usuariosSimulados.findIndex(u => u.id === id);
  if (index === -1) throw new Error('Usuario no encontrado');
  const rolEncontrado = rolesSimulados.find(r => r.id === parseInt(usuarioData.rol));
  if (!rolEncontrado) throw new Error('Rol no válido');
  usuariosSimulados[index] = { ...usuariosSimulados[index], nombre: usuarioData.nombre, email: usuarioData.email, rol: rolEncontrado, unidad: usuarioData.unidad, telefono: usuarioData.telefono || '' };
  return usuariosSimulados[index];
};

export const eliminarUsuario = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = usuariosSimulados.findIndex(u => u.id === id);
  if (index === -1) throw new Error('Usuario no encontrado');
  usuariosSimulados.splice(index, 1);
  return { exito: true };
};

export const generarCodigo2FA = () => Math.floor(100000 + Math.random() * 900000).toString();
export const validarCodigo2FA = (input, codigo) => input === codigo;

export const activar2FA = async (usuarioId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = usuariosSimulados.findIndex(u => u.id === usuarioId);
  if (index !== -1) { usuariosSimulados[index].dosFactorActivado = true; return { exito: true }; }
  return { exito: false };
};

export const enviarNotificacion = async (email, mensaje) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log(`📧 Notificación enviada a ${email}: ${mensaje}`);
  return { exito: true };
};