# Sistema de Gestión de Condóminos 🏢

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Aplicación web para la gestión administrativa y financiera de condominios, desarrollada en React como parte del proyecto ágil del Equipo 4.

## 📌 Estado del Proyecto

| Sprint | Estado | Fecha |
|:---|:---|:---|
| **Sprint 1** | ✅ Completado | Marzo 2026 |
| **Sprint 2** | ✅ Completado | Marzo-Abril 2026 |
| **Sprint 3** | 🔄 Planificado | Mayo 2026 |

---

## ✅ Funcionalidades Implementadas

### Sprint 1 (Completado)

| ID | Historia de Usuario | Estado | Componente |
|:---|:---|:---|:---|
| **PB-F01/PB-01** | Pago electrónico de cuotas (simulación) | ✅ 80% (pasa a S3) | `Checkout.jsx` |
| **PB-F03/PB-03** | Historial de pagos consultable | ✅ 100% | `Historial.jsx` |
| **PB-T01** | Base de datos centralizada (backend simulado) | ✅ 90% (pasa a S3) | `apiPagos.js` |

### Sprint 2 (Completado)

| ID | Historia de Usuario | Estado | Componente |
|:---|:---|:---|:---|
| **PB-F02** | Reportes financieros con dashboard y exportación | ✅ 100% | `ReportesFinancieros.jsx` |
| **PB-F04** | Configuración de cuotas, multas y periodos | ⏳ 80% (pasa a S3) | `ConfigCuotas.jsx` |
| **PB-T02** | Gestión de usuarios con roles y permisos | ⏳ 60% (pasa a S3) | `GestionUsuarios.jsx` |

### Sprint 3 (Planificado)

| ID | Historia de Usuario | Estado Previsto |
|:---|:---|:---|
| **PB-F01** | Integración real con API de pagos | Pendiente |
| **PB-F04** | Cálculo automático de multas y auditoría | Pendiente |
| **PB-T02a** | Autenticación 2FA y backend completo | Pendiente |
| **PB-T02b** | Autogestión de perfil de usuario | Pendiente |

---

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