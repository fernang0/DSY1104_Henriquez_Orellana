import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { CartButton } from './Cart';

function NavBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
    navigate('/', { replace: true });
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
              <Dropdown align="end">
                <Dropdown.Toggle 
                  variant="outline-primary" 
                  id="user-dropdown"
                  className="d-flex align-items-center"
                >
                  <span className="me-2">{user.avatar}</span>
                  {user.name}
                  {user.isStudent && <span className="ms-1 badge bg-warning">20%</span>}
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-dark">
                  <Dropdown.Header>
                    <strong>{user.name}</strong>
                    <br />
                    <small className="text-muted">{user.email}</small>
                    <br />
                    <small className="text-info">
                      Nivel {user.level} • {user.points} puntos
                    </small>
                  </Dropdown.Header>
                  
                  <Dropdown.Divider />
                  
                  <Dropdown.Item as={Link} to="/perfil">
                    👤 Mi Perfil
                  </Dropdown.Item>
                  
                  <Dropdown.Item as={Link} to="/mis-juegos">
                    🎮 Mis Juegos
                  </Dropdown.Item>
                  
                  <Dropdown.Item as={Link} to="/puntos">
                    🏆 Mis Puntos ({user.points})
                  </Dropdown.Item>
                  
                  {user.permissions?.includes('admin') && (
                    <>
                      <Dropdown.Divider />
                      <Dropdown.Item as={Link} to="/admin">
                        🛡️ Panel Admin
                      </Dropdown.Item>
                    </>
                  )}
                  
                  <Dropdown.Divider />
                  
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    🚪 Cerrar Sesión
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
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


