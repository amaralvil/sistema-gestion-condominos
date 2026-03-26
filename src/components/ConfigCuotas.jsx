import React, { useState, useEffect } from 'react';
import { obtenerConfiguracionActual, guardarConfiguracion, obtenerHistorialCambios } from '../services/apiConfigCuotas';
import './ConfigCuotas.css';

const ConfigCuotas = () => {
  const [configuracion, setConfiguracion] = useState({
    cuotaOrdinaria: '',
    cuotaExtraordinaria: '',
    periodoPago: 'mensual',
    multaPorMora: '',
    diasGracia: 15
  });
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [historial, setHistorial] = useState([]);

  // Cargar configuración actual al montar
  useEffect(() => {
    const cargarConfig = async () => {
      const data = await obtenerConfiguracionActual();
      setConfiguracion(data);
      const historialData = await obtenerHistorialCambios();
      setHistorial(historialData);
    };
    cargarConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfiguracion(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);
    
    try {
      const resultado = await guardarConfiguracion(configuracion);
      setMensaje({ tipo: 'exito', texto: resultado.mensaje });
      // Recargar historial
      const historialData = await obtenerHistorialCambios();
      setHistorial(historialData);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error al guardar la configuración' });
    }
    setCargando(false);
  };

  return (
    <div className="config-cuotas-container">
      <h1>Configuración de Cuotas y Multas</h1>
      
      {mensaje && (
        <div className={`mensaje ${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-configuracion">
        <div className="seccion">
          <h3>Cuotas</h3>
          <div className="campo">
            <label>Cuota Ordinaria Mensual ($):</label>
            <input type="number" name="cuotaOrdinaria" value={configuracion.cuotaOrdinaria} onChange={handleChange} required />
          </div>
          <div className="campo">
            <label>Cuota Extraordinaria ($):</label>
            <input type="number" name="cuotaExtraordinaria" value={configuracion.cuotaExtraordinaria} onChange={handleChange} />
          </div>
        </div>

        <div className="seccion">
          <h3>Periodos de Pago</h3>
          <div className="campo">
            <label>Periodicidad:</label>
            <select name="periodoPago" value={configuracion.periodoPago} onChange={handleChange}>
              <option value="mensual">Mensual</option>
              <option value="bimestral">Bimestral</option>
              <option value="trimestral">Trimestral</option>
            </select>
          </div>
          <div className="campo">
            <label>Días de Gracia:</label>
            <input type="number" name="diasGracia" value={configuracion.diasGracia} onChange={handleChange} min="0" max="30" />
          </div>
        </div>

        <div className="seccion">
          <h3>Multas por Mora</h3>
          <div className="campo">
            <label>Porcentaje de Multa (%):</label>
            <input type="number" step="0.01" name="multaPorMora" value={configuracion.multaPorMora} onChange={handleChange} />
            <small className="nota">(Pendiente implementar cálculo automático para Sprint 3)</small>
          </div>
        </div>

        <button type="submit" disabled={cargando} className="btn-guardar">
          {cargando ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </form>

      {/* Historial de cambios (avance 80% - pendiente completar en Sprint 3) */}
      <div className="historial-cambios">
        <h3>Historial de Cambios</h3>
        {historial.length === 0 ? (
          <p className="sin-datos">No hay cambios registrados aún.</p>
        ) : (
          <table className="tabla-historial">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Cambio Realizado</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.fecha}</td>
                  <td>{item.usuario}</td>
                  <td>{item.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="aviso-pendiente">⚠️ Funcionalidad completa en Sprint 3 (cálculo automático de multas y auditoría completa)</p>
      </div>
    </div>
  );
};

export default ConfigCuotas;