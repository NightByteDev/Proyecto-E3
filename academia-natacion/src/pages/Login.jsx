import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './Login.css';

export default function Login() {
  const [esRegistro, setEsRegistro] = useState(false);
  
  const [nombre, setNombre] = useState('');
  const [apellidoP, setApellidoP] = useState('');
  const [apellidoM, setApellidoM] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const nombreCompleto = `${nombre} ${apellidoP} ${apellidoM}`.trim();
    const endpoint = esRegistro ? '/api/register' : '/api/login';
    const bodyData = esRegistro 
      ? { nombre: nombreCompleto, email, password } 
      : { email, password };

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.mensaje || 'Ocurrió un error');

      if (esRegistro) {
        alert('¡Registro exitoso! Ya puedes iniciar sesión.');
        setEsRegistro(false); 
        setNombre(''); setApellidoP(''); setApellidoM(''); setPassword('');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', data.usuario.nombre);
        localStorage.setItem('email', data.usuario.email); // <--- ¡AGREGA ESTA LÍNEA!
        
        // Redirección inteligente: Si es el admin, lo mandamos al dashboard financiero
        if (data.usuario.email === 'adminPrincipal@admin.com' || data.usuario.email === 'admin@admin.com') {
          navigate('/admin');
        } else {
          navigate('/reservaciones');
        }
      
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        
        {/* BOTÓN DE VOLVER FIJO AL INICIO */}
        <Link to="/" className="back-link">
          Volver al inicio
        </Link>

        <h2 className="login-title">Escuela de Natación</h2>
        <p className="login-subtitle">
          {esRegistro ? 'Completa tus datos para registrarte' : 'Ingresa a tu panel de control'}
        </p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          {esRegistro && (
            <>
              <div className="form-group">
                <label>Nombre(s)</label>
                <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Carlos" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Apellido Paterno</label>
                  <input type="text" required value={apellidoP} onChange={(e) => setApellidoP(e.target.value)} placeholder="Pérez" />
                </div>
                <div className="form-group">
                  <label>Apellido Materno</label>
                  <input type="text" required value={apellidoM} onChange={(e) => setApellidoM(e.target.value)} placeholder="López" />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="atleta@correo.com" />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          <button type="submit" className="btn-submit">
            {esRegistro ? 'Crear Cuenta' : 'Ingresar'}
          </button>
        </form>

        <button 
          type="button"
          onClick={() => { setEsRegistro(!esRegistro); setError(''); }} 
          className="login-toggle"
        >
          {esRegistro ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate aquí'}
        </button>
      </div>
    </div>
  );
}