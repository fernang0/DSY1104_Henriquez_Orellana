import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/components/perfil.css';

function Perfil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    direccion: user?.direccion || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // TODO: Implementar actualización de perfil con API
    alert('Funcionalidad de actualización en desarrollo');
    setEditMode(false);
  };

  const handleChangePassword = () => {
    // TODO: Implementar cambio de contraseña
    alert('Funcionalidad de cambio de contraseña en desarrollo');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      // TODO: Implementar eliminación de cuenta
      alert('Funcionalidad de eliminación de cuenta en desarrollo');
    }
  };

  return (
    <div className="perfil-page">
      <Container className="py-4">
        <Row>
          <Col md={3}>
            <Card className="profile-sidebar">
              <Card.Body>
                <div className="profile-avatar text-center mb-3">
                  <div className="avatar-circle">
                    <span className="avatar-icon">👤</span>
                  </div>
                  <h5 className="mt-3">{user?.nombre}</h5>
                  <p className="text-muted">{user?.email}</p>
                  <Badge bg="primary">{user?.rol}</Badge>
                </div>

                <div className="profile-menu">
                  <Button
                    variant={activeTab === 'info' ? 'primary' : 'outline-primary'}
                    className="w-100 mb-2"
                    onClick={() => setActiveTab('info')}
                  >
                    📋 Información Personal
                  </Button>
                  <Button
                    variant={activeTab === 'pedidos' ? 'primary' : 'outline-primary'}
                    className="w-100 mb-2"
                    onClick={() => navigate('/mis-pedidos')}
                  >
                    📦 Mis Pedidos
                  </Button>
                  <Button
                    variant={activeTab === 'seguridad' ? 'primary' : 'outline-primary'}
                    className="w-100 mb-2"
                    onClick={() => setActiveTab('seguridad')}
                  >
                    🔒 Seguridad
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={9}>
            {activeTab === 'info' && (
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Información Personal</h5>
                  {!editMode ? (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setEditMode(true)}
                    >
                      ✏️ Editar
                    </Button>
                  ) : (
                    <div>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={handleSave}
                      >
                        💾 Guardar
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setEditMode(false)}
                      >
                        ✖️ Cancelar
                      </Button>
                    </div>
                  )}
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nombre Completo</Form.Label>
                          <Form.Control
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            disabled={!editMode}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!editMode}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Teléfono</Form.Label>
                          <Form.Control
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            placeholder="+56 9 1234 5678"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Rol</Form.Label>
                          <Form.Control
                            type="text"
                            value={user?.rol}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Dirección</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="Calle, número, comuna, región"
                      />
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>
            )}

            {activeTab === 'seguridad' && (
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Seguridad</h5>
                </Card.Header>
                <Card.Body>
                  <div className="security-section mb-4">
                    <h6>Cambiar Contraseña</h6>
                    <p className="text-muted">
                      Actualiza tu contraseña regularmente para mantener tu cuenta segura
                    </p>
                    <Button
                      variant="primary"
                      onClick={handleChangePassword}
                    >
                      🔑 Cambiar Contraseña
                    </Button>
                  </div>

                  <hr />

                  <div className="security-section">
                    <h6 className="text-danger">Zona de Peligro</h6>
                    <p className="text-muted">
                      Una vez elimines tu cuenta, no hay vuelta atrás. Por favor, está seguro.
                    </p>
                    <Button
                      variant="danger"
                      onClick={handleDeleteAccount}
                    >
                      🗑️ Eliminar Cuenta
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

// Badge component (inline para evitar import adicional)
function Badge({ bg, children }) {
  return (
    <span className={`badge bg-${bg}`}>
      {children}
    </span>
  );
}

export default Perfil;
