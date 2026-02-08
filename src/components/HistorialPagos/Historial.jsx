import React, { useState, useEffect } from 'react';
import { obtenerHistorialPagos } from '../../services/apiPagos';
import './Historial.css';

const Historial = ({ usuarioId }) => {
    const [historial, setHistorial] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [filtro, setFiltro] = useState('todos');
    const [totalPagado, setTotalPagado] = useState(0);

    useEffect(() => {
        cargarHistorial();
    }, [usuarioId]);

    const cargarHistorial = async () => {
        try {
            setCargando(true);
            const data = await obtenerHistorialPagos(usuarioId);
            setHistorial(data);
            
            // Calcular total pagado
            const total = data.reduce((sum, pago) => sum + pago.monto, 0);
            setTotalPagado(total);
        } catch (error) {
            console.error('Error cargando historial:', error);
        } finally {
            setCargando(false);
        }
    };

    const filtrarHistorial = () => {
        if (filtro === 'todos') return historial;
        
        const ahora = new Date();
        let fechaLimite = new Date();
        
        switch(filtro) {
            case 'mes':
                fechaLimite.setMonth(ahora.getMonth() - 1);
                break;
            case 'trimestre':
                fechaLimite.setMonth(ahora.getMonth() - 3);
                break;
            case 'año':
                fechaLimite.setFullYear(ahora.getFullYear() - 1);
                break;
            default:
                return historial;
        }
        
        return historial.filter(pago => new Date(pago.fecha) >= fechaLimite);
    };

    const exportarCSV = () => {
        const csv = [
            ['Fecha', 'ID Transacción', 'Método', 'Monto', 'Estado', 'Referencia'],
            ...filtrarHistorial().map(pago => [
                pago.fecha,
                pago.id,
                pago.metodo,
                `$${pago.monto}`,
                pago.estado,
                pago.referencia
            ])
        ].map(row => row.join(',')).join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `historial_pagos_${usuarioId}.csv`;
        a.click();
    };

    const historialFiltrado = filtrarHistorial();

    return (
        <div className="historial-container">
            <h2>📊 Historial de Pagos</h2>
            
            <div className="resumen-estadisticas">
                <div className="estadistica">
                    <h3>Total Pagado</h3>
                    <p className="monto-total">${totalPagado.toFixed(2)} MXN</p>
                </div>
                <div className="estadistica">
                    <h3>Transacciones</h3>
                    <p className="numero-transacciones">{historial.length}</p>
                </div>
                <div className="estadistica">
                    <h3>Último Pago</h3>
                    <p className="ultimo-pago">
                        {historial.length > 0 
                            ? new Date(historial[0].fecha).toLocaleDateString('es-MX')
                            : 'Sin pagos'
                        }
                    </p>
                </div>
            </div>

            <div className="controles-historial">
                <div className="filtros">
                    <label>Filtrar por:</label>
                    <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
                        <option value="todos">Todos los pagos</option>
                        <option value="mes">Último mes</option>
                        <option value="trimestre">Último trimestre</option>
                        <option value="año">Último año</option>
                    </select>
                </div>
                
                <button onClick={exportarCSV} className="btn-exportar">
                    📥 Exportar a CSV
                </button>
                
                <button onClick={cargarHistorial} className="btn-actualizar">
                    🔄 Actualizar
                </button>
            </div>

            {cargando ? (
                <div className="cargando">Cargando historial...</div>
            ) : historialFiltrado.length === 0 ? (
                <div className="sin-resultados">
                    <p>No hay pagos registrados para el periodo seleccionado.</p>
                </div>
            ) : (
                <div className="tabla-historial">
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>ID Transacción</th>
                                <th>Método</th>
                                <th>Monto</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historialFiltrado.map((pago, index) => (
                                <tr key={pago.id || index}>
                                    <td>{new Date(pago.fecha).toLocaleDateString('es-MX')}</td>
                                    <td className="id-transaccion">{pago.id}</td>
                                    <td>
                                        <span className={`badge metodo-${pago.metodo}`}>
                                            {pago.metodo === 'tarjeta' ? '💳' : 
                                             pago.metodo === 'transferencia' ? '🏦' : '📱'}
                                            {pago.metodo}
                                        </span>
                                    </td>
                                    <td className="monto">${pago.monto.toFixed(2)}</td>
                                    <td>
                                        <span className={`estado ${pago.estado}`}>
                                            {pago.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className="btn-detalle"
                                            onClick={() => alert(`Detalles del pago:\nID: ${pago.id}\nMonto: $${pago.monto}\nMétodo: ${pago.metodo}`)}
                                        >
                                            👁️ Ver
                                        </button>
                                        <button 
                                            className="btn-comprobante"
                                            onClick={() => window.open(`/comprobantes/${pago.id}.pdf`, '_blank')}
                                        >
                                            📄 PDF
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="leyenda">
                <p><span className="estado aprobado"></span> Aprobado</p>
                <p><span className="estado pendiente"></span> Pendiente</p>
                <p><span className="estado rechazado"></span> Rechazado</p>
            </div>
        </div>
    );
};

export default Historial;