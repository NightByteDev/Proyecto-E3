import { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaCalendarAlt, FaDollarSign, FaSignOutAlt, FaUserCircle, FaIdCard, FaReceipt, FaStore } from 'react-icons/fa';
import './Panel.css';

export default function MiCuenta() {
  const [historial, setHistorial] = useState([]);
  const [modalConfirmar, setModalConfirmar] = useState(false);
  const [notificacion, setNotificacion] = useState({ abierto: false, mensaje: '' });
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(localStorage.getItem('usuario') || 'Atleta');
  const email = localStorage.getItem('email');

  const cargarHistorial = () => {
    fetch(`https://aquafit-backend.onrender.com/api/movimientos/${email}`)
      .then(res => res.json())
      .then(data => setHistorial(data));
  };

  useEffect(() => { cargarHistorial(); }, []);

  const handleModificarNombre = async () => {
    const nuevoNombre = prompt("Ingresa tu nuevo nombre completo:", usuario);
    if (nuevoNombre && nuevoNombre.trim() !== "") {
      const res = await fetch(`https://aquafit-backend.onrender.com/api/usuarios/${email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevoNombre })
      });
      if (res.ok) {
        localStorage.setItem('usuario', nuevoNombre);
        setUsuario(nuevoNombre);
        setNotificacion({ abierto: true, mensaje: 'Tu nombre ha sido actualizado en la base de datos de Aiven.' });
      }
    }
  };

  const ejecutarAnulacion = async () => {
    const res = await fetch(`https://aquafit-backend.onrender.com/api/membresia/${email}`, { method: 'DELETE' });
    if (res.ok) {
      setModalConfirmar(false);
      setNotificacion({ abierto: true, mensaje: 'Tu membresía ha sido anulada. Tu cuenta regresa a Modo Visita.' });
      cargarHistorial();
    }
  };

  const membresiaActiva = historial.find(m => m.tipo === 'Membresia');
  const planActual = membresiaActiva ? membresiaActiva.descripcion : 'Ninguno (Visita)';

  return (
    <div className="panel-container">
      {/* Modal de Confirmación para Cancelar Membresía */}
      {modalConfirmar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title" style={{color: '#ef4444'}}>¿Anular Membresía?</h3>
            <p className="modal-text">Perderás el acceso gratuito inmediato al apartado de carriles y horarios del complejo.</p>
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setModalConfirmar(false)}>Conservar</button>
              <button className="btn-confirm" style={{background: '#ef4444'}} onClick={ejecutarAnulacion}>Confirmar Baja</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Aviso Exitoso */}
      {notificacion.abierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Aviso de Cuenta</h3>
            <p className="modal-text">{notificacion.mensaje}</p>
            <button className="btn-ok-block" onClick={() => setNotificacion({ abierto: false, mensaje: '' })}>Aceptar</button>
          </div>
        </div>
      )}

      <aside className="panel-sidebar">
        <div>
          <h2 className="sidebar-brand">Escuela de Natación</h2>
          <p className="sidebar-user">Atleta: <span>{usuario}</span></p>
          <nav className="sidebar-nav">
            <NavLink to="/reservaciones" className="nav-item"><FaCalendarAlt /> Reservaciones</NavLink>
            <NavLink to="/ventas" className="nav-item"><FaDollarSign /> Membresías</NavLink>
            <NavLink to="/tienda" className="nav-item"><FaStore /> Pro-Shop</NavLink>
            <NavLink to="/micuenta" className="nav-item active"><FaUserCircle /> Mi Perfil</NavLink>
          </nav>
        </div>
        <button onClick={() => { localStorage.clear(); navigate('/'); }} className="btn-logout"><FaSignOutAlt /> Cerrar Sesión</button>
      </aside>

      <main className="panel-main">
        <h1 className="panel-header">Mi Perfil y Movimientos</h1>
        
        <div className="panel-grid" style={{ marginBottom: '30px' }}>
          <div className="panel-card" style={{ borderTop: '5px solid #10b981' }}>
            <h3 className="card-title flex items-center gap-2 mb-4"><FaIdCard style={{ color: '#10b981' }} /> Plan</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ color: '#64748b', fontWeight: 'bold' }}>Estado:</span>
              <span style={{ color: '#001f54', fontWeight: '900' }}>{planActual}</span>
            </div>
            {membresiaActiva && (
              <button onClick={() => setModalConfirmar(true)} className="btn-action" style={{background: '#fee2e2', color: '#ef4444', marginTop: 'auto'}}>
                Anular Membresía
              </button>
            )}
          </div>

          <div className="panel-card">
            <h3 className="card-title flex items-center gap-2 mb-4"><FaUserCircle style={{ color: '#00a8e8' }} /> Datos</h3>
            <p className="card-desc mb-2"><strong>Nombre:</strong> {usuario}</p>
            <p className="card-desc"><strong>Email:</strong> {email}</p>
            <button onClick={handleModificarNombre} className="btn-action" style={{ marginTop: 'auto', background: '#e2e8f0', color: '#001f54' }}>
              Modificar Nombre
            </button>
          </div>
        </div>

        <div className="panel-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <h3 className="card-title" style={{ margin: 0, fontSize: '1.2rem' }}><FaReceipt /> Historial de Transacciones</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#001f54', color: 'white' }}>
                <th style={{ padding: '15px' }}>Fecha</th>
                <th style={{ padding: '15px' }}>Categoría</th>
                <th style={{ padding: '15px' }}>Concepto</th>
                <th style={{ padding: '15px' }}>Monto</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((mov) => (
                <tr key={mov.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '15px' }}>{new Date(mov.fecha).toLocaleDateString()}</td>
                  <td style={{ padding: '15px', fontWeight: 'bold', color: '#64748b' }}>{mov.tipo}</td>
                  <td style={{ padding: '15px', color: '#001f54', fontWeight: 'bold' }}>{mov.descripcion}</td>
                  <td style={{ padding: '15px', fontWeight: '900' }}>${mov.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}