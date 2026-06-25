import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaCalendarAlt, FaDollarSign, FaSignOutAlt, FaUserCircle, FaStore, FaShoppingCart } from 'react-icons/fa';
import './Panel.css';

export default function Tienda() {
  const navigate = useNavigate();
  const usuario = localStorage.getItem('usuario') || 'Atleta';
  const email = localStorage.getItem('email');

  const [modal, setModal] = useState({ abierto: false, prod: null });

  const productos = [
    { id: 'p1', nombre: 'Goggles Speedo Fastskin', precio: 850 },
    { id: 'p2', nombre: 'Gorra de Silicón Arena', precio: 250 },
    { id: 'p3', nombre: 'Traje de Baño (Hombre)', precio: 1200 },
    { id: 'p4', nombre: 'Traje de Baño (Mujer)', precio: 1500 },
    { id: 'p5', nombre: 'Aletas Cortas Finis', precio: 680 },
    { id: 'p6', nombre: 'Tabla (Kickboard)', precio: 350 },
    { id: 'p7', nombre: 'Pull Buoy Ergonómico', precio: 280 },
    { id: 'p8', nombre: 'Tapones + Pinza', precio: 150 },
    { id: 'p9', nombre: 'Toalla Microfibra', precio: 400 },
    { id: 'p10', nombre: 'Maleta Deportiva', precio: 950 },
  ];

  const confirmarCompra = async () => {
    try {
      const res = await fetch('https://aquafit-backend.onrender.com/api/movimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          tipo: 'Tienda',
          descripcion: modal.prod.nombre,
          total: modal.prod.precio
        })
      });
      if (res.ok) {
        alert('¡Compra registrada en sistema! Puedes pasar a recoger tu artículo.');
        setModal({ abierto: false, prod: null });
      }
    } catch (err) {
      alert('Error al procesar la compra.');
    }
  };

  return (
    <div className="panel-container">
      {modal.abierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Caja de Pro-Shop</h3>
            <p className="modal-text">¿Deseas confirmar la compra de: <br/><strong>{modal.prod.nombre}</strong>?</p>
            <p className="modal-price">${modal.prod.precio} MXN</p>
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setModal({ abierto: false, prod: null })}>Cancelar</button>
              <button className="btn-confirm" onClick={confirmarCompra}>Pagar Artículo</button>
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
        <h1 className="panel-header">Pro-Shop Natación</h1>
        <div className="panel-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {productos.map((prod) => (
            <div key={prod.id} className="panel-card" style={{ padding: '20px', textAlign: 'center' }}>
              <h3 className="card-title" style={{ fontSize: '1.1rem' }}>{prod.nombre}</h3>
              <p style={{ fontSize: '1.5rem', fontWeight: '900', color: '#034078', margin: '15px 0' }}>${prod.precio}</p>
              <button onClick={() => setModal({ abierto: true, prod: prod })} className="btn-action flex justify-center items-center gap-2">
                <FaShoppingCart /> Comprar
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}