import React, { useState } from 'react';
import './App.css';
import Checkout from './components/PagoElectronico/Checkout';
import Historial from './components/HistorialPagos/Historial';

function App() {
    // Datos de usuario simulado
    const [usuario] = useState({
        id: 'USR001',
        nombre: 'Juan Pérez',
        email: 'juan.perez@condominos.com',
        montoCuota: 1500.00,
        departamento: '501-A',
        telefono: '+52 55 1234 5678'
    });

    const [vistaActiva, setVistaActiva] = useState('pago'); // 'pago' o 'historial'

    return (
        <div className="App">
            <header className="App-header">
                <h1>🏢 Sistema de Gestión de Condóminos</h1>
                <p>Residencial Los Robles - Equipo 4</p>
                <div className="user-info">
                    <span>👤 {usuario.nombre} - Depto {usuario.departamento}</span>
                </div>
            </header>

            <nav className="App-nav">
                <button 
                    className={vistaActiva === 'pago' ? 'active' : ''}
                    onClick={() => setVistaActiva('pago')}
                >
                    💳 Realizar Pago
                </button>
                <button 
                    className={vistaActiva === 'historial' ? 'active' : ''}
                    onClick={() => setVistaActiva('historial')}
                >
                    📊 Historial de Pagos
                </button>
            </nav>

            <main className="App-main">
                {vistaActiva === 'pago' ? (
                    <Checkout usuario={usuario} />
                ) : (
                    <Historial usuarioId={usuario.id} />
                )}
            </main>

            <footer className="App-footer">
                <p>© 2025 Equipo 4 - Sistema de Gestión de Condóminos</p>
                <p>📞 Soporte técnico: 01-800-123-4567 | ✉️ soporte@condominos.com</p>
                <p>🔒 Sistema seguro - Todos los derechos reservados</p>
                <div className="sprint-info">
                    <span>Sprint 1: PB-01 (Pago electrónico) - PB-03 (Historial de pagos)</span>
                    <span>Estado: En desarrollo</span>
                </div>
            </footer>
        </div>
    );
}

export default App;