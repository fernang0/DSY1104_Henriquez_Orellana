import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { CartButton } from './Cart/index.js';

function NavBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Verificar estado de autenticación
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          setUser(null);
        }
      }
    };

    checkAuthStatus();
    
    // Escuchar cambios en localStorage
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('rememberMe');
    setUser(null);
    setIsDropdownOpen(false);
    navigate('/', { replace: true });
  };

  // Cerrar el menú cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  const handleMenuClick = (event) => {
    event.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <Navbar expand="lg" className="navbar-gaming py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <span className="text-glow">🎮 LevelUp Gaming</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="hover-lift">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/productos" className="hover-lift">Productos</Nav.Link>
            <Nav.Link as={Link} to="/blog" className="hover-lift">Blog</Nav.Link>
            <Nav.Link as={Link} to="/nosotros" className="hover-lift">Nosotros</Nav.Link>
            <Nav.Link as={Link} to="/contacto" className="hover-lift">Contacto</Nav.Link>
          </Nav>
          
          <Nav className="d-flex align-items-center">
            {/* Botón del carrito */}
            <CartButton className="me-3" />
            
            {user ? (
              // Usuario logueado - mostrar menú de usuario
              <div className="dropdown">
                <button 
                  type="button"
                  variant="outline-primary" 
                  id="user-dropdown"
                  className="d-flex align-items-center dropdown-toggle btn btn-outline-primary"
                  data-testid="user-menu"
                  onClick={handleMenuClick}
                >
                  <span className="me-2">{user.avatar}</span>
                  {user.name}
                  {user.isStudent && <span className="ms-1 badge bg-warning">20%</span>}
                </button>

                <div className={`dropdown-menu dropdown-menu-dark ${isDropdownOpen ? 'show' : ''}`}>
                  <div className="dropdown-header">
                    <strong>{user.name}</strong>
                    <br />
                    <small className="text-muted">{user.email}</small>
                    <br />
                    <small className="text-info">
                      Nivel {user.level} • {user.points} puntos
                    </small>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <Link to="/perfil" className="dropdown-item">
                    👤 Mi Perfil
                  </Link>
                  
                  <Link to="/mis-juegos" className="dropdown-item">
                    🎮 Mis Juegos
                  </Link>
                  
                  <Link to="/puntos" className="dropdown-item">
                    🏆 Mis Puntos ({user.points})
                  </Link>
                  
                  {user.permissions?.includes('admin') && (
                    <>
                      <div className="dropdown-divider"></div>
                      <Link to="/admin" className="dropdown-item">
                        🛡️ Panel Admin
                      </Link>
                    </>
                  )}
                  
                  <div className="dropdown-divider"></div>
                  
                  <button 
                    onClick={handleLogout} 
                    className="dropdown-item text-danger"
                    data-testid="logout-button"
                  >
                    🚪 Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              // Usuario no logueado - mostrar botones de autenticación
              <>
                <Nav.Link as={Link} to="/login" className="btn btn-outline-primary me-2">
                  Iniciar Sesión
                </Nav.Link>
                <Nav.Link as={Link} to="/registro" className="btn btn-primary glow-effect">
                  Registrarse
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;


