import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import BlogPage from './pages/BlogPage'
import BlogPost from './components/Blog/BlogPost'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'


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
      }
    ]
  }
])