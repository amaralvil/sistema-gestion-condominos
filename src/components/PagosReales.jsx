import React, { useState, useEffect } from 'react';
import { procesarPagoReal, verificarEstadoPago, obtenerPasarelasDisponibles } from '../services/apiPagosReales';
import '../styles/PagosReales.css';

const PagosReales = ({ usuarioId, montoTotal, onPagoExitoso }) => {
  const [pasarelas, setPasarelas] = useState([]);
  const [pasarelaSeleccionada, setPasarelaSeleccionada] = useState('');
  const [datosPago, setDatosPago] = useState({
    numeroTarjeta: '',
    nombreTitular: '',
    fechaExpiracion: '',
    cvv: ''
  });
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [webhookEstado, setWebhookEstado] = useState(null);

  useEffect(() => {
    const cargarPasarelas = async () => {
      const pasarelasData = await obtenerPasarelasDisponibles();
      setPasarelas(pasarelasData);
      if (pasarelasData.length > 0) {
        setPasarelaSeleccionada(pasarelasData[0].id);
      }
    };
    cargarPasarelas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatosPago(prev => ({ ...prev, [name]: value }));
    if (mensaje?.tipo === 'error') setMensaje(null);
  };

  const validarCampos = () => {
    const tarjetaLimpia = datosPago.numeroTarjeta.replace(/\s/g, '');
    if (!datosPago.numeroTarjeta || tarjetaLimpia.length < 16) {
      setMensaje({ tipo: 'error', texto: 'Número de tarjeta inválido (16 dígitos requeridos)' });
      return false;
    }
    if (!datosPago.nombreTitular) {
      setMensaje({ tipo: 'error', texto: 'Nombre del titular es requerido' });
      return false;
    }
    if (!datosPago.fechaExpiracion || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(datosPago.fechaExpiracion)) {
      setMensaje({ tipo: 'error', texto: 'Fecha de expiración inválida (MM/AA)' });
      return false;
    }
    if (!datosPago.cvv || datosPago.cvv.length < 3) {
      setMensaje({ tipo: 'error', texto: 'CVV inválido (3-4 dígitos)' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;
    if (!pasarelaSeleccionada) {
      setMensaje({ tipo: 'error', texto: 'Selecciona una pasarela de pago' });
      return;
    }

    setProcesando(true);
    setMensaje(null);
    setWebhookEstado(null);

    try {
      const resultado = await procesarPagoReal({
        usuarioId,
        monto: montoTotal,
        pasarela: pasarelaSeleccionada,
        datosTarjeta: datosPago
      });

      if (resultado.exito) {
        setMensaje({ tipo: 'exito', texto: `✅ Pago exitoso! ID Transacción: ${resultado.idTransaccion}` });
        const webhookResult = await verificarEstadoPago(resultado.idTransaccion);
        setWebhookEstado(webhookResult);
        setDatosPago({ numeroTarjeta: '', nombreTitular: '', fechaExpiracion: '', cvv: '' });
        if (onPagoExitoso) onPagoExitoso(resultado);
      } else {
        setMensaje({ tipo: 'error', texto: resultado.mensaje || 'Error al procesar el pago' });
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error de conexión con la pasarela de pago' });
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="pagos-reales-container">
      <h2>Pago de Cuotas</h2>
      <p className="monto-total">Total a pagar: <strong>${montoTotal}</strong></p>
      {mensaje && <div className={`mensaje-pago ${mensaje.tipo}`}>{mensaje.texto}</div>}
      {webhookEstado && (
        <div className="webhook-confirmacion">
          <h4>Confirmación de pago:</h4>
          <p>Estado: {webhookEstado.estado}</p>
          <p>Fecha: {webhookEstado.fechaConfirmacion}</p>
          {webhookEstado.comprobante && <a href={webhookEstado.comprobante} target="_blank" rel="noopener noreferrer">Descargar comprobante</a>}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="campo-pasarela">
          <label>Pasarela de pago:</label>
          <select value={pasarelaSeleccionada} onChange={(e) => setPasarelaSeleccionada(e.target.value)} disabled={procesando}>
            {pasarelas.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>
        <div className="campo-pago"><label>Número de tarjeta:</label><input type="text" name="numeroTarjeta" value={datosPago.numeroTarjeta} onChange={handleInputChange} placeholder="1234 5678 9012 3456" maxLength="19" disabled={procesando} /></div>
        <div className="campo-pago"><label>Nombre del titular:</label><input type="text" name="nombreTitular" value={datosPago.nombreTitular} onChange={handleInputChange} placeholder="Como aparece en la tarjeta" disabled={procesando} /></div>
        <div className="fila-pago">
          <div className="campo-pago mitad"><label>Fecha expiración (MM/AA):</label><input type="text" name="fechaExpiracion" value={datosPago.fechaExpiracion} onChange={handleInputChange} placeholder="12/25" maxLength="5" disabled={procesando} /></div>
          <div className="campo-pago mitad"><label>CVV:</label><input type="password" name="cvv" value={datosPago.cvv} onChange={handleInputChange} placeholder="123" maxLength="4" disabled={procesando} /></div>
        </div>
        <button type="submit" disabled={procesando} className="btn-pagar-real">{procesando ? 'Procesando pago...' : 'Pagar ahora'}</button>
      </form>
      <div className="info-seguridad"><p>🔒 Pago 100% seguro. Cumple con estándar PCI-DSS.</p></div>
    </div>
  );
};

export default PagosReales;