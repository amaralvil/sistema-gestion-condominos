const pasarelasDisponibles = [
  { id: 'mercadopago', nombre: 'Mercado Pago' },
  { id: 'stripe', nombre: 'Stripe' },
  { id: 'paypal', nombre: 'PayPal' }
];

export const obtenerPasarelasDisponibles = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...pasarelasDisponibles];
};

export const procesarPagoReal = async (datosPago) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  const tarjetaLimpia = datosPago.datosTarjeta.numeroTarjeta.replace(/\s/g, '');
  if (tarjetaLimpia === '4111111111111111') {
    return { exito: false, mensaje: 'Pago rechazado: fondos insuficientes' };
  }
  return {
    exito: true,
    idTransaccion: `TRX-${Date.now()}`,
    mensaje: 'Pago aprobado',
    pasarela: datosPago.pasarela,
    monto: datosPago.monto,
    fecha: new Date().toISOString()
  };
};

export const verificarEstadoPago = async (idTransaccion) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    estado: 'confirmado',
    fechaConfirmacion: new Date().toISOString(),
    comprobante: `https://api.condominios.com/comprobantes/${idTransaccion}.pdf`
  };
};