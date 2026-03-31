import React, { useState, useEffect } from 'react';
import { obtenerConfiguracionActual, guardarConfiguracion, obtenerHistorialCambios, calcularMultaAutomatica, validarReglasNegocio } from '../services/apiConfigCuotasCompleto';
import '../styles/ConfigCuotasCompleto.css';

const ConfigCuotasCompleto = () => {
  const [configuracion, setConfiguacion] = useState({
    cuotaOrdinaria: 850, cuotaExtraordinaria: 0, periodoPago: 'mensual',
    multaPorMora: 5, diasGracia: 15, multaMinima: 50, interesMoratorio: 0.5
  });
  const [historial, setHistorial] = useState([]);
  const [simulacion, setSimulacion] = useState({ monto: 850, diasRetraso: 0, multa: 0, total: 850 });
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [erroresValidacion, setErroresValidacion] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      const data = await obtenerConfiguracionActual();
      setConfiguacion(data);
      const historialData = await obtenerHistorialCambios();
      setHistorial(historialData);
      actualizarSimulacion(data.cuotaOrdinaria, 0, data);
    };
    cargarDatos();
  }, []);

  const actualizarSimulacion = (monto, diasRetraso, config) => {
    const multa = calcularMultaAutomatica(monto, diasRetraso, config);
    setSimulacion({ monto, diasRetraso, multa, total: monto + multa });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nuevaConfig = { ...configuracion, [name]: parseFloat(value) || value };
    setConfiguacion(nuevaConfig);
    setErroresValidacion(validarReglasNegocio(nuevaConfig));
    actualizarSimulacion(simulacion.monto, simulacion.diasRetraso, nuevaConfig);
  };

  const handleSimulacionChange = (e) => {
    const { name, value } = e.target;
    const nuevosValores = { ...simulacion, [name]: parseFloat(value) || 0 };
    setSimulacion(nuevosValores);
    const multa = calcularMultaAutomatica(nuevosValores.monto, nuevosValores.diasRetraso, configuracion);
    setSimulacion(prev => ({ ...prev, multa, total: prev.monto + multa }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validacion = validarReglasNegocio(configuracion);
    if (validacion.length > 0) {
      setMensaje({ tipo: 'error', texto: 'Corrige los errores antes de guardar' });
      setErroresValidacion(validacion);
      return;
    }
    setCargando(true);
    try {
      const resultado = await guardarConfiguracion(configuracion);
      setMensaje({ tipo: 'exito', texto: resultado.mensaje });
      const historialData = await obtenerHistorialCambios();
      setHistorial(historialData);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error al guardar la configuración' });
    }
    setCargando(false);
  };

  return (
    <div className="config-cuotas-completo">
      <h1>Configuración de Cuotas y Multas</h1>
      {mensaje && <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>}
      {erroresValidacion.length > 0 && (
        <div className="errores-validacion"><h4>⚠️ Errores de validación:</h4><ul>{erroresValidacion.map((err, idx) => <li key={idx}>{err}</li>)}</ul></div>
      )}
      <div className="grid-configuracion">
        <form onSubmit={handleSubmit} className="form-config">
          <h3>Parámetros de Cuotas</h3>
          <div className="campo"><label>Cuota Ordinaria Mensual ($):</label><input type="number" name="cuotaOrdinaria" value={configuracion.cuotaOrdinaria} onChange={handleChange} required /></div>
          <div className="campo"><label>Cuota Extraordinaria ($):</label><input type="number" name="cuotaExtraordinaria" value={configuracion.cuotaExtraordinaria} onChange={handleChange} /></div>
          <div className="campo"><label>Periodo de Pago:</label><select name="periodoPago" value={configuracion.periodoPago} onChange={handleChange}><option value="mensual">Mensual</option><option value="bimestral">Bimestral</option><option value="trimestral">Trimestral</option></select></div>
          <h3>Multas por Mora</h3>
          <div className="campo"><label>Porcentaje de Multa (%):</label><input type="number" step="0.5" name="multaPorMora" value={configuracion.multaPorMora} onChange={handleChange} /></div>
          <div className="campo"><label>Multa Mínima ($):</label><input type="number" name="multaMinima" value={configuracion.multaMinima} onChange={handleChange} /></div>
          <div className="campo"><label>Interés Moratorio Diario (%):</label><input type="number" step="0.1" name="interesMoratorio" value={configuracion.interesMoratorio} onChange={handleChange} /></div>
          <div className="campo"><label>Días de Gracia:</label><input type="number" name="diasGracia" value={configuracion.diasGracia} onChange={handleChange} min="0" max="30" /></div>
          <button type="submit" disabled={cargando} className="btn-guardar">{cargando ? 'Guardando...' : 'Guardar Configuración'}</button>
        </form>
        <div className="simulador-multas">
          <h3>📊 Simulador de Multas</h3>
          <div className="campo"><label>Monto de cuota ($):</label><input type="number" name="monto" value={simulacion.monto} onChange={handleSimulacionChange} /></div>
          <div className="campo"><label>Días de retraso:</label><input type="number" name="diasRetraso" value={simulacion.diasRetraso} onChange={handleSimulacionChange} min="0" /></div>
          <div className="resultado-simulacion"><p>Multa calculada: <strong>${simulacion.multa.toFixed(2)}</strong></p><p>Total a pagar: <strong>${simulacion.total.toFixed(2)}</strong></p></div>
        </div>
      </div>
      <div className="historial-completo">
        <h3>Historial de Cambios (Auditoría)</h3>
        <table className="tabla-historial"><thead><tr><th>Fecha</th><th>Usuario</th><th>Cambio realizado</th><th>Versión</th></tr></thead><tbody>{historial.map((item, idx) => <tr key={idx}><td>{item.fecha}</td><td>{item.usuario}</td><td>{item.descripcion}</td><td>{item.version}</td></tr>)}</tbody></table>
      </div>
    </div>
  );
};

export default ConfigCuotasCompleto;