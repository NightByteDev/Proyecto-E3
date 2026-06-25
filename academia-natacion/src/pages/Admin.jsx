import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaChartLine, FaMoneyBillWave, FaListAlt } from 'react-icons/fa';
import './Panel.css';

export default function Admin() {
  const [datos, setDatos] = useState({ historial: [], ingresosTotales: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/api/admin/ventas')
      .then(res => res.json())
      .then(data => setDatos(data));
  }, []);

  return (
    <div className="panel-container">
      <aside className="panel-sidebar" style={{ backgroundColor: '#1e293b' }}>
        <div>
          <h2 className="sidebar-brand" style={{ color: '#38bdf8' }}>Admin Panel ⚙️</h2>
          <p className="sidebar-user">Modo: <span>Director General</span></p>
          <nav className="sidebar-nav">
            <div className="nav-item active"><FaChartLine /> Finanzas Globales</div>
          </nav>
        </div>
        <button onClick={() => { localStorage.clear(); navigate('/'); }} className="btn-logout"><FaSignOutAlt /> Salir</button>
      </aside>

      <main className="panel-main">
        <h1 className="panel-header">Balance Financiero General</h1>
        
        <div className="panel-grid" style={{ marginBottom: '30px' }}>
          <div className="panel-card" style={{ borderTop: '5px solid #3b82f6', backgroundColor: '#eff6ff' }}>
            <h3 className="card-title flex items-center gap-2"><FaMoneyBillWave style={{ color: '#3b82f6' }} /> Ingresos Brutos</h3>
            <p style={{ fontSize: '3rem', fontWeight: '900', color: '#1e3a8a' }}>
              ${Number(datos.ingresosTotales).toLocaleString()} <span style={{ fontSize: '1rem', color: '#64748b' }}>MXN</span>
            </p>
          </div>
          <div className="panel-card" style={{ borderTop: '5px solid #8b5cf6' }}>
            <h3 className="card-title flex items-center gap-2"><FaListAlt style={{ color: '#8b5cf6' }} /> Total de Operaciones</h3>
            <p style={{ fontSize: '3rem', fontWeight: '900', color: '#4c1d95' }}>{datos.historial.length}</p>
          </div>
        </div>

        <div className="panel-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '25px 30px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <h3 className="card-title" style={{ margin: 0, fontSize: '1.3rem' }}>Libro Mayor de Transacciones</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#1e293b', color: 'white' }}>
                  <th style={{ padding: '15px' }}>Fecha</th>
                  <th style={{ padding: '15px' }}>Usuario (Email)</th>
                  <th style={{ padding: '15px' }}>Categoría</th>
                  <th style={{ padding: '15px' }}>Concepto</th>
                  <th style={{ padding: '15px' }}>Monto</th>
                </tr>
              </thead>
              <tbody>
                {datos.historial.map((mov) => (
                  <tr key={mov.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '15px' }}>{new Date(mov.fecha).toLocaleString()}</td>
                    <td style={{ padding: '15px', color: '#3b82f6', fontWeight: 'bold' }}>{mov.usuario_email}</td>
                    <td style={{ padding: '15px' }}>{mov.tipo}</td>
                    <td style={{ padding: '15px' }}>{mov.descripcion}</td>
                    <td style={{ padding: '15px', fontWeight: '900', color: '#166534' }}>+ ${mov.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}