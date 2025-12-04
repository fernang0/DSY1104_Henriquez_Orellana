import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Tabs, Tab } from 'react-bootstrap';
import { useProductos } from '../hooks/useProductos';
import { useCategorias } from '../hooks/useCategorias';
import { usePedidos } from '../hooks/usePedidos';
import '../styles/components/admin.css';

function Admin() {
  const { fetchProductos, loading: loadingProductos } = useProductos();
  const { fetchCategorias, loading: loadingCategorias } = useCategorias();
  const { fetchPedidos, loading: loadingPedidos } = usePedidos();
  
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prodData, catData, pedData] = await Promise.all([
        fetchProductos(),
        fetchCategorias(),
        fetchPedidos()
      ]);
      setProductos(prodData);
      setCategorias(catData);
      setPedidos(pedData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const formatCLP = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const getEstadoBadge = (estado) => {
    const variants = {
      PENDIENTE: 'warning',
      PAGADO: 'success',
      CANCELADO: 'danger'
    };
    return <Badge bg={variants[estado] || 'secondary'}>{estado}</Badge>;
  };

  // Estadísticas del dashboard
  const stats = {
    totalProductos: productos.length,
    totalCategorias: categorias.length,
    totalPedidos: pedidos.length,
    pedidosPendientes: pedidos.filter(p => p.estado === 'PENDIENTE').length,
    pedidosPagados: pedidos.filter(p => p.estado === 'PAGADO').length,
    ingresosTotal: pedidos
      .filter(p => p.estado === 'PAGADO')
      .reduce((sum, p) => sum + p.total, 0)
  };

  return (
    <div className="admin-page">
      <Container fluid className="py-4">
        <div className="admin-header mb-4">
          <h1>🛡️ Panel de Administración</h1>
          <p className="text-muted">Gestiona tu tienda LevelUp Gaming</p>
        </div>

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
        >
          <Tab eventKey="dashboard" title="📊 Dashboard">
            <Row className="g-4">
              <Col md={3}>
                <Card className="stat-card">
                  <Card.Body>
                    <div className="stat-icon">📦</div>
                    <h3>{stats.totalProductos}</h3>
                    <p>Productos</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="stat-card">
                  <Card.Body>
                    <div className="stat-icon">🏷️</div>
                    <h3>{stats.totalCategorias}</h3>
                    <p>Categorías</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="stat-card">
                  <Card.Body>
                    <div className="stat-icon">📋</div>
                    <h3>{stats.totalPedidos}</h3>
                    <p>Pedidos Totales</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="stat-card">
                  <Card.Body>
                    <div className="stat-icon">💰</div>
                    <h3>{formatCLP(stats.ingresosTotal)}</h3>
                    <p>Ingresos</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col md={6}>
                <Card>
                  <Card.Header>
                    <h5>📊 Pedidos por Estado</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="pedidos-stats">
                      <div className="stat-row">
                        <span>Pendientes:</span>
                        <Badge bg="warning">{stats.pedidosPendientes}</Badge>
                      </div>
                      <div className="stat-row">
                        <span>Pagados:</span>
                        <Badge bg="success">{stats.pedidosPagados}</Badge>
                      </div>
                      <div className="stat-row">
                        <span>Total:</span>
                        <Badge bg="info">{stats.totalPedidos}</Badge>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Header>
                    <h5>🎮 Productos Destacados</h5>
                  </Card.Header>
                  <Card.Body>
                    <p className="text-muted">
                      Total de productos activos: {productos.filter(p => p.activo).length}
                    </p>
                    <p className="text-muted">
                      Productos sin stock: {productos.filter(p => p.stock === 0).length}
                    </p>
                    <p className="text-muted">
                      Stock bajo (&lt;10): {productos.filter(p => p.stock > 0 && p.stock < 10).length}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="productos" title="📦 Productos">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Lista de Productos</h5>
                <Button variant="primary" size="sm">
                  ➕ Nuevo Producto
                </Button>
              </Card.Header>
              <Card.Body>
                {loadingProductos ? (
                  <p>Cargando productos...</p>
                ) : (
                  <Table responsive hover variant="dark">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>SKU</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.slice(0, 10).map(producto => (
                        <tr key={producto.id}>
                          <td>{producto.id}</td>
                          <td>{producto.sku}</td>
                          <td>{producto.nombre}</td>
                          <td>{producto.categoriaNombre}</td>
                          <td>{formatCLP(producto.precio)}</td>
                          <td>
                            <Badge bg={producto.stock > 10 ? 'success' : producto.stock > 0 ? 'warning' : 'danger'}>
                              {producto.stock}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={producto.activo ? 'success' : 'secondary'}>
                              {producto.activo ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </td>
                          <td>
                            <Button variant="outline-primary" size="sm" className="me-1">
                              ✏️
                            </Button>
                            <Button variant="outline-danger" size="sm">
                              🗑️
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="pedidos" title="📋 Pedidos">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Lista de Pedidos</h5>
              </Card.Header>
              <Card.Body>
                {loadingPedidos ? (
                  <p>Cargando pedidos...</p>
                ) : (
                  <Table responsive hover variant="dark">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Método Pago</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidos.slice(0, 20).map(pedido => (
                        <tr key={pedido.id}>
                          <td>#{pedido.id}</td>
                          <td>{pedido.usuarioNombre || pedido.usuarioId}</td>
                          <td>{new Date(pedido.fechaPedido).toLocaleDateString('es-CL')}</td>
                          <td>{formatCLP(pedido.total)}</td>
                          <td>{pedido.metodoPago}</td>
                          <td>{getEstadoBadge(pedido.estado)}</td>
                          <td>
                            <Button variant="outline-info" size="sm">
                              👁️ Ver
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="categorias" title="🏷️ Categorías">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Lista de Categorías</h5>
                <Button variant="primary" size="sm">
                  ➕ Nueva Categoría
                </Button>
              </Card.Header>
              <Card.Body>
                {loadingCategorias ? (
                  <p>Cargando categorías...</p>
                ) : (
                  <Table responsive hover variant="dark">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Productos</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categorias.map(categoria => (
                        <tr key={categoria.id}>
                          <td>{categoria.id}</td>
                          <td>{categoria.nombre}</td>
                          <td>{categoria.descripcion || 'N/A'}</td>
                          <td>
                            <Badge bg="info">
                              {productos.filter(p => p.categoriaId === categoria.id).length}
                            </Badge>
                          </td>
                          <td>
                            <Button variant="outline-primary" size="sm" className="me-1">
                              ✏️
                            </Button>
                            <Button variant="outline-danger" size="sm">
                              🗑️
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}

export default Admin;
