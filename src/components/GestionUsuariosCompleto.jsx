import React, { useState, useEffect } from 'react';
import { obtenerUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario, obtenerRoles, generarCodigo2FA, validarCodigo2FA, activar2FA, enviarNotificacion } from '../services/apiUsuariosCompleto';
import '../styles/GestionUsuariosCompleto.css';

const GestionUsuariosCompleto = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modal2FAAbierto, setModal2FAAbierto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [usuario2FA, setUsuario2FA] = useState(null);
  const [codigo2FAIngresado, setCodigo2FAIngresado] = useState('');
  const [codigo2FAGenerado, setCodigo2FAGenerado] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', email: '', rol: '', unidad: '', telefono: '' });

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    setCargando(true);
    const usuariosData = await obtenerUsuarios();
    const rolesData = await obtenerRoles();
    setUsuarios(usuariosData);
    setRoles(rolesData);
    setCargando(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const abrirModalCrear = () => {
    setUsuarioEditando(null);
    setFormData({ nombre: '', email: '', rol: '', unidad: '', telefono: '' });
    setModalAbierto(true);
  };

  const abrirModalEditar = (usuario) => {
    setUsuarioEditando(usuario);
    setFormData({ nombre: usuario.nombre, email: usuario.email, rol: usuario.rol.id.toString(), unidad: usuario.unidad, telefono: usuario.telefono || '' });
    setModalAbierto(true);
  };

  const abrirModal2FA = (usuario) => {
    const codigo = generarCodigo2FA();
    setCodigo2FAGenerado(codigo);
    setUsuario2FA(usuario);
    setCodigo2FAIngresado('');
    setModal2FAAbierto(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);
    try {
      if (usuarioEditando) {
        await actualizarUsuario(usuarioEditando.id, formData);
        setMensaje({ tipo: 'exito', texto: 'Usuario actualizado correctamente' });
        await enviarNotificacion(usuarioEditando.email, 'Tu cuenta ha sido actualizada');
      } else {
        await crearUsuario(formData);
        setMensaje({ tipo: 'exito', texto: 'Usuario creado correctamente' });
        await enviarNotificacion(formData.email, 'Bienvenido al Sistema de Gestión de Condóminos');
      }
      await cargarDatos();
      setModalAbierto(false);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message || 'Error al guardar el usuario' });
    }
    setCargando(false);
  };

  const handleActivar2FA = async () => {
    if (validarCodigo2FA(codigo2FAIngresado, codigo2FAGenerado)) {
      const resultado = await activar2FA(usuario2FA.id);
      if (resultado.exito) {
        setMensaje({ tipo: 'exito', texto: '2FA activado correctamente' });
        setModal2FAAbierto(false);
        await cargarDatos();
      } else {
        setMensaje({ tipo: 'error', texto: 'Error al activar 2FA' });
      }
    } else {
      setMensaje({ tipo: 'error', texto: 'Código de verificación incorrecto' });
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Eliminar a ${nombre}?`)) {
      setCargando(true);
      try {
        await eliminarUsuario(id);
        await cargarDatos();
        setMensaje({ tipo: 'exito', texto: 'Usuario eliminado correctamente' });
      } catch (error) {
        setMensaje({ tipo: 'error', texto: 'Error al eliminar usuario' });
      }
      setCargando(false);
    }
  };

  return (
    <div className="gestion-usuarios-completo">
      <h1>Gestión de Usuarios</h1>
      {mensaje && <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>}
      <div className="barra-acciones"><button onClick={abrirModalCrear} className="btn-crear">+ Nuevo Usuario</button></div>
      <table className="tabla-usuarios">
        <thead><tr><th>Nombre</th><th>Email</th><th>Unidad</th><th>Rol</th><th>2FA</th><th>Acciones</th></tr></thead>
        <tbody>{usuarios.map(usuario => (
          <tr key={usuario.id}>
            <td>{usuario.nombre}</td><td>{usuario.email}</td><td>{usuario.unidad}</td>
            <td><span className={`rol-badge ${usuario.rol.nombre.toLowerCase()}`}>{usuario.rol.nombre}</span></td>
            <td>{usuario.dosFactorActivado ? <span className="badge-2fa activado">✅ Activado</span> : <button onClick={() => abrirModal2FA(usuario)} className="btn-2fa">🔐 Activar 2FA</button>}</td>
            <td className="acciones"><button onClick={() => abrirModalEditar(usuario)} className="btn-editar">✏️</button><button onClick={() => handleEliminar(usuario.id, usuario.nombre)} className="btn-eliminar">🗑️</button></td>
          </tr>
        ))}</tbody>
      </table>
      {modal2FAAbierto && (
        <div className="modal-overlay" onClick={() => setModal2FAAbierto(false)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <h3>Activar Autenticación de Dos Factores (2FA)</h3>
            <p>Usuario: <strong>{usuario2FA?.nombre}</strong></p>
            <p>Código de verificación: <strong className="codigo-2fa">{codigo2FAGenerado}</strong></p>
            <div className="campo"><label>Ingresa el código:</label><input type="text" value={codigo2FAIngresado} onChange={(e) => setCodigo2FAIngresado(e.target.value)} /></div>
            <div className="modal-acciones"><button onClick={() => setModal2FAAbierto(false)} className="btn-cancelar">Cancelar</button><button onClick={handleActivar2FA} className="btn-guardar">Activar 2FA</button></div>
          </div>
        </div>
      )}
      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <h3>{usuarioEditando ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="campo"><label>Nombre completo:</label><input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required /></div>
              <div className="campo"><label>Email:</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} required /></div>
              <div className="campo"><label>Teléfono:</label><input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} /></div>
              <div className="campo"><label>Unidad:</label><input type="text" name="unidad" value={formData.unidad} onChange={handleInputChange} required /></div>
              <div className="campo"><label>Rol:</label><select name="rol" value={formData.rol} onChange={handleInputChange} required><option value="">Seleccionar...</option>{roles.map(rol => <option key={rol.id} value={rol.id}>{rol.nombre}</option>)}</select></div>
              <div className="modal-acciones"><button type="button" onClick={() => setModalAbierto(false)} className="btn-cancelar">Cancelar</button><button type="submit" disabled={cargando} className="btn-guardar">{cargando ? 'Guardando...' : 'Guardar'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionUsuariosCompleto;