let perfilesUsuarios = {
  1: { nombre: 'Ana María Torres', email: 'ana.torres@condominio.com', telefono: '555-0101', unidad: 'Administración', rol: 'Administrador' },
  2: { nombre: 'Carlos López', email: 'carlos.lopez@condominio.com', telefono: '555-0102', unidad: '101', rol: 'Residente' }
};

let preferenciasUsuarios = {
  1: { emailRecordatorios: true, pushNotificaciones: true, smsAlertas: false },
  2: { emailRecordatorios: true, pushNotificaciones: false, smsAlertas: false }
};

export const obtenerPerfil = async (usuarioId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const perfil = perfilesUsuarios[usuarioId];
  if (!perfil) throw new Error('Perfil no encontrado');
  return { ...perfil };
};

export const actualizarPerfil = async (usuarioId, perfilData) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  if (perfilesUsuarios[usuarioId]) {
    perfilesUsuarios[usuarioId] = { ...perfilesUsuarios[usuarioId], ...perfilData };
    return { exito: true };
  }
  throw new Error('Perfil no encontrado');
};

export const cambiarContrasena = async (usuarioId, actual, nueva) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (!actual) throw new Error('Contraseña actual incorrecta');
  return { exito: true };
};

export const obtenerPreferencias = async (usuarioId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return { ...preferenciasUsuarios[usuarioId] };
};

export const actualizarPreferencias = async (usuarioId, preferencias) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  preferenciasUsuarios[usuarioId] = { ...preferencias };
  return { exito: true };
};