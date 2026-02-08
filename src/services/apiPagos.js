// Servicio de API para manejo de pagos
const API_BASE_URL = 'https://api.condominos.equipo4.com/v1';
const MOCK_API = true; // Cambiar a false cuando tengas backend real

// Datos mock para desarrollo
const pagosMock = [
    {
        id: 'TXN-001',
        usuarioId: 'USR001',
        fecha: '2025-03-15T10:30:00',
        metodo: 'tarjeta',
        monto: 1500.00,
        estado: 'aprobado',
        referencia: 'CUOTA-MAR-2025'
    },
    {
        id: 'TXN-002',
        usuarioId: 'USR001',
        fecha: '2025-02-10T14:45:00',
        metodo: 'transferencia',
        monto: 1500.00,
        estado: 'aprobado',
        referencia: 'CUOTA-FEB-2025'
    },
    {
        id: 'TXN-003',
        usuarioId: 'USR001',
        fecha: '2025-01-05T09:15:00',
        metodo: 'paypal',
        monto: 1500.00,
        estado: 'aprobado',
        referencia: 'CUOTA-ENE-2025'
    }
];

export const procesarPago = async (datosPago) => {
    if (MOCK_API) {
        // Simulación de API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const transaccionId = `TXN-${Date.now()}`;
        const esValido = datosPago.metodo !== 'rechazado';
        
        return {
            success: esValido,
            estado: esValido ? 'aprobado' : 'rechazado',
            transaccionId,
            mensaje: esValido ? 'Pago procesado exitosamente' : 'Pago rechazado',
            fecha: new Date().toISOString(),
            monto: datosPago.monto,
            metodo: datosPago.metodo
        };
    }
    
    // Implementación real con fetch
    try {
        const response = await fetch(`${API_BASE_URL}/pagos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(datosPago)
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error procesando pago:', error);
        throw error;
    }
};

export const obtenerHistorialPagos = async (usuarioId) => {
    if (MOCK_API) {
        // Simulación de delay de red
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Filtrar por usuario si se proporciona ID
        let resultados = pagosMock;
        if (usuarioId) {
            resultados = pagosMock.filter(pago => pago.usuarioId === usuarioId);
        }
        
        return resultados;
    }
    
    try {
        const endpoint = usuarioId 
            ? `${API_BASE_URL}/pagos/historial/${usuarioId}`
            : `${API_BASE_URL}/pagos/historial`;
            
        const response = await fetch(endpoint, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error obteniendo historial:', error);
        throw error;
    }
};

export const generarComprobante = async (transaccionId) => {
    if (MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
            id: transaccionId,
            fecha: new Date().toLocaleString('es-MX'),
            monto: 1500.00,
            metodo: 'tarjeta',
            estado: 'aprobado',
            pdfUrl: `/comprobantes/${transaccionId}.pdf`
        };
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/comprobantes/${transaccionId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error generando comprobante:', error);
        throw error;
    }
};

export const obtenerEstadisticasPagos = async (usuarioId) => {
    if (MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const historial = await obtenerHistorialPagos(usuarioId);
        const total = historial.reduce((sum, pago) => sum + pago.monto, 0);
        const promedio = historial.length > 0 ? total / historial.length : 0;
        
        return {
            totalPagado: total,
            numeroTransacciones: historial.length,
            promedioMonto: promedio,
            ultimoPago: historial.length > 0 ? historial[0].fecha : null
        };
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/pagos/estadisticas/${usuarioId}`);
        return await response.json();
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        throw error;
    }
};