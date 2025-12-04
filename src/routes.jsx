import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import BlogPage from './pages/BlogPage'
import BlogPost from './components/Blog/BlogPost'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import { Login, Register } from './components/Auth'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import MisPedidos from './pages/MisPedidos'
import Perfil from './pages/Perfil'
import Admin from './pages/Admin'
import PagoResultado from './pages/PagoResultado'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'blog',
        element: <BlogPage />
      },
      {
        path: 'blog/:slug',
        element: <BlogPost />
      },
      {
        path: 'nosotros',
        element: <AboutPage />
      },
      {
        path: 'contacto',
        element: <ContactPage />
      },
      {
        path: 'productos',
        element: <Products />
      },
      {
        path: 'productos/:productId',
        element: <ProductDetail />
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        )
      },
      {
        path: 'perfil',
        element: (
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        )
      },
      {
        path: 'mis-pedidos',
        element: (
          <ProtectedRoute>
            <MisPedidos />
          </ProtectedRoute>
        )
      },
      {
        path: 'admin',
        element: (
          <AdminRoute>
            <Admin />
          </AdminRoute>
        )
      },
      {
        path: 'pago-resultado',
        element: (
          <ProtectedRoute>
            <PagoResultado />
          </ProtectedRoute>
        )
      }
    ]
  },
  // Rutas de autenticación (fuera del layout principal)
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/registro',
    element: <Register />
  }
])