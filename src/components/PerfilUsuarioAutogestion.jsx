import React, { useState, useEffect } from 'react';
import { obtenerPerfil, actualizarPerfil, cambiarContrasena, obtenerPreferencias, actualizarPreferencias } from '../services/apiPerfilUsuario';
import '../styles/PerfilUsuarioAutogestion.css';

const PerfilUsuarioAutogestion = ({ usuarioId }) => {
  const [perfil, setPerfil] = useState(null);
  const [preferencias, setPreferencias] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [cambiarPass, setCambiarPass] = useState(false);
  const [passData, setPassData] = useState({ actual: '', nueva: '', confirmar: '' });

  useEffect(() => {
    const cargarPerfil = async () => {
      const perfilData = await obtenerPerfil(usuarioId);
      const prefData = await obtenerPreferencias(usuarioId);
      setPerfil(perfilData);
      setPreferencias(prefData);
      setCargando(false);
    };
    cargarPerfil();
  }, [usuarioId]);

  const handlePerfilChange = (e) => setPerfil(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handlePreferenciaChange = (e) => setPreferencias(prev => ({ ...prev, [e.target.name]: e.target.checked }));
  const handlePassChange = (e) => setPassData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const guardarPerfil = async () => {
    setCargando(true);
    try {
      await actualizarPerfil(usuarioId, perfil);
      setMensaje({ tipo: 'exito', texto: 'Perfil actualizado correctamente' });
      setEditando(false);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error al actualizar perfil' });
    }
    setCargando(false);
    setTimeout(() => setMensaje(null), 3000);
  };

  const guardarPreferencias = async () => {
    setCargando(true);
    try {
      await actualizarPreferencias(usuarioId, preferencias);
      setMensaje({ tipo: 'exito', texto: 'Preferencias guardadas' });
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error al guardar preferencias' });
    }
    setCargando(false);
    setTimeout(() => setMensaje(null), 3000);
  };

  const cambiarPassword = async () => {
    if (passData.nueva !== passData.confirmar) {
      setMensaje({ tipo: 'error', texto: 'Las contraseñas nuevas no coinciden' });
      return;
    }
    setCargando(true);
    try {
      await cambiarContrasena(usuarioId, passData.actual, passData.nueva);
      setMensaje({ tipo: 'exito', texto: 'Contraseña actualizada' });
      setCambiarPass(false);
      setPassData({ actual: '', nueva: '', confirmar: '' });
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message || 'Error al cambiar contraseña' });
    }
    setCargando(false);
    setTimeout(() => setMensaje(null), 3000);
  };

  if (cargando && !perfil) return <div className="cargando-perfil">Cargando tu perfil...</div>;

  return (
    <div className="perfil-usuario-container">
      <h1>Mi Perfil</h1>
      {mensaje && <div className={`mensaje-perfil ${mensaje.tipo}`}>{mensaje.texto}</div>}
      <div className="seccion-perfil">
        <h3>Información Personal</h3>
        {editando ? (
          <>
            <div className="campo"><label>Nombre completo:</label><input type="text" name="nombre" value={perfil?.nombre || ''} onChange={handlePerfilChange} /></div>
            <div className="campo"><label>Email:</label><input type="email" name="email" value={perfil?.email || ''} onChange={handlePerfilChange} /></div>
            <div className="campo"><label>Teléfono:</label><input type="tel" name="telefono" value={perfil?.telefono || ''} onChange={handlePerfilChange} /></div>
            <div className="acciones-perfil"><button onClick={() => setEditando(false)} className="btn-cancelar">Cancelar</button><button onClick={guardarPerfil} className="btn-guardar">Guardar cambios</button></div>
          </>
        ) : (
          <>
            <p><strong>Nombre:</strong> {perfil?.nombre}</p><p><strong>Email:</strong> {perfil?.email}</p><p><strong>Teléfono:</strong> {perfil?.telefono || 'No registrado'}</p><p><strong>Unidad:</strong> {perfil?.unidad}</p><p><strong>Rol:</strong> {perfil?.rol}</p>
            <button onClick={() => setEditando(true)} className="btn-editar-perfil">✏️ Editar perfil</button>
          </>
        )}
      </div>
      <div className="seccion-perfil">
        <h3>Seguridad</h3>
        {cambiarPass ? (
          <>
            <div className="campo"><label>Contraseña actual:</label><input type="password" name="actual" value={passData.actual} onChange={handlePassChange} /></div>
            <div className="campo"><label>Nueva contraseña:</label><input type="password" name="nueva" value={passData.nueva} onChange={handlePassChange} /></div>
            <div className="campo"><label>Confirmar nueva:</label><input type="password" name="confirmar" value={passData.confirmar} onChange={handlePassChange} /></div>
            <div className="acciones-perfil"><button onClick={() => setCambiarPass(false)} className="btn-cancelar">Cancelar</button><button onClick={cambiarPassword} className="btn-guardar">Cambiar contraseña</button></div>
          </>
        ) : (
          <button onClick={() => setCambiarPass(true)} className="btn-cambiar-pass">🔒 Cambiar contraseña</button>
        )}
      </div>
      <div className="seccion-perfil">
        <h3>Preferencias de Notificación</h3>
        <div className="campo-checkbox"><label><input type="checkbox" name="emailRecordatorios" checked={preferencias?.emailRecordatorios || false} onChange={handlePreferenciaChange} /> Recibir recordatorios por email</label></div>
        <div className="campo-checkbox"><label><input type="checkbox" name="pushNotificaciones" checked={preferencias?.pushNotificaciones || false} onChange={handlePreferenciaChange} /> Recibir notificaciones push</label></div>
        <div className="campo-checkbox"><label><input type="checkbox" name="smsAlertas" checked={preferencias?.smsAlertas || false} onChange={handlePreferenciaChange} /> Recibir alertas por SMS</label></div>
        <button onClick={guardarPreferencias} className="btn-guardar-pref">Guardar preferencias</button>
      </div>
    </div>
  );
};

export default PerfilUsuarioAutogestion;