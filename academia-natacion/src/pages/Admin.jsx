import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaChartPie, FaMoneyBillWave, FaShoppingBag, FaCalendarCheck, FaListAlt, FaChartLine } from 'react-icons/fa';
import './Panel.css';

export default function Admin() {
  const [datos, setDatos] = useState({ historial: [], ingresosTotales: 0 });
  const [vistaActiva, setVistaActiva] = useState('balance'); // Estado para controlar las pestañas
  const navigate = useNavigate();

  const cargarDatosAdmin = () => {
    fetch('https://aquafit-backend.onrender.com/api/admin/ventas')
      .then(res => res.json())
      .then(data => setDatos(data))
      .catch(err => console.error("Error al cargar panel de admin:", err));
  };

  useEffect(() => {
    cargarDatosAdmin();
  }, []);

  // Lógica contable: Separar ingresos por categorías
  const totalMembresias = datos.historial.filter(m => m.tipo === 'Membresia').reduce((sum, m) => sum + Number(m.total), 0);
  const totalTienda = datos.historial.filter(m => m.tipo === 'Tienda').reduce((sum, m) => sum + Number(m.total), 0);
  const totalReservas = datos.historial.filter(m => m.tipo === 'Reserva').reduce((sum, m) => sum + Number(m.total), 0);

  const maxMonto = Math.max(totalMembresias, totalTienda, totalReservas, 1);
  const pctMembresias = (totalMembresias / maxMonto) * 100;
  const pctTienda = (totalTienda / maxMonto) * 100;
  const pctReservas = (totalReservas / maxMonto) * 100;

  // Lógica para la Gráfica Vertical (Últimas 15 transacciones para no saturar la pantalla)
  const ultimasTransacciones = [...datos.historial].reverse().slice(-15);
  const maxValTransaccion = Math.max(...ultimasTransacciones.map(t => Number(t.total)), 100);

  return (
    <div className="panel-container">
      {/* Sidebar del Administrador */}
      <aside className="panel-sidebar" style={{ backgroundColor: '#0f172a' }}>
        <div>
          <h2 className="sidebar-brand" style={{ color: '#38bdf8' }}>AquaFit Admin ⚙️</h2>
          <p className="sidebar-user" style={{ color: '#94a3b8' }}>Estatus: <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>Director General</span></p>
          
          <nav className="sidebar-nav" style={{ marginTop: '30px' }}>
            {/* Botón Pestaña 1: Balance Financiero */}
            <div 
              onClick={() => setVistaActiva('balance')} 
              className="nav-item" 
              style={{ 
                background: vistaActiva === 'balance' ? '#1e293b' : 'transparent', 
                color: vistaActiva === 'balance' ? '#38bdf8' : '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <FaChartPie /> Balance Financiero
            </div>

            {/* Botón Pestaña 2: Gráfica de Balances */}
            <div 
              onClick={() => setVistaActiva('grafica')} 
              className="nav-item" 
              style={{ 
                background: vistaActiva === 'grafica' ? '#1e293b' : 'transparent', 
                color: vistaActiva === 'grafica' ? '#38bdf8' : '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <FaChartLine /> Gráfica de Balances
            </div>
          </nav>
        </div>
        <button onClick={() => { localStorage.clear(); navigate('/'); }} className="btn-logout" style={{ background: '#ef4444' }}>
          <FaSignOutAlt /> Salir del Sistema
        </button>
      </aside>

      {/* Contenido Principal */}
      <main className="panel-main">
        <h1 className="panel-header">Panel Ejecutivo de Finanzas</h1>

        {/* ==========================================
            VISTA 1: BALANCE FINANCIERO (Dashboard)
            ========================================== */}
        {vistaActiva === 'balance' && (
          <>
            <div className="panel-grid" style={{ marginBottom: '30px' }}>
              <div className="panel-card" style={{ borderTop: '5px solid #10b981', backgroundColor: '#f0fdf4' }}>
                <h3 className="card-title flex items-center gap-2" style={{ color: '#166534' }}><FaMoneyBillWave /> Ingresos Brutos Totales</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: '900', color: '#14532d', margin: '10px 0' }}>
                  ${Number(datos.ingresosTotales).toLocaleString('es-MX', { minimumFractionDigits: 2 })} <span style={{ fontSize: '1rem', color: '#6b7280' }}>MXN</span>
                </p>
              </div>
              
              <div className="panel-card" style={{ borderTop: '5px solid #3b82f6' }}>
                <h3 className="card-title flex items-center gap-2" style={{ color: '#1e40af' }}><FaListAlt /> Volumen de Operaciones</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e3a8a', margin: '10px 0' }}>
                  {datos.historial.length} <span style={{ fontSize: '1rem', color: '#6b7280', fontWeight: 'normal' }}>transacciones</span>
                </p>
              </div>
            </div>

            <div className="panel-card" style={{ marginBottom: '30px', padding: '25px' }}>
              <h3 className="card-title" style={{ color: '#0f172a', marginBottom: '20px', fontSize: '1.2rem' }}>Distribución de Ingresos por Unidad de Negocio</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontWeight: 'bold', color: '#475569' }}>
                    <span className="flex items-center gap-2"><FaMoneyBillWave style={{color: '#10b981'}} /> Planes de Membresía</span>
                    <span>${totalMembresias.toFixed(2)} MXN</span>
                  </div>
                  <div style={{ width: '100%', backgroundColor: '#e2e8f0', borderRadius: '10px', height: '25px', overflow: 'hidden' }}>
                    <div style={{ width: `${pctMembresias}%`, backgroundColor: '#10b981', height: '100%', transition: 'width 0.5s ease-in-out' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontWeight: 'bold', color: '#475569' }}>
                    <span className="flex items-center gap-2"><FaShoppingBag style={{color: '#3b82f6'}} /> Venta de Equipo (Pro-Shop)</span>
                    <span>${totalTienda.toFixed(2)} MXN</span>
                  </div>
                  <div style={{ width: '100%', backgroundColor: '#e2e8f0', borderRadius: '10px', height: '25px', overflow: 'hidden' }}>
                    <div style={{ width: `${pctTienda}%`, backgroundColor: '#3b82f6', height: '100%', transition: 'width 0.5s ease-in-out' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontWeight: 'bold', color: '#475569' }}>
                    <span className="flex items-center gap-2"><FaCalendarCheck style={{color: '#f59e0b'}} /> Pases de Clase Individual</span>
                    <span>${totalReservas.toFixed(2)} MXN</span>
                  </div>
                  <div style={{ width: '100%', backgroundColor: '#e2e8f0', borderRadius: '10px', height: '25px', overflow: 'hidden' }}>
                    <div style={{ width: `${pctReservas}%`, backgroundColor: '#f59e0b', height: '100%', transition: 'width 0.5s ease-in-out' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '20px 25px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <h3 className="card-title" style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>Libro Mayor de Transacciones (Historial Global)</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0f172a', color: 'white' }}>
                      <th style={{ padding: '15px 25px' }}>Fecha / Hora</th>
                      <th style={{ padding: '15px 25px' }}>Usuario Vinculado</th>
                      <th style={{ padding: '15px 25px' }}>Unidad</th>
                      <th style={{ padding: '15px 25px' }}>Concepto</th>
                      <th style={{ padding: '15px 25px' }}>Monto Recaudado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datos.historial.length === 0 ? (
                      <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No hay transacciones registradas.</td></tr>
                    ) : (
                      datos.historial.map((mov) => (
                        <tr key={mov.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '15px 25px', color: '#475569', fontSize: '0.9rem' }}>{new Date(mov.fecha).toLocaleString()}</td>
                          <td style={{ padding: '15px 25px', fontWeight: 'bold', color: '#3b82f6' }}>{mov.usuario_email}</td>
                          <td style={{ padding: '15px 25px' }}>
                            <span style={{
                              backgroundColor: mov.tipo === 'Membresia' ? '#d1fae5' : mov.tipo === 'Tienda' ? '#dbeafe' : '#fef3c7',
                              color: mov.tipo === 'Membresia' ? '#065f46' : mov.tipo === 'Tienda' ? '#1e40af' : '#92400e',
                              padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold'
                            }}>
                              {mov.tipo}
                            </span>
                          </td>
                          <td style={{ padding: '15px 25px', color: '#0f172a', fontWeight: '500' }}>{mov.descripcion}</td>
                          <td style={{ padding: '15px 25px', fontWeight: '900', color: '#166534' }}>+ ${Number(mov.total).toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ==========================================
            VISTA 2: GRÁFICA DE BALANCES
            ========================================== */}
        {vistaActiva === 'grafica' && (
          <div className="panel-card" style={{ padding: '30px' }}>
            <h3 className="card-title" style={{ color: '#0f172a', marginBottom: '10px', fontSize: '1.4rem' }}>
              Flujo de Efectivo: Últimas Transacciones
            </h3>
            <p style={{ color: '#64748b', marginBottom: '40px' }}>Visualización del comportamiento de ingresos recientes.</p>

            {/* Contenedor de la Gráfica */}
            <div style={{ 
              display: 'flex', alignItems: 'flex-end', height: '350px', gap: '15px', 
              paddingBottom: '10px', borderBottom: '3px solid #cbd5e1', overflowX: 'auto' 
            }}>
              {ultimasTransacciones.length === 0 ? (
                <p style={{ width: '100%', textAlign: 'center', color: '#94a3b8' }}>Aún no hay datos para graficar.</p>
              ) : (
                ultimasTransacciones.map((t, index) => {
                  const heightPct = Math.max((Number(t.total) / maxValTransaccion) * 100, 5); // Mínimo 5% de altura para que se vea
                  const colorBarra = t.tipo === 'Membresia' ? '#10b981' : t.tipo === 'Tienda' ? '#3b82f6' : '#f59e0b';
                  
                  return (
                    <div key={index} style={{ flex: 1, minWidth: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', group: 'hover' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>
                        ${t.total}
                      </span>
                      <div style={{ 
                        width: '100%', 
                        backgroundColor: colorBarra, 
                        height: `${heightPct}%`, 
                        borderRadius: '6px 6px 0 0', 
                        transition: 'height 1s ease-out',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}></div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Leyenda de la Gráfica */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '30px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#475569' }}>
                <span style={{ display: 'block', width: '16px', height: '16px', backgroundColor: '#10b981', borderRadius: '4px' }}></span> Membresías
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#475569' }}>
                <span style={{ display: 'block', width: '16px', height: '16px', backgroundColor: '#3b82f6', borderRadius: '4px' }}></span> Pro-Shop
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#475569' }}>
                <span style={{ display: 'block', width: '16px', height: '16px', backgroundColor: '#f59e0b', borderRadius: '4px' }}></span> Clases Individuales
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}