import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import Login from '../../../components/Auth/Login';
import { BrowserRouter } from 'react-router-dom';
import { demoAccounts } from '../../../data/authData';
import '@testing-library/jest-dom';

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock de localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Helper para renderizar el componente
const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe('Login', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    mockNavigate.mockClear();
    vi.clearAllMocks();
  });

  // Pruebas de renderizado
  describe('renderizado', () => {
    it('debe renderizar el formulario de login', () => {
      renderLogin();
      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Tu contraseña')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });

    it('debe mostrar las cuentas demo', () => {
      renderLogin();
      demoAccounts.forEach(account => {
        expect(screen.getByText(new RegExp(`${account.role}\\s+Demo`, 'i'))).toBeInTheDocument();
      });
    });

    it('debe redirigir si ya está logueado', () => {
      mockLocalStorage.getItem.mockReturnValueOnce('some-token');
      renderLogin();
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  // Pruebas de validación
  describe('validación', () => {
    it('debe mostrar error con email inválido', async () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/correo electrónico/i);

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        fireEvent.blur(emailInput);
      });

      expect(screen.getByText(/ingresa un email válido/i)).toBeInTheDocument();
    });

    it('debe mostrar error con contraseña muy corta', async () => {
      renderLogin();
      const passwordInput = screen.getByPlaceholderText('Tu contraseña');

      await act(async () => {
        fireEvent.change(passwordInput, { target: { value: '123' } });
        fireEvent.blur(passwordInput);
      });

      expect(screen.getByText(/contraseña debe tener al menos/i)).toBeInTheDocument();
    });
  });

  // Pruebas de login
  describe('proceso de login', () => {
    it('debe login exitoso con credenciales correctas', async () => {
      vi.useFakeTimers();
      renderLogin();
      
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByPlaceholderText('Tu contraseña');
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: demoAccounts[0].email } });
        fireEvent.change(passwordInput, { target: { value: demoAccounts[0].password } });
        fireEvent.click(submitButton);
      });

      expect(screen.getByText(/iniciando sesión/i)).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(1500);
      });

      expect(screen.getByText(/bienvenido/i)).toBeInTheDocument();
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('userData', expect.any(String));
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('authToken', expect.any(String));

      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
      vi.useRealTimers();
    });

    it('debe mostrar error con credenciales incorrectas', async () => {
      vi.useFakeTimers();
      renderLogin();
      
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByPlaceholderText('Tu contraseña');
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: 'wrong@email.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
        fireEvent.click(submitButton);
      });

      await act(async () => {
        vi.advanceTimersByTime(1500);
      });

      expect(screen.getByText(/email o contraseña incorrectos/i)).toBeInTheDocument();
      vi.useRealTimers();
    });
  });

  // Pruebas de login con cuentas demo
  describe('login con cuentas demo', () => {
    it('debe auto-completar credenciales al seleccionar cuenta demo', async () => {
      renderLogin();
      const demoButton = screen.getByText(`${demoAccounts[0].role} Demo`).closest('button');

      await act(async () => {
        fireEvent.click(demoButton);
      });

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByPlaceholderText('Tu contraseña');

      expect(emailInput.value).toBe(demoAccounts[0].email);
      expect(passwordInput.value).toBe(demoAccounts[0].password);
    });
  });

  // Pruebas de interacción UI
  describe('interacción UI', () => {
    it('debe toggle de visibilidad de contraseña', async () => {
      renderLogin();
      const passwordInput = screen.getByPlaceholderText('Tu contraseña');
      const toggleButton = screen.getByRole('button', { name: /mostrar contraseña/i });

      expect(passwordInput.type).toBe('password');

      await act(async () => {
        fireEvent.click(toggleButton);
      });

      expect(passwordInput.type).toBe('text');

      await act(async () => {
        fireEvent.click(toggleButton);
      });

      expect(passwordInput.type).toBe('password');
    });

    it('debe recordar sesión si se marca la casilla', async () => {
      vi.useFakeTimers();
      renderLogin();

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByPlaceholderText('Tu contraseña');
      const rememberCheckbox = screen.getByLabelText(/recordar sesión/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: demoAccounts[0].email } });
        fireEvent.change(passwordInput, { target: { value: demoAccounts[0].password } });
        fireEvent.click(rememberCheckbox);
        fireEvent.click(submitButton);
      });

      await act(async () => {
        vi.advanceTimersByTime(1500);
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('rememberMe', 'true');
      vi.useRealTimers();
    });
  });
});