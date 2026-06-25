import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Reservaciones from './pages/Reservaciones';
import Ventas from './pages/Ventas';
import MiCuenta from './pages/MiCuenta';
import Tienda from './pages/Tienda';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute'; // Asegúrate de tener este componente

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Panel del Atleta */}
        <Route path="/reservaciones" element={<ProtectedRoute><Reservaciones /></ProtectedRoute>} />
        <Route path="/ventas" element={<ProtectedRoute><Ventas /></ProtectedRoute>} />
        <Route path="/tienda" element={<ProtectedRoute><Tienda /></ProtectedRoute>} />
        <Route path="/micuenta" element={<ProtectedRoute><MiCuenta /></ProtectedRoute>} />
        
        {/* Panel del Administrador */}
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;