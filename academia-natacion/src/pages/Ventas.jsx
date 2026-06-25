import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaCalendarAlt, FaDollarSign, FaSignOutAlt, FaCheckCircle, FaUserCircle, FaStore } from 'react-icons/fa';
import './Panel.css';

export default function Ventas() {
  const navigate = useNavigate();
  const usuario = localStorage.getItem('usuario') || 'Atleta';
  const email = localStorage.getItem('email');

  // Estado para controlar nuestra ventana emergente bonita
  const [modal, setModal] = useState({ abierto: false, plan: null });

  const membresias = [
    { id: 'm1', nombre: 'Plan Bronce', precio: 800, detalles: '2 clases por semana. Acceso completo a vestidores.' },
    { id: 'm2', nombre: 'Plan Plata', precio: 1400, detalles: '4 clases por semana. Incluye casillero privado.' },
    { id: 'm3', nombre: 'Plan Oro (Élite)', precio: 2200, detalles: 'Acceso libre total. Coach personalizado.' }
  ];

  // Ejecuta la compra real cuando le dan a "Confirmar" en el modal
  const confirmarCompra = async () => {
    try {
      const res = await fetch('https://aquafit-backend.onrender.com/api/movimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          tipo: 'Membresia',
          descripcion: modal.plan.nombre,
          total: modal.plan.precio
        })
      });
      if (res.ok) {
        alert('¡Membresía actualizada con éxito! Revisa tu historial en Mi Perfil.');
        setModal({ abierto: false, plan: null }); // Cerramos el modal
      }
    } catch (err) {
      alert('Error al conectar con el servidor.');
    }
  };

  return (
    <div className="panel-container">
      {/* --- EL MODAL (VENTANA EMERGENTE) --- */}
      {modal.abierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Confirmar Cambio de Plan</h3>
            <p className="modal-text">Estás a punto de adquirir el <strong>{modal.plan.nombre}</strong>. El cargo a tu cuenta será de:</p>
            <p className="modal-price">${modal.plan.precio} MXN</p>
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setModal({ abierto: false, plan: null })}>Cancelar</button>
              <button className="btn-confirm" onClick={confirmarCompra}>Aceptar Pago</button>
            </div>
          </div>
        </div>
      )}

      <aside className="panel-sidebar">
        <div>
          <h2 className="sidebar-brand">AquaFit 🌊</h2>
          <p className="sidebar-user">Atleta: <span>{usuario}</span></p>
          <nav className="sidebar-nav">
            <NavLink to="/reservaciones" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}><FaCalendarAlt /> Reservaciones</NavLink>
            <NavLink to="/ventas" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}><FaDollarSign /> Membresías</NavLink>
            <NavLink to="/tienda" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}><FaStore /> Pro-Shop</NavLink>
            <NavLink to="/micuenta" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}><FaUserCircle /> Mi Perfil</NavLink>
          </nav>
        </div>
        <button onClick={() => { localStorage.clear(); navigate('/'); }} className="btn-logout"><FaSignOutAlt /> Cerrar Sesión</button>
      </aside>

      <main className="panel-main">
        <h1 className="panel-header">Planes de Membresía</h1>
        <div className="panel-grid">
          {membresias.map((plan) => (
            <div key={plan.id} className="panel-card" style={{ borderTop: plan.id === 'm2' ? '5px solid #ffc300' : '1px solid #e2e8f0' }}>
              <div>
                <span className="card-badge" style={{ backgroundColor: plan.id === 'm2' ? '#ffc300' : '#e0f4f9', color: '#001f54' }}>
                  {plan.id === 'm2' ? 'RECOMENDADO' : 'ACCESO'}
                </span>
                <h3 className="card-title">{plan.nombre}</h3>
                <p style={{ fontSize: '2.2rem', fontWeight: '900', color: '#034078', margin: '10px 0' }}>${plan.precio}</p>
                <p className="card-desc flex items-start gap-2"><FaCheckCircle style={{ color: '#10b981', mt: '4px', flexShrink: 0 }} /> {plan.detalles}</p>
              </div>
              <button onClick={() => setModal({ abierto: true, plan: plan })} className="btn-action">
                Adquirir Membresía
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}