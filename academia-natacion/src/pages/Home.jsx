import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaPhoneAlt, FaEnvelope, FaChevronDown, FaWater, FaLaptop, FaMedal, FaShieldAlt } from 'react-icons/fa';
import './Home.css';

export default function Home() {
  const observerRef = useRef(null);
  const nextSectionRef = useRef(null); // Referencia para el botón "Descubre más"
  
  const [currentImg, setCurrentImg] = useState(0);
  const totalImgs = 10;

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show-scroll');
        } else {
          entry.target.classList.remove('show-scroll');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.hidden-scroll, .hidden-left, .hidden-right, .hidden-scale');
    hiddenElements.forEach((el) => observerRef.current.observe(el));

    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % totalImgs);
    }, 4000);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      clearInterval(interval);
    };
  }, []);

  const nextImg = () => setCurrentImg((prev) => (prev + 1) % totalImgs);
  const prevImg = () => setCurrentImg((prev) => (prev - 1 + totalImgs) % totalImgs);

  // Función para bajar suavemente al dar clic
  const scrollToNext = () => {
    nextSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-wrapper">
      
      {/* TOP BAR CON REACT ICONS */}
      <div className="top-bar">
        <div className="social-links">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <FaFacebookF /> Facebook
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <FaInstagram /> Instagram
          </a>
        </div>
        <div className="contact-info">
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaPhoneAlt /> (55) 1234 5678</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaEnvelope /> contacto@EscueladeNatacion.mx</span>
        </div>
      </div>

      <header className="main-header">
        <div className="brand-logo">Escuela de Natación</div>
        <div className="auth-buttons">
          <Link to="/login" className="btn-login">Ingresar</Link>
          <Link to="/login" className="btn-register">Registrarse</Link>
        </div>
      </header>

      {/* HERO SECTION CON VIDEO Y BURBUJAS */}
      <section className="hero-section">
        <video autoPlay loop muted playsInline className="video-background">
          <source src="/videoHome.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>

        <div className="bubbles-container">
          <div className="bubble"></div><div className="bubble"></div><div className="bubble"></div>
          <div className="bubble"></div><div className="bubble"></div><div className="bubble"></div>
          <div className="bubble"></div>
        </div>

        <div className="hero-text-container hidden-left">
          <h1 className="hero-title">
            NATACIÓN <br /> <span>SIN LÍMITE</span>
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px', lineHeight: '1.6', textShadow: '1px 1px 5px rgba(0,0,0,0.8)' }}>
            Has llegado al <strong>lugar donde cada brazada te acerca a tu mejor versión.</strong> 
            ¿Te atreves a descubrir todo tu potencial en el agua?
          </p>
          <Link to="/login" className="btn-login" style={{ fontSize: '1.2rem', padding: '15px 30px', display: 'inline-block' }}>
            Comienza tu Prueba
          </Link>
        </div>

        {/* BOTÓN DESCUBRE MÁS */}
        <div className="scroll-down-wrapper" onClick={scrollToNext}>
          <div className="scroll-down-text">Descubre más</div>
          <div className="scroll-down-btn"><FaChevronDown /></div>
        </div>
      </section>

      {/* CARRUSEL DE IMÁGENES (Aquí apunta el botón) */}
      <section className="info-section" ref={nextSectionRef}>
        <h2 className="section-title blue-text hidden-scale">Nuestras Instalaciones</h2>
        <div className="carousel-container hidden-scale">
          <button className="carousel-btn left" onClick={prevImg}>❮</button>
          <img src={`/imgHome${currentImg + 1}.jpg`} alt={`Instalación ${currentImg + 1}`} className="carousel-slide" />
          <button className="carousel-btn right" onClick={nextImg}>❯</button>
          <div className="carousel-indicators">
            {Array.from({ length: 10 }).map((_, idx) => (
              <span key={idx} className={`indicator ${idx === currentImg ? 'active' : ''}`} onClick={() => setCurrentImg(idx)}></span>
            ))}
          </div>
        </div>
      </section>

      <section className="info-section gray-bg">
        <h2 className="section-title blue-text hidden-scale">Ofertas de Inscripción</h2>
        <div className="cards-container">
          <div className="info-card hidden-left" style={{ transitionDelay: '0.1s' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#034078' }}>Plan Bronce</h3>
            <p style={{ fontSize: '2rem', fontWeight: '900', margin: '15px 0' }}>$800<span style={{ fontSize: '1rem', color: '#666' }}>/mes</span></p>
            <p>2 clases por semana. Acceso a regaderas y locker compartido.</p>
          </div>
          <div className="info-card hidden-scale" style={{ transitionDelay: '0.2s', border: '2px solid #00a8e8' }}>
            <div style={{ background: '#ffc300', color: '#001f54', padding: '5px', borderRadius: '20px', fontWeight: 'bold', marginBottom: '10px', display: 'inline-block' }}>MÁS POPULAR</div>
            <h3 style={{ fontSize: '1.8rem', color: '#034078' }}>Plan Plata</h3>
            <p style={{ fontSize: '2rem', fontWeight: '900', margin: '15px 0' }}>$1,400<span style={{ fontSize: '1rem', color: '#666' }}>/mes</span></p>
            <p>4 clases por semana. Locker exclusivo e inscripción gratis este mes.</p>
          </div>
          <div className="info-card hidden-right" style={{ transitionDelay: '0.1s' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#034078' }}>Plan Oro (Élite)</h3>
            <p style={{ fontSize: '2rem', fontWeight: '900', margin: '15px 0' }}>$2,200<span style={{ fontSize: '1rem', color: '#666' }}>/mes</span></p>
            <p>Acceso libre todos los días. Incluye asesoría nutricional y de gimnasio.</p>
          </div>
        </div>
      </section>

      <section className="info-section">
        <h2 className="section-title blue-text hidden-right">¿Qué Enseñamos?</h2>
        <div className="cards-container">
          <div className="info-card hidden-right" style={{ transitionDelay: '0.1s' }}>
            <div style={{ marginBottom: '15px' }}><span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#00a8e8' }}>pool</span></div>
            <h3 style={{ color: '#034078' }}>Estilos Libres</h3>
            <p>Perfeccionamiento de Crol y Dorso para eficiencia y velocidad.</p>
          </div>
          <div className="info-card hidden-right" style={{ transitionDelay: '0.2s' }}>
            <div style={{ marginBottom: '15px' }}><span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#00a8e8' }}>water_drop</span></div>
            <h3 style={{ color: '#034078' }}>Estilos Complejos</h3>
            <p>Dominio técnico de Mariposa y Pecho con entrenadores certificados.</p>
          </div>
          <div className="info-card hidden-right" style={{ transitionDelay: '0.3s' }}>
            <div style={{ marginBottom: '15px' }}><span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#00a8e8' }}>directions_bike</span></div>
            <h3 style={{ color: '#034078' }}>Entrenamiento Triatlón</h3>
            <p>Resistencia en aguas abiertas y transiciones rápidas.</p>
          </div>
        </div>
      </section>

      <section className="info-section gray-bg">
        <h2 className="section-title blue-text hidden-scale">Lo que dicen de Escuela de Natación</h2>
        <div className="reviews-container">
          <div className="review-card hidden-scroll" style={{ transitionDelay: '0.1s' }}>
            <div className="review-stars"><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span></div>
            <p className="review-text">"Increíble academia. El sistema de reservaciones es súper rápido y las instalaciones están impecables."</p>
            <p className="review-author">— Mariana V.</p>
          </div>
          <div className="review-card hidden-scroll" style={{ transitionDelay: '0.3s' }}>
            <div className="review-stars"><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span></div>
            <p className="review-text">"Mis hijos aman el Aqua Fun Fest. Los profesores son muy pacientes y el agua está a la temperatura perfecta."</p>
            <p className="review-author">— Roberto G.</p>
          </div>
          <div className="review-card hidden-scroll" style={{ transitionDelay: '0.5s' }}>
            <div className="review-stars"><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span></div>
            <p className="review-text">"Excelente para atletas de alto rendimiento. Entreno para triatlón y he mejorado muchísimo mi técnica."</p>
            <p className="review-author">— Andrea L.</p>
          </div>
        </div>
      </section>

      {/* MEJORA: POR QUÉ ELEGIRNOS CON TARJETAS GRID Y REACT ICONS */}
      <section className="info-section dark-bg text-center">
        <div className="hidden-left">
          <h2 className="section-title">¿Por qué elegirnos?</h2>
          <div className="why-us-grid">
            <div className="why-us-item">
              <div className="why-us-icon"><FaWater /></div>
              <h3>Alberca Semiolímpica</h3>
              <p>25m de longitud, techada y climatizada a 28°C los 365 días del año.</p>
            </div>
            <div className="why-us-item">
              <div className="why-us-icon"><FaLaptop /></div>
              <h3>Reservas Online</h3>
              <p>Aparta tu carril y gestiona tus horarios desde el celular sin hacer filas.</p>
            </div>
            <div className="why-us-item">
              <div className="why-us-icon"><FaMedal /></div>
              <h3>Instructores Élite</h3>
              <p>Staff certificado por la Federación Mexicana de Natación (FMN).</p>
            </div>
            <div className="why-us-item">
              <div className="why-us-icon"><FaShieldAlt /></div>
              <h3>Tecnología UV</h3>
              <p>Tratamiento de agua con luz ultravioleta de grado hospitalario, sin exceso de cloro.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section">
        <h2 className="section-title blue-text hidden-scale">¿Dónde nos ubicamos?</h2>
        <div className="hidden-scale" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
            <span className="material-symbols-outlined" style={{ color: '#034078' }}>location_on</span> Av. Hacienda de Rancho Seco S/N, Impulsora Popular Avícola, 57130 Nezahualcóyotl, Méx. (Sede FES Aragón)
          </p>
          <div style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(3, 64, 120, 0.2)' }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.8596666874834!2d-99.04353592478443!3d19.46162388182419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1fb1b6cc845d1%3A0x6b14619717769af5!2sFES%20Arag%C3%B3n%20UNAM!5e0!3m2!1ses-419!2smx!4v1716440000000!5m2!1ses-419!2smx" 
              width="100%" height="450" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <h3><span className="material-symbols-outlined">apartment</span> Corporativo Escuela de Natación</h3>
          <p>Sede Oficial FES Aragón</p>
          <p>Zona Norte, Estado de México</p>
        </div>
        <div>
          <h3><span className="material-symbols-outlined">public</span> Navegación</h3>
          <ul>
            <li><a href="#">Convenios Universitarios</a></li>
            <li><a href="#">Bolsa de Trabajo</a></li>
            <li><a href="#">Tienda de Equipo</a></li>
          </ul>
        </div>
        <div>
          <h3><span className="material-symbols-outlined">balance</span> Legal</h3>
          <ul>
            <li><a href="#">Aviso de Privacidad</a></li>
            <li><a href="#">Reglamento de Alberca</a></li>
          </ul>
          <p style={{ marginTop: '20px', fontSize: '0.8rem', opacity: '0.5' }}>
            © 2026 Escuela de Natación Inc. <br/>Proyecto de Evaluación Económica.
          </p>
        </div>
      </footer>

    </div>
  );
}