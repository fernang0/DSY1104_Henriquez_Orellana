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
        element: <Checkout />
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