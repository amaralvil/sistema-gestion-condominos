import React, { useState } from 'react';
import { procesarPago, generarComprobante } from '../../services/apiPagos';
import './Checkout.css';

const Checkout = ({ usuario }) => {
    const [metodoPago, setMetodoPago] = useState('tarjeta');
    const [datosTarjeta, setDatosTarjeta] = useState({
        numero: '',
        nombre: '',
        vencimiento: '',
        cvv: ''
    });
    const [cargando, setCargando] = useState(false);
    const [comprobante, setComprobante] = useState(null);
    const [error, setError] = useState('');

    const montoCuota = usuario?.montoCuota || 1500.00;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        setError('');

        try {
            const datosPago = {
                usuarioId: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                monto: montoCuota,
                metodo: metodoPago,
                fecha: new Date().toISOString(),
                referencia: `PAGO-${Date.now()}`
            };

            if (metodoPago === 'tarjeta') {
                datosPago.datosTarjeta = datosTarjeta;
            }

            const resultado = await procesarPago(datosPago);
            
            if (resultado.estado === 'aprobado') {
                const comp = await generarComprobante(resultado.transaccionId);
                setComprobante(comp);
                alert('✅ Pago procesado exitosamente');
            } else {
                setError('El pago fue rechazado. Verifica tus datos.');
            }
        } catch (err) {
            setError('Error al procesar el pago: ' + err.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="checkout-container">
            <h2>💳 Pago de Cuota Condominal</h2>
            
            <div className="resumen-pago">
                <h3>Resumen del Pago</h3>
                <p><strong>Residente:</strong> {usuario.nombre}</p>
                <p><strong>ID Usuario:</strong> {usuario.id}</p>
                <p><strong>Monto a pagar:</strong> ${montoCuota.toFixed(2)} MXN</p>
                <p><strong>Fecha:</strong> {new Date().toLocaleDateString('es-MX')}</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="metodo-pago">
                    <h3>Selecciona método de pago:</h3>
                    <div className="opciones-metodo">
                        <label>
                            <input
                                type="radio"
                                value="tarjeta"
                                checked={metodoPago === 'tarjeta'}
                                onChange={(e) => setMetodoPago(e.target.value)}
                            />
                            🏦 Tarjeta de crédito/débito
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="transferencia"
                                checked={metodoPago === 'transferencia'}
                                onChange={(e) => setMetodoPago(e.target.value)}
                            />
                            📤 Transferencia bancaria
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="paypal"
                                checked={metodoPago === 'paypal'}
                                onChange={(e) => setMetodoPago(e.target.value)}
                            />
                            📱 PayPal
                        </label>
                    </div>
                </div>

                {metodoPago === 'tarjeta' && (
                    <div className="datos-tarjeta">
                        <h4>Datos de la tarjeta</h4>
                        <input
                            type="text"
                            placeholder="Número de tarjeta"
                            value={datosTarjeta.numero}
                            onChange={(e) => setDatosTarjeta({...datosTarjeta, numero: e.target.value})}
                            maxLength="16"
                        />
                        <input
                            type="text"
                            placeholder="Nombre como aparece en la tarjeta"
                            value={datosTarjeta.nombre}
                            onChange={(e) => setDatosTarjeta({...datosTarjeta, nombre: e.target.value})}
                        />
                        <div className="fila-tarjeta">
                            <input
                                type="text"
                                placeholder="MM/YY"
                                value={datosTarjeta.vencimiento}
                                onChange={(e) => setDatosTarjeta({...datosTarjeta, vencimiento: e.target.value})}
                            />
                            <input
                                type="text"
                                placeholder="CVV"
                                value={datosTarjeta.cvv}
                                onChange={(e) => setDatosTarjeta({...datosTarjeta, cvv: e.target.value})}
                                maxLength="3"
                            />
                        </div>
                    </div>
                )}

                {error && <div className="error-message">{error}</div>}

                <button 
                    type="submit" 
                    className="btn-pagar"
                    disabled={cargando}
                >
                    {cargando ? '⏳ Procesando...' : '✅ Realizar Pago'}
                </button>
            </form>

            {comprobante && (
                <div className="comprobante">
                    <h3>📄 Comprobante de Pago Generado</h3>
                    <div className="detalles-comprobante">
                        <p><strong>ID Transacción:</strong> {comprobante.id}</p>
                        <p><strong>Fecha y Hora:</strong> {comprobante.fecha}</p>
                        <p><strong>Monto Pagado:</strong> ${comprobante.monto} MXN</p>
                        <p><strong>Método:</strong> {comprobante.metodo}</p>
                        <p><strong>Estado:</strong> <span className="estado-aprobado">APROBADO</span></p>
                    </div>
                    <div className="acciones-comprobante">
                        <button onClick={() => window.print()}>🖨️ Imprimir</button>
                        <button onClick={() => alert('Comprobante guardado en tu historial')}>💾 Guardar</button>
                        <a href={`/comprobantes/${comprobante.id}.pdf`} target="_blank" rel="noopener noreferrer">
                            📥 Descargar PDF
                        </a>
                    </div>
                </div>
            )}

            <div className="info-seguridad">
                <p>🔒 Tus datos están protegidos con encriptación SSL</p>
                <p>💳 Aceptamos: Visa, MasterCard, American Express</p>
                <p>📞 Soporte: 01-800-123-4567</p>
            </div>
        </div>
    );
};

export default Checkout;