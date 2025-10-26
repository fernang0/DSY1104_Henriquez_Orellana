import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../../context/CartContext';
import NavBar from '../../components/NavBar';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('NavBar Component', () => {
  // Mock del localStorage para el carrito
  const mockCartItems = [];

  // Función para renderizar con todos los providers necesarios
  const renderWithProviders = (component) => {
    localStorage.setItem('levelup_cart', JSON.stringify(mockCartItems));
    
    return render(
      <CartProvider>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </CartProvider>
    );
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renderiza el logo y el nombre de la tienda', () => {
    renderWithProviders(<NavBar />);
    const brand = screen.getByText(/LevelUp Gaming/i);
    expect(brand).toBeInTheDocument();
  });

  it('muestra los enlaces de navegación correctos', () => {
    renderWithProviders(<NavBar />);
    expect(screen.getByText(/Inicio/i)).toBeInTheDocument();
    expect(screen.getByText(/Productos/i)).toBeInTheDocument();
    expect(screen.getByText(/Blog/i)).toBeInTheDocument();
    expect(screen.getByText(/Nosotros/i)).toBeInTheDocument();
    expect(screen.getByText(/Contacto/i)).toBeInTheDocument();
  });

  it('muestra botones de login y registro cuando no hay usuario', () => {
    renderWithProviders(<NavBar />);
    expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument();
    expect(screen.getByText(/Registrarse/i)).toBeInTheDocument();
  });

  it('muestra el menú de usuario cuando está autenticado', () => {
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com',
      level: 1,
      points: 100,
      avatar: '👤'
    };

    localStorage.setItem('authToken', 'mock-token');
    localStorage.setItem('userData', JSON.stringify(mockUser));

    renderWithProviders(<NavBar />);
    const userMenuButton = screen.getByTestId('user-menu');
    expect(userMenuButton).toBeInTheDocument();
    expect(userMenuButton).toHaveTextContent(mockUser.name);
  });

  it('cierra sesión correctamente', async () => {
    const user = userEvent.setup();
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com',
      level: 1,
      points: 100,
      avatar: '👤'
    };

    localStorage.setItem('authToken', 'mock-token');
    localStorage.setItem('userData', JSON.stringify(mockUser));

    renderWithProviders(<NavBar />);
    const userMenuButton = screen.getByTestId('user-menu');
    expect(userMenuButton).toBeInTheDocument();
    
    await user.click(userMenuButton);
    
    // Esperar a que el menú esté abierto y buscar el botón de cerrar sesión
    const logoutButton = screen.getByTestId('logout-button');
    expect(logoutButton).toBeInTheDocument();
    
    await user.click(logoutButton);

    // Verificar que se haya cerrado sesión
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('userData')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('muestra la insignia de estudiante cuando corresponde', () => {
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com',
      level: 1,
      points: 100,
      avatar: '👤',
      isStudent: true
    };

    localStorage.setItem('authToken', 'mock-token');
    localStorage.setItem('userData', JSON.stringify(mockUser));

    renderWithProviders(<NavBar />);
    expect(screen.getByText('20%')).toBeInTheDocument();
  });
});