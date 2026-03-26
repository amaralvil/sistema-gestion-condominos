import React, { useState, useEffect } from 'react';
import { obtenerUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario, obtenerRoles } from '../services/apiUsuarios';
import './GestionUsuarios.css';

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol: '',
    unidad: ''
  });
  const [mensaje, setMensaje] = useState(null);

  // Cargar datos al montar
  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      const usuariosData = await obtenerUsuarios();
      const rolesData = await obtenerRoles();
      setUsuarios(usuariosData);
      setRoles(rolesData);
      setCargando(false);
    };
    cargarDatos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const abrirModalCrear = () => {
    setUsuarioEditando(null);
    setFormData({ nombre: '', email: '', rol: '', unidad: '' });
    setModalAbierto(true);
  };

  const abrirModalEditar = (usuario) => {
    setUsuarioEditando(usuario);
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol.id,
      unidad: usuario.unidad
    });
    setModalAbierto(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);
    
    try {
      let resultado;
      if (usuarioEditando) {
        resultado = await actualizarUsuario(usuarioEditando.id, formData);
        setMensaje({ tipo: 'exito', texto: 'Usuario actualizado correctamente' });
      } else {
        resultado = await crearUsuario(formData);
        setMensaje({ tipo: 'exito', texto: 'Usuario creado correctamente' });
      }
      
      // Recargar lista
      const usuariosData = await obtenerUsuarios();
      setUsuarios(usuariosData);
      setModalAbierto(false);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error al guardar el usuario' });
    }
    setCargando(false);
  };

  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Eliminar a ${nombre}? Esta acción no se puede deshacer.`)) {
      setCargando(true);
      try {
        await eliminarUsuario(id);
        const usuariosData = await obtenerUsuarios();
        setUsuarios(usuariosData);
        setMensaje({ tipo: 'exito', texto: 'Usuario eliminado correctamente' });
      } catch (error) {
        setMensaje({ tipo: 'error', texto: 'Error al eliminar usuario' });
      }
      setCargando(false);
    }
  };

  if (cargando && usuarios.length === 0) {
    return <div className="cargando">Cargando usuarios...</div>;
  }

  return (
    <div className="gestion-usuarios-container">
      <h1>Gestión de Usuarios y Roles</h1>
      
      {mensaje && (
        <div className={`mensaje ${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}

      <div className="barra-acciones">
        <button onClick={abrirModalCrear} className="btn-crear">
          + Nuevo Usuario
        </button>
      </div>

      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Unidad</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.email}</td>
              <td>{usuario.unidad}</td>
              <td><span className={`rol-badge ${usuario.rol.nombre.toLowerCase()}`}>{usuario.rol.nombre}</span></td>
              <td className="acciones">
                <button onClick={() => abrirModalEditar(usuario)} className="btn-editar">✏️</button>
                <button onClick={() => handleEliminar(usuario.id, usuario.nombre)} className="btn-eliminar">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="aviso-pendiente">
        ⚠️ Funcionalidad completa en Sprint 3: Autenticación 2FA, autogestión de perfil e integración con notificaciones.
      </p>

      {/* Modal para crear/editar usuario */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <h3>{usuarioEditando ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="campo">
                <label>Nombre completo:</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
              </div>
              <div className="campo">
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="campo">
                <label>Unidad / Departamento:</label>
                <input type="text" name="unidad" value={formData.unidad} onChange={handleInputChange} required />
              </div>
              <div className="campo">
                <label>Rol:</label>
                <select name="rol" value={formData.rol} onChange={handleInputChange} required>
                  <option value="">Seleccionar...</option>
                  {roles.map(rol => (
                    <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="modal-acciones">
                <button type="button" onClick={() => setModalAbierto(false)} className="btn-cancelar">Cancelar</button>
                <button type="submit" disabled={cargando} className="btn-guardar">
                  {cargando ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionUsuarios;