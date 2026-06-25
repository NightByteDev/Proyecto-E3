import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Reservaciones from './pages/Reservaciones';
import Ventas from './pages/Ventas';
import Tienda from './pages/Tienda';
import MiCuenta from './pages/MiCuenta';
import Admin from './pages/Admin'; // <--- ¡Asegúrate de importar la nueva vista!
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rutas del Atleta */}
        <Route path="/reservaciones" element={<ProtectedRoute><Reservaciones /></ProtectedRoute>} />
        <Route path="/ventas" element={<ProtectedRoute><Ventas /></ProtectedRoute>} />
        <Route path="/tienda" element={<ProtectedRoute><Tienda /></ProtectedRoute>} />
        <Route path="/micuenta" element={<ProtectedRoute><MiCuenta /></ProtectedRoute>} />
        
        {/* Ruta del Administrador en Local */}
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;