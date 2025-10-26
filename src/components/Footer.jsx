import { Container, Row, Col } from 'react-bootstrap'

function Footer() {
  return (
    <footer className="text-light py-5 mt-auto" style={{ 
      background: 'linear-gradient(135deg, #1a1f2e 0%, #2d1b69 50%, #1a1f2e 100%)',
      borderTop: '3px solid #00d4ff'
    }}>
      <Container>
        {/* Secciones principales del footer */}
        <Row className="mb-5">
          {/* Ayuda */}
          <Col lg={3} md={6} className="mb-4">
            <h6 className="fw-bold mb-3 text-uppercase d-flex align-items-center" style={{ color: '#00d4ff' }}>
              <i className="fas fa-life-ring me-2"></i>
              Ayuda
            </h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/ayuda" className="text-light text-decoration-none hover-primary d-flex align-items-center">
                  <i className="fas fa-question-circle me-2 text-primary"></i>
                  Centro de ayuda
                </a>
              </li>
              <li className="mb-2">
                <a href="/seguimiento" className="text-light text-decoration-none hover-primary d-flex align-items-center">
                  <i className="fas fa-truck me-2 text-primary"></i>
                  Seguimiento de mi compra
                </a>
              </li>
              <li className="mb-2">
                <a href="/contacto" className="text-light text-decoration-none hover-primary d-flex align-items-center">
                  <i className="fas fa-envelope me-2 text-primary"></i>
                  Formulario de contacto
                </a>
              </li>
              <li className="mb-2">
                <a href="/concursos" className="text-light text-decoration-none hover-primary d-flex align-items-center">
                  <i className="fas fa-trophy me-2 text-primary"></i>
                  Bases de concursos gaming
                </a>
              </li>
            </ul>
          </Col>

          {/* Nosotros */}
          <Col lg={3} md={6} className="mb-4">
            <h6 className="fw-bold mb-3 text-uppercase d-flex align-items-center" style={{ color: '#00d4ff' }}>
              <i className="fas fa-users me-2"></i>
              Nosotros
            </h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/nosotros" className="text-light text-decoration-none hover-primary d-flex align-items-center">
                  <i className="fas fa-info-circle me-2 text-primary"></i>
                  Quiénes somos
                </a>
              </li>
              <li className="mb-2">
                <a href="/corporativas" className="text-light text-decoration-none hover-primary d-flex align-items-center">
                  <i className="fas fa-building me-2 text-primary"></i>
                  Ventas corporativas
                </a>
              </li>
              <li className="mb-2">
                <a href="/gaming-labs" className="text-light text-decoration-none hover-primary d-flex align-items-center">
                  <span className="me-2 text-primary">🎮</span>
                  LevelUP Labs
                </a>
              </li>
              <li className="mb-2">
                <a href="/terminos" className="text-light text-decoration-none hover-primary d-flex align-items-center">
                  <i className="fas fa-file-contract me-2 text-primary"></i>
                  Términos y Condiciones
                </a>
              </li>
              <li className="mb-2">
                <a href="/privacidad" className="text-light text-decoration-none hover-primary d-flex align-items-center">
                  <i className="fas fa-shield-alt me-2 text-primary"></i>
                  Políticas de privacidad
                </a>
              </li>
            </ul>
          </Col>

          {/* Comunidad Gaming */}
          <Col lg={3} md={6} className="mb-4">
            <h6 className="fw-bold mb-3 text-uppercase d-flex align-items-center" style={{ color: '#00d4ff' }}>
              <i className="fas fa-gamepad me-2"></i>
              Comunidad Gaming
            </h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="https://instagram.com/levelupgaming" className="text-light text-decoration-none hover-primary d-flex align-items-center" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram me-2 text-primary"></i>
                  Instagram
                </a>
              </li>
              <li className="mb-2">
                <a href="/gaming-labs" className="text-light text-decoration-none hover-primary d-flex align-items-center">
                  <span className="me-2 text-primary">🎮</span>
                  Gaming Labs
                </a>
              </li>
              <li className="mb-2">
                <a href="https://twitch.tv/levelupgaming" className="text-light text-decoration-none hover-primary d-flex align-items-center" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitch me-2 text-primary"></i>
                  Twitch
                </a>
              </li>
              <li className="mb-2">
                <a href="https://discord.gg/levelupgaming" className="text-light text-decoration-none hover-primary d-flex align-items-center" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-discord me-2 text-primary"></i>
                  Discord
                </a>
              </li>
            </ul>
          </Col>

          {/* Información de contacto */}
          <Col lg={3} md={6} className="mb-4">
            <div className="d-flex justify-content-end">
              <div className="text-end">
                <p className="mb-1 fw-bold">Av. Providencia N° 1234, Providencia, Santiago de Chile</p>
                <p className="mb-3 fw-bold text-primary">Horario Atención Tienda y Punto de Retiro:</p>
                <p className="mb-1 small">Lunes a Jueves - 09:00 a 19:00</p>
                <p className="mb-0 small">Viernes - 09:00 a 18:00</p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Medios de pago */}
        <Row className="mb-4">
          <Col>
            <div className="border-top border-secondary pt-4">
              <h6 className="fw-bold mb-3 text-uppercase d-flex align-items-center" style={{ color: '#00d4ff' }}>
                <i className="fas fa-credit-card me-2"></i>
                Medios de pago
              </h6>
              <div className="d-flex flex-wrap align-items-center gap-3">
                {/* WebPay */}
                <div className="payment-method d-flex align-items-center px-3 py-2 bg-light rounded">
                  <span className="fw-bold text-dark">webpay.</span>
                  <small className="text-muted ms-1">transbank</small>
                </div>
                
                {/* Mercado Pago */}
                <div className="payment-method d-flex align-items-center px-3 py-2 bg-primary rounded">
                  <i className="fas fa-circle text-warning me-1"></i>
                  <span className="text-white fw-bold">mercado</span>
                  <span className="text-white ms-1">pago</span>
                </div>
                
                {/* Santander */}
                <div className="payment-method d-flex align-items-center px-3 py-2 bg-danger rounded">
                  <span className="text-white fw-bold">Santander</span>
                </div>
                
                {/* Banco Estado */}
                <div className="payment-method d-flex align-items-center px-3 py-2 bg-success rounded">
                  <i className="fas fa-university text-white me-2"></i>
                  <span className="text-white fw-bold">BancoEstado</span>
                </div>
                
                {/* Transferencia Bancaria */}
                <div className="payment-method d-flex align-items-center px-3 py-2 bg-info rounded">
                  <i className="fas fa-exchange-alt text-white me-2"></i>
                  <span className="text-white fw-bold">Transferencia</span>
                  <small className="text-white ms-1">Bancaria</small>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Footer inferior */}
        <Row className="border-top border-secondary pt-4 align-items-center">
          <Col lg={4} md={6} className="mb-3 mb-lg-0">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <div className="border border-primary p-2 rounded d-flex align-items-center" style={{ background: 'rgba(0, 212, 255, 0.1)' }}>
                  <span className="me-2">🎮</span>
                  <span className="text-primary fw-bold">LevelUP</span>
                </div>
              </div>
              <div>
                <small className="text-muted">Dirección</small><br />
                <strong className="d-flex align-items-center">
                  <span className="me-2">🎮</span>
                  LevelUP Gaming
                </strong>
              </div>
            </div>
          </Col>

          <Col lg={4} md={6} className="mb-3 mb-lg-0 text-center">
            <div className="d-flex align-items-center justify-content-center">
              <div className="me-3">
                <i className="fas fa-shield-alt text-primary fs-4"></i>
              </div>
              <div className="text-start">
                <small className="text-light">LevelUP Gaming protege toda tu información con</small><br />
                <strong className="text-primary">Secure Sockets Layer (SSL)</strong>
              </div>
            </div>
          </Col>

          <Col lg={4} className="text-lg-end">
            <div className="d-flex justify-content-lg-end justify-content-center gap-3 mb-3">
              <a href="https://instagram.com/levelupgaming" className="text-light fs-4" title="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://facebook.com/levelupgaming" className="text-light fs-4" title="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://linkedin.com/company/levelupgaming" className="text-light fs-4" title="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://twitch.tv/levelupgaming" className="text-light fs-4" title="Twitch">
                <i className="fab fa-twitch"></i>
              </a>
              <a href="https://twitter.com/levelupgaming" className="text-light fs-4" title="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://youtube.com/levelupgaming" className="text-light fs-4" title="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </Col>
        </Row>

        {/* Copyright */}
        <Row className="mt-4">
          <Col className="text-center">
            <p className="mb-0 text-light fw-bold" style={{ fontSize: '14px' }}>
              © 2000-2025 | <span className="text-primary">LevelUP Gaming.cl</span> Todos los derechos reservados | 
              Desarrollado con <span className="text-danger">❤️</span> por la gran familia gamer
            </p>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .hover-primary:hover {
          color: #00d4ff !important;
          transition: color 0.3s ease;
        }
        .payment-method {
          border: 1px solid rgba(255,255,255,0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          min-height: 40px;
          min-width: 120px;
          justify-content: center;
        }
        .payment-method:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
        }
      `}</style>
    </footer>
  )
}

export default Footer