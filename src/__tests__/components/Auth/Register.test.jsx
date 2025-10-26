import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import Register from '../../../components/Auth/Register';
import { BrowserRouter } from 'react-router-dom';
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
const renderRegister = () => {
  return render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );
};

describe('Register', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    mockNavigate.mockClear();
    vi.clearAllMocks();
  });

  // Pruebas de renderizado
  describe('renderizado', () => {
    it('debe renderizar el formulario de registro', () => {
      renderRegister();
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/fecha de nacimiento/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Tu contraseña')).toBeInTheDocument();
      expect(screen.getByLabelText(/código de referido/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument();
    });

    it('debe redirigir si ya está logueado', () => {
      mockLocalStorage.getItem.mockReturnValueOnce('some-token');
      renderRegister();
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  // Pruebas de validación
  describe('validación', () => {
    it('debe mostrar error con nombre muy corto', async () => {
      renderRegister();
      const nameInput = screen.getByLabelText(/nombre/i);

      await act(async () => {
        fireEvent.change(nameInput, { target: { value: 'a' } });
        fireEvent.blur(nameInput);
      });

      expect(screen.getByText(/mínimo/i)).toBeInTheDocument();
    });

    it('debe mostrar error con email inválido', async () => {
      renderRegister();
      const emailInput = screen.getByLabelText(/correo electrónico/i);

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        fireEvent.blur(emailInput);
      });

      expect(screen.getByText(/ingresa un email válido/i)).toBeInTheDocument();
    });

    it('debe mostrar error con contraseña muy corta', async () => {
      renderRegister();
      const passwordInput = screen.getByPlaceholderText('Tu contraseña');

      await act(async () => {
        fireEvent.change(passwordInput, { target: { value: '123' } });
        fireEvent.blur(passwordInput);
      });

      expect(screen.getByText(/la contraseña es demasiado corta/i)).toBeInTheDocument();
    });
  });

  // Pruebas de registro
  describe('proceso de registro', () => {
    const validFormData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@gmail.com',
      birthDate: '2000-01-01',
      phone: '+56912345678',
      password: 'password123',
      referralCode: '',
      terms: true,
      newsletter: false
    };
    
    it('debe mostrar mensaje de éxito y redirigir al login', async () => {
      vi.useFakeTimers();
      renderRegister();

      const firstNameInput = screen.getByLabelText(/nombre/i);
      const lastNameInput = screen.getByLabelText(/apellido/i);
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const birthDateInput = screen.getByLabelText(/fecha de nacimiento/i);
      const phoneInput = screen.getByLabelText(/teléfono/i);
      const passwordInput = screen.getByPlaceholderText('Tu contraseña');
      const termsCheckbox = screen.getByRole('checkbox', { name: /términos y condiciones/i });
      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });

      await act(async () => {
        fireEvent.change(firstNameInput, { target: { value: 'Test' } });
        fireEvent.change(lastNameInput, { target: { value: 'User' } });
        fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
        fireEvent.change(birthDateInput, { target: { value: '2000-01-01' } });
        fireEvent.change(phoneInput, { target: { value: '+56912345678' } });
        fireEvent.change(passwordInput, { target: { value: 'pass123' } });
        fireEvent.click(termsCheckbox);
        fireEvent.click(submitButton);
      });

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      expect(screen.getByText(/test user/i)).toBeInTheDocument();
      expect(screen.getByText(/registro exitoso/i)).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
      vi.useRealTimers();
    });

    it('debe mostrar error si el email ya está registrado', async () => {
      vi.useFakeTimers();
      renderRegister();

      const firstNameInput = screen.getByLabelText(/nombre/i);
      const lastNameInput = screen.getByLabelText(/apellido/i);
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const birthDateInput = screen.getByLabelText(/fecha de nacimiento/i);
      const phoneInput = screen.getByLabelText(/teléfono/i);
      const passwordInput = screen.getByPlaceholderText('Tu contraseña');
      const termsCheckbox = screen.getByRole('checkbox', { name: /términos y condiciones/i });
      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });

      await act(async () => {
        fireEvent.change(firstNameInput, { target: { value: 'Test' } });
        fireEvent.change(lastNameInput, { target: { value: 'User' } });
        fireEvent.change(emailInput, { target: { value: 'admin@duoc.cl' } }); // Email existente
        fireEvent.change(birthDateInput, { target: { value: '2000-01-01' } });
        fireEvent.change(phoneInput, { target: { value: '+56912345678' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(termsCheckbox);
        fireEvent.click(submitButton);
      });

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      expect(screen.getByText(/por favor corrige los errores/i)).toBeInTheDocument();
      vi.useRealTimers();
    });
  });

  // Pruebas de interacción UI
  describe('interacción UI', () => {
    it('debe verificar email de Duoc', async () => {
      renderRegister();
      const emailInput = screen.getByLabelText(/correo electrónico/i);

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: 'test@duoc.cl' } });
        fireEvent.blur(emailInput);
      });

      expect(screen.getByText(/¡email válido - tendrás 20% de descuento!/i)).toBeInTheDocument();
    });

    it('debe verificar código de referido', async () => {
      renderRegister();
      const referralInput = screen.getByLabelText(/código de referido/i);

      await act(async () => {
        fireEvent.change(referralInput, { target: { value: 'DUOC2025' } });
        fireEvent.blur(referralInput);
      });

      expect(screen.getByText(/código válido/i)).toBeInTheDocument();
    });
  });
});