import React, { useState } from 'react';
import { procesarPago } from '../services/apiPagos';
import './Checkout.css'; // Asume que tienes o crearás estilos

const Checkout = ({ usuarioId, montoTotal }) => {
  const [datosTarjeta, setDatosTarjeta] = useState({
    numero: '',
    nombre: '',
    expiracion: '',
    cvv: ''
  });
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null); // Para mensajes de error mejorados

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosTarjeta(prev => ({ ...prev, [name]: value }));
    // Limpiar error al empezar a escribir
    if (error) setError(null);
  };

  const validarCampos = () => {
    if (!datosTarjeta.numero || datosTarjeta.numero.length < 16) {
      setError('El número de tarjeta debe tener 16 dígitos');
      return false;
    }
    if (!datosTarjeta.nombre) {
      setError('El nombre en la tarjeta es requerido');
      return false;
    }
    // ... más validaciones
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validarCampos()) return;

    setProcesando(true);
    setMensaje(null);

    try {
      const resultado = await procesarPago({
        usuarioId,
        monto: montoTotal,
        ...datosTarjeta
      });

      if (resultado.exito) {
        setMensaje({ tipo: 'exito', texto: '¡Pago exitoso! Recibirás un comprobante por correo.' });
        // Limpiar formulario
        setDatosTarjeta({ numero: '', nombre: '', expiracion: '', cvv: '' });
      } else {
        setError(resultado.mensaje || 'Error al procesar el pago. Intenta de nuevo.');
      }
    } catch (err) {
      setError('Error de conexión. Verifica tu internet.');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Detalles de Pago</h2>
      <p className="monto-total">Total a pagar: ${montoTotal}</p>
      
      {error && (
        <div className="mensaje-error" role="alert">
          ⚠️ {error}
        </div>
      )}
      
      {mensaje && mensaje.tipo === 'exito' && (
        <div className="mensaje-exito" role="status">
          ✅ {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="campo">
          <label>Número de tarjeta:</label>
          <input
            type="text"
            name="numero"
            value={datosTarjeta.numero}
            onChange={handleChange}
            maxLength="16"
            placeholder="1234 5678 9012 3456"
            disabled={procesando}
          />
        </div>

        <div className="campo">
          <label>Nombre en la tarjeta:</label>
          <input
            type="text"
            name="nombre"
            value={datosTarjeta.nombre}
            onChange={handleChange}
            placeholder="Como aparece en la tarjeta"
            disabled={procesando}
          />
        </div>

        <div className="fila-campos">
          <div className="campo pequeño">
            <label>Expiración:</label>
            <input
              type="text"
              name="expiracion"
              value={datosTarjeta.expiracion}
              onChange={handleChange}
              placeholder="MM/AA"
              maxLength="5"
              disabled={procesando}
            />
          </div>

          <div className="campo pequeño">
            <label>CVV:</label>
            <input
              type="password"
              name="cvv"
              value={datosTarjeta.cvv}
              onChange={handleChange}
              maxLength="4"
              placeholder="123"
              disabled={procesando}
            />
          </div>
        </div>

        <button type="submit" disabled={procesando} className="btn-pagar">
          {procesando ? 'Procesando...' : 'Pagar ahora'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;