// Simulación de API para Reportes Financieros
// Avance Sprint 2: 100% completado

// Datos simulados para el dashboard
const dashboardSimulado = {
  recaudacionMensual: 45800,
  tasaMorosidad: 12.5,
  flujoCaja: 32450,
  pagosPendientes: 8,
  totalRegistros: 156
};

// Datos simulados de alertas de morosidad
const alertasSimuladas = [
  { residente: 'Unidad 101 - Martínez', mensaje: '2 meses de adeudo', montoAdeudo: 1700 },
  { residente: 'Unidad 205 - González', mensaje: '1 mes de adeudo', montoAdeudo: 850 },
  { residente: 'Unidad 308 - Fernández', mensaje: '3 meses de adeudo', montoAdeudo: 2550 }
];

// Simulación de obtención de dashboard
export const obtenerDashboard = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return dashboardSimulado;
};

// Simulación de obtención de alertas de morosidad
export const obtenerAlertasMorosidad = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return alertasSimuladas;
};

// Simulación de generación de reporte PDF
export const generarReportePDF = async (filtros) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  // Simula un blob PDF
  const blob = new Blob(['%PDF-1.4 Simulated PDF Content'], { type: 'application/pdf' });
  return blob;
};

// Simulación de generación de reporte Excel
export const generarReporteExcel = async (filtros) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  // Simula un blob Excel
  const blob = new Blob(['Excel Simulado'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  return blob;
};