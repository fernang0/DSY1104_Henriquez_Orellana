import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'
import { CartSidebar } from './Cart'

function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
      {/* Carrito lateral */}
      <CartSidebar />
    </div>
  )
}

export default Layout