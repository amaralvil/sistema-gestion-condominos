# Sistema de Gestión de Condóminos 🏢

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Aplicación web para la gestión administrativa y financiera de condominios, desarrollada en React como parte del proyecto ágil del Equipo 4.

## 📌 Estado del Proyecto

**Sprint 1 completado (Marzo 2026)**  
Próximo: **Sprint 2 (en planificación)**

## ✅ Funcionalidades Implementadas (Sprint 1)

| ID | Historia de Usuario | Estado | Componente |
|:---|:---|:---|:---|
| **PB-F01/PB-01** | Pago electrónico de cuotas (simulación) | ✅ 80% (pasa a S2) | [`Checkout.jsx`](src/components/Checkout.jsx) |
| **PB-F03/PB-03** | Historial de pagos consultable | ✅ 100% | [`Historial.jsx`](src/components/Historial.jsx) |
| **PB-T01** | Base de datos centralizada (backend simulado) | ✅ 90% (pasa a S2) | [`apiPagos.js`](src/services/apiPagos.js) |

### Características principales:
- 🎨 Interfaz responsiva y amigable
- 💳 Simulación de API para pagos (pendiente integración real)
- 📊 Visualización de historial con filtros por fecha/concepto
- 📥 Exportación de datos a CSV
- ⚠️ Mensajes de error claros y validación de formularios

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 16 o superior
- npm o yarn

### Pasos de instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/amaralvil/sistema-gestion-condominos.git

# 2. Entrar al directorio
cd sistema-gestion-condominos

# 3. Instalar dependencias
npm install

# 4. Ejecutar en modo desarrollo
npm start
