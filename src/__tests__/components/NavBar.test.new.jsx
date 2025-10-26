import { render, screen } from '@testing-library/react';
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
  const renderWithProviders = (component) => {
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
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
  });

  it('cierra sesión correctamente', () => {
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
    
    // Abrir el menú dropdown
    const userButton = screen.getByText(mockUser.name);
    userButton.click();
    
    // Click en cerrar sesión
    const logoutButton = screen.getByText(/Cerrar Sesión/i);
    logoutButton.click();

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