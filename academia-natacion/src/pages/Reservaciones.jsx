import { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaCalendarAlt, FaDollarSign, FaSignOutAlt, FaClock, FaUserCircle, FaStore } from 'react-icons/fa';
import './Panel.css';

export default function Reservaciones() {
  const [historial, setHistorial] = useState([]);
  const [modal, setModal] = useState({ abierto: false, clase: null });
  const [notificacion, setNotificacion] = useState({ abierto: false, mensaje: '', titulo: '' });
  const navigate = useNavigate();
  const email = localStorage.getItem('email');
  const usuario = localStorage.getItem('usuario') || 'Atleta';

  // Los 9 horarios solicitados distribuidos en Mañana, Tarde y Noche
  const horarios = [
    { id: 1, hora: '08:00 AM', turno: 'Mañana' },
    { id: 2, hora: '09:00 AM', turno: 'Mañana' },
    { id: 3, hora: '10:00 AM', turno: 'Mañana' },
    { id: 4, hora: '02:00 PM', turno: 'Tarde' },
    { id: 5, hora: '03:00 PM', turno: 'Tarde' },
    { id: 6, hora: '05:00 PM', turno: 'Tarde' },
    { id: 7, hora: '08:00 PM', turno: 'Noche' },
    { id: 8, hora: '09:00 PM', turno: 'Noche' },
    { id: 9, hora: '10:00 PM', turno: 'Noche' }
  ];

  const verificarMembresia = () => {
    fetch(`http://localhost:3000/api/movimientos/${email}`)
      .then(res => res.json())
      .then(data => setHistorial(data))
      .catch(err => console.error(err));
  };

  useEffect(() => { verificarMembresia(); }, []);

  const tieneMembresia = historial.some(m => m.tipo === 'Membresia');

  const ejecutarReserva = async () => {
    const costo = tieneMembresia ? 0 : 150;
    try {
      const res = await fetch('http://localhost:3000/api/movimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          tipo: 'Reserva',
          descripcion: `Clase ${modal.clase.turno}: ${modal.clase.hora}`,
          total: costo
        })
      });
      
      if (res.ok) {
        setModal({ abierto: false, clase: null });
        setNotificacion({
          abierto: true,
          titulo: tieneMembresia ? '¡Reserva Confirmada!' : '¡Pago Exitoso!',
          mensaje: tieneMembresia 
            ? `Tu carril para las ${modal.clase.hora} ha sido asegurado bajo tu membresía.`
            : `Se procesó el cargo de $150 MXN. Tu reservación para las ${modal.clase.hora} está lista.`
        });
        verificarMembresia();
      }
    } catch (err) {
      alert("Error de conexión");
    }
  };

  return (
    <div className="panel-container">
      {/* 1. Modal de Confirmación de Operación */}
      {modal.abierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Confirmar Reservación</h3>
            <p className="modal-text">
              {tieneMembresia 
                ? `¿Deseas apartar tu lugar para el bloque de las ${modal.clase.hora}?`
                : `No tienes membresía activa. Se generará un cobro por pase de clase individual.`}
            </p>
            <p className="modal-price">{tieneMembresia ? 'Gratis' : '$150.00'}</p>
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setModal({ abierto: false, clase: null })}>Cancelar</button>
              <button className="btn-confirm" onClick={ejecutarReserva}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal de Aviso/Resultado de Éxito */}
      {notificacion.abierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title" style={{color: '#10b981'}}>{notificacion.titulo}</h3>
            <p className="modal-text">{notificacion.mensaje}</p>
            <button className="btn-ok-block" onClick={() => setNotificacion({ abierto: false, mensaje: '', titulo: '' })}>Aceptar</button>
          </div>
        </div>
      )}

      <aside className="panel-sidebar">
        <div>
          <h2 className="sidebar-brand">AquaFit 🌊</h2>
          <p className="sidebar-user">Atleta: <span>{usuario}</span></p>
          <nav className="sidebar-nav">
            <NavLink to="/reservaciones" className="nav-item active"><FaCalendarAlt /> Reservaciones</NavLink>
            <NavLink to="/ventas" className="nav-item"><FaDollarSign /> Membresías</NavLink>
            <NavLink to="/tienda" className="nav-item"><FaStore /> Pro-Shop</NavLink>
            <NavLink to="/micuenta" className="nav-item"><FaUserCircle /> Mi Perfil</NavLink>
          </nav>
        </div>
        <button onClick={() => { localStorage.clear(); navigate('/'); }} className="btn-logout"><FaSignOutAlt /> Cerrar Sesión</button>
      </aside>

      <main className="panel-main">
        <h1 className="panel-header">Disponibilidad de Carriles</h1>
        {!tieneMembresia && (
          <div className="alert-success" style={{background: '#fef3c7', color: '#92400e', borderLeft: '5px solid #d97706'}}>
            ⚠️ Modo Visita: No cuentas con membresía contratada. Cada apartado se registrará como pago individual.
          </div>
        )}
        
        <div className="panel-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {horarios.map((h) => (
            <div key={h.id} className="panel-card" style={{padding: '20px'}}>
              <span className="card-badge" style={{backgroundColor: h.turno === 'Mañana' ? '#e0f4f9' : h.turno === 'Tarde' ? '#fef3c7' : '#e0e7ff'}}>{h.turno}</span>
              <h3 className="card-title flex items-center gap-2" style={{fontSize: '1.4rem', marginTop: '10px'}}><FaClock style={{color: '#00a8e8'}} /> {h.hora}</h3>
              <button onClick={() => setModal({ abierto: true, clase: h })} className="btn-action" style={{marginTop: '15px'}}>
                {tieneMembresia ? 'Apartar Lugar' : 'Pagar Pase ($150)'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}