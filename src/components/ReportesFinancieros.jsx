import React, { useState, useEffect } from 'react';
import { generarReportePDF, generarReporteExcel, obtenerDashboard, obtenerAlertasMorosidad } from '../services/apiReportes';
import './ReportesFinancieros.css';

const ReportesFinancieros = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    residente: '',
    estado: 'todos'
  });
  const [reporteGenerando, setReporteGenerando] = useState(false);

  // Cargar datos del dashboard al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      const dashboard = await obtenerDashboard();
      const alertasData = await obtenerAlertasMorosidad();
      setDashboardData(dashboard);
      setAlertas(alertasData);
      setCargando(false);
    };
    cargarDatos();
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleExportarPDF = async () => {
    setReporteGenerando(true);
    try {
      const pdfBlob = await generarReportePDF(filtros);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-financiero-${new Date().toISOString().slice(0,10)}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el reporte PDF');
    }
    setReporteGenerando(false);
  };

  const handleExportarExcel = async () => {
    setReporteGenerando(true);
    try {
      const excelBlob = await generarReporteExcel(filtros);
      const url = window.URL.createObjectURL(excelBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-financiero-${new Date().toISOString().slice(0,10)}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al generar Excel:', error);
      alert('Error al generar el reporte Excel');
    }
    setReporteGenerando(false);
  };

  if (cargando) {
    return <div className="cargando">Cargando datos del dashboard...</div>;
  }

  return (
    <div className="reportes-container">
      <h1>Reportes Financieros</h1>
      
      {/* Sección de alertas de morosidad */}
      {alertas.length > 0 && (
        <div className="alertas-morosidad">
          <h3>⚠️ Alertas de Morosidad Temprana</h3>
          <ul>
            {alertas.map((alerta, idx) => (
              <li key={idx}>
                <strong>{alerta.residente}</strong>: {alerta.mensaje} 
                (Adeudo: ${alerta.montoAdeudo})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Dashboard con métricas clave */}
      {dashboardData && (
        <div className="dashboard-metricas">
          <div className="tarjeta-metrica">
            <span className="label">Recaudación Mensual</span>
            <span className="valor">${dashboardData.recaudacionMensual}</span>
          </div>
          <div className="tarjeta-metrica">
            <span className="label">Tasa de Morosidad</span>
            <span className="valor">{dashboardData.tasaMorosidad}%</span>
          </div>
          <div className="tarjeta-metrica">
            <span className="label">Flujo de Caja</span>
            <span className="valor">${dashboardData.flujoCaja}</span>
          </div>
          <div className="tarjeta-metrica">
            <span className="label">Pagos Pendientes</span>
            <span className="valor">{dashboardData.pagosPendientes}</span>
          </div>
        </div>
      )}

      {/* Panel de filtros */}
      <div className="panel-filtros">
        <h3>Filtros para Reportes</h3>
        <div className="filtros-grid">
          <div className="campo">
            <label>Fecha Inicio:</label>
            <input type="date" name="fechaInicio" value={filtros.fechaInicio} onChange={handleFiltroChange} />
          </div>
          <div className="campo">
            <label>Fecha Fin:</label>
            <input type="date" name="fechaFin" value={filtros.fechaFin} onChange={handleFiltroChange} />
          </div>
          <div className="campo">
            <label>Residente:</label>
            <input type="text" name="residente" placeholder="Nombre o unidad" value={filtros.residente} onChange={handleFiltroChange} />
          </div>
          <div className="campo">
            <label>Estado de Pago:</label>
            <select name="estado" value={filtros.estado} onChange={handleFiltroChange}>
              <option value="todos">Todos</option>
              <option value="pagado">Pagado</option>
              <option value="adeudo">Adeudo</option>
              <option value="parcial">Parcial</option>
            </select>
          </div>
        </div>
        <div className="acciones-exportar">
          <button onClick={handleExportarPDF} disabled={reporteGenerando} className="btn-pdf">
            {reporteGenerando ? 'Generando...' : '📄 Exportar a PDF'}
          </button>
          <button onClick={handleExportarExcel} disabled={reporteGenerando} className="btn-excel">
            {reporteGenerando ? 'Generando...' : '📊 Exportar a Excel'}
          </button>
        </div>
      </div>

      {/* Vista previa de resultados (opcional) */}
      <div className="vista-previa">
        <h3>Vista Previa del Reporte</h3>
        <p className="info-previa">
          Los filtros seleccionados generarán un reporte con {dashboardData?.totalRegistros || 0} registros.
          Utilice los botones de exportación para obtener el archivo completo.
        </p>
      </div>
    </div>
  );
};

export default ReportesFinancieros;