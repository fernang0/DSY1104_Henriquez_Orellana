import { Container, Nav, Navbar, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

function NavBar() {
  return (
    <Navbar expand="lg" className="navbar-gaming py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <Image 
            src={logo} 
            alt="LevelUp Gaming Logo" 
            height="40" 
            className="me-2 navbar-logo"
          />
          <span className="text-glow">LevelUp Gaming</span>
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
          
          <Nav>
            <Nav.Link as={Link} to="/login" className="btn btn-outline-primary me-2">
              Iniciar Sesión
            </Nav.Link>
            <Nav.Link as={Link} to="/registro" className="btn btn-primary glow-effect">
              Registrarse
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar