import React, { useState, useEffect } from 'react';
import { obtenerHistorial } from '../services/apiPagos';
import './Historial.css';

const Historial = ({ usuarioId }) => {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const cargarHistorial = async () => {
      setCargando(true);
      const datos = await obtenerHistorial(usuarioId);
      setHistorial(datos);
      setCargando(false);
    };
    cargarHistorial();
  }, [usuarioId]);

  const exportarCSV = () => {
    const encabezados = ['Fecha', 'Concepto', 'Monto', 'Estado'];
    const filas = historialFiltrado.map(item => 
      [item.fecha, item.concepto, item.monto, item.estado]
    );
    
    const csvContent = [encabezados, ...filas]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historial-pagos.csv';
    a.click();
  };

  const historialFiltrado = historial.filter(item =>
    item.concepto.toLowerCase().includes(filtro.toLowerCase()) ||
    item.fecha.includes(filtro)
  );

  const totalAdeudos = historial
    .filter(item => item.estado === 'Adeudo')
    .reduce((sum, item) => sum + item.monto, 0);

  if (cargando) return <div className="cargando">Cargando historial...</div>;

  return (
    <div className="historial-container">
      <h2>Historial de Pagos</h2>
      
      <div className="resumen">
        <div className="tarjeta-resumen">
          <span className="label">Total pagado:</span>
          <span className="valor">
            ${historial.filter(i => i.estado === 'Pagado').reduce((s, i) => s + i.monto, 0)}
          </span>
        </div>
        <div className="tarjeta-resumen adeudo">
          <span className="label">Adeudo total:</span>
          <span className="valor">${totalAdeudos}</span>
        </div>
      </div>

      <div className="controles">
        <input
          type="text"
          placeholder="Buscar por fecha o concepto..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="buscador"
        />
        <button onClick={exportarCSV} className="btn-exportar">
          Exportar a CSV
        </button>
      </div>

      <table className="tabla-historial">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Concepto</th>
            <th>Monto</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {historialFiltrado.map((item, index) => (
            <tr key={index} className={item.estado === 'Adeudo' ? 'fila-adeudo' : ''}>
              <td>{item.fecha}</td>
              <td>{item.concepto}</td>
              <td>${item.monto}</td>
              <td>
                <span className={`estado-badge ${item.estado.toLowerCase()}`}>
                  {item.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {historialFiltrado.length === 0 && (
        <p className="sin-resultados">No se encontraron registros</p>
      )}
    </div>
  );
};

export default Historial;