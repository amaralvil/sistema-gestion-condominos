// Simulación de API para pagos e historial
// Avance Sprint 1: 80% (pendiente integración real)

// Función para procesar pago (simulada)
export const procesarPago = async (datosPago) => {
  console.log('🔵 [API Simulada] Procesando pago:', datosPago);
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simular respuesta exitosa (o error)
  if (datosPago.monto && datosPago.monto > 0) {
    return {
      exito: true,
      mensaje: 'Pago procesado exitosamente (simulación)',
      idTransaccion: 'SIM-' + Date.now()
    };
  } else {
    return {
      exito: false,
      mensaje: 'Error: Monto inválido'
    };
  }
};

// Función para obtener historial (simulada)
export const obtenerHistorial = async (usuarioId) => {
  console.log('🔵 [API Simulada] Obteniendo historial para:', usuarioId);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Datos de ejemplo
  return [
    { fecha: '2026-02-01', concepto: 'Cuota mantenimiento', monto: 850, estado: 'Pagado' },
    { fecha: '2026-01-01', concepto: 'Cuota mantenimiento', monto: 850, estado: 'Pagado' },
    { fecha: '2025-12-01', concepto: 'Cuota mantenimiento', monto: 850, estado: 'Pagado' },
    { fecha: '2025-11-01', concepto: 'Cuota mantenimiento', monto: 850, estado: 'Adeudo' },
  ];
};