let configuracionActual = {
  cuotaOrdinaria: 850, cuotaExtraordinaria: 0, periodoPago: 'mensual',
  multaPorMora: 5, diasGracia: 15, multaMinima: 50, interesMoratorio: 0.5
};

let versionConfig = 3;
let historialCambios = [
  { fecha: '2026-03-01', usuario: 'admin', descripcion: 'Configuración inicial', version: 1 },
  { fecha: '2026-03-15', usuario: 'admin', descripcion: 'Ajuste de cuota a $850', version: 2 },
  { fecha: '2026-04-01', usuario: 'admin', descripcion: 'Sprint 2 - Configuración base', version: 3 }
];

export const calcularMultaAutomatica = (monto, diasRetraso, config = null) => {
  const cfg = config || configuracionActual;
  const diasValidos = Math.max(0, diasRetraso - cfg.diasGracia);
  if (diasValidos <= 0) return 0;
  const multaPorcentaje = monto * (cfg.multaPorMora / 100);
  const interesDiario = monto * (cfg.interesMoratorio / 100) * diasValidos;
  let multaTotal = multaPorcentaje + interesDiario;
  if (multaTotal < cfg.multaMinima && multaTotal > 0) multaTotal = cfg.multaMinima;
  return parseFloat(multaTotal.toFixed(2));
};

export const validarReglasNegocio = (config) => {
  const errores = [];
  if (config.cuotaOrdinaria <= 0) errores.push('La cuota ordinaria debe ser mayor a 0');
  if (config.multaPorMora < 0 || config.multaPorMora > 100) errores.push('El porcentaje de multa debe estar entre 0% y 100%');
  if (config.diasGracia < 0 || config.diasGracia > 60) errores.push('Los días de gracia deben estar entre 0 y 60');
  if (config.interesMoratorio < 0 || config.interesMoratorio > 10) errores.push('El interés moratorio debe estar entre 0% y 10%');
  if (config.multaMinima < 0) errores.push('La multa mínima no puede ser negativa');
  return errores;
};

export const obtenerConfiguracionActual = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { ...configuracionActual };
};

export const guardarConfiguracion = async (nuevaConfig) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const cambios = [];
  for (const key of Object.keys(nuevaConfig)) {
    if (nuevaConfig[key] !== configuracionActual[key]) {
      cambios.push(`${key}: ${configuracionActual[key]} → ${nuevaConfig[key]}`);
    }
  }
  if (cambios.length > 0) {
    versionConfig++;
    historialCambios.unshift({ fecha: new Date().toISOString().slice(0, 10), usuario: 'admin', descripcion: cambios.join(', '), version: versionConfig });
    historialCambios = historialCambios.slice(0, 30);
  }
  configuracionActual = { ...nuevaConfig };
  return { exito: true, mensaje: 'Configuración guardada exitosamente', configuracion: configuracionActual, version: versionConfig };
};

export const obtenerHistorialCambios = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...historialCambios];
};