import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authConfig, demoAccounts, validationRules, authMessages } from '../../data/authData';
import styles from './Auth.module.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Verificar si ya está logueado
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Validación de campo
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'email':
        if (!value) {
          error = 'El email es obligatorio';
        } else if (!validationRules.email.pattern.test(value)) {
          error = validationRules.email.message;
        }
        break;
      case 'password':
        if (!value) {
          error = 'La contraseña es obligatoria';
        } else if (value.length < validationRules.password.minLength) {
          error = `La contraseña debe tener al menos ${validationRules.password.minLength} caracteres`;
        }
        break;
    }

    return error;
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    // Validar en tiempo real
    if (name !== 'remember') {
      const error = validateField(name, fieldValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }

    // Limpiar mensajes
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  // Auto-completar con cuenta demo
  const handleDemoLogin = (account) => {
    setFormData({
      email: account.email,
      password: account.password,
      remember: false
    });
    setErrors({});
    setMessage({ type: '', text: '' });
  };

  // Simular login
  const performLogin = async (email, password) => {
    // Buscar en cuentas demo
    const account = demoAccounts.find(
      acc => acc.email === email && acc.password === password
    );

    if (account) {
      const userData = {
        id: account.id,
        email: account.email,
        name: account.name,
        role: account.role,
        avatar: account.avatar,
        level: account.level,
        points: account.points,
        isStudent: account.isStudent,
        discount: account.discount,
        permissions: account.permissions,
        loginTime: new Date().toISOString()
      };

      // Guardar en localStorage
      const token = `token_${account.id}_${Date.now()}`;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      if (formData.remember) {
        localStorage.setItem('rememberMe', 'true');
      }

      return { success: true, user: userData };
    }

    return { success: false, message: authMessages.login.invalidCredentials };
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    newErrors.email = validateField('email', formData.email);
    newErrors.password = validateField('password', formData.password);

    // Filtrar errores vacíos
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    return newErrors;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1500));

      const result = await performLogin(formData.email, formData.password);

      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: `¡Bienvenido ${result.user.name}! ${authMessages.login.success}` 
        });

        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      } else {
        setMessage({ 
          type: 'error', 
          text: result.message 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Error del servidor. Intenta nuevamente.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle mostrar contraseña
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.authContainer}>
      <div className={`${styles.authCard}`}>
        <h1 className={styles.authTitle}>🎮 Inicia Sesión</h1>
        <p className={styles.authSubtitle}>
          Accede a tu cuenta y continúa tu aventura gaming
        </p>

        {/* Mensajes */}
        {message.text && (
          <div className={message.type === 'error' ? styles.messageError : styles.messageSuccess}>
            <span>{message.type === 'error' ? '❌' : '✅'}</span>
            {message.text}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className={styles.authForm} noValidate>
          {/* Email */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.formInput} ${errors.email ? styles.error : ''}`}
              placeholder="tu@email.com"
              autoComplete="email"
              required
            />
            {errors.email && (
              <small className={`${styles.formHelp} ${styles.error}`}>
                {errors.email}
              </small>
            )}
            {!errors.email && formData.email && (
              <small className={styles.formHelp}>
                Ingresa tu email registrado
              </small>
            )}
          </div>

          {/* Password */}
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Contraseña
            </label>
            <div className={styles.passwordField}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`${styles.formInput} ${errors.password ? styles.error : ''}`}
                placeholder="Tu contraseña"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={togglePassword}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && (
              <small className={`${styles.formHelp} ${styles.error}`}>
                {errors.password}
              </small>
            )}
            {!errors.password && (
              <small className={styles.formHelp}>
                Tu contraseña de 4-10 caracteres
              </small>
            )}
          </div>

          {/* Remember me */}
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className={styles.checkboxInput}
              />
              <span>Recordar sesión</span>
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
            disabled={isLoading}
          >
            <div className={styles.buttonContent}>
              {isLoading && <div className={styles.loadingSpinner}></div>}
              {isLoading ? 'Iniciando sesión...' : '🎮 Iniciar sesión'}
            </div>
          </button>
        </form>

        {/* Footer */}
        <div className={styles.authFooter}>
          <p>¿No tienes cuenta? <Link to="/registro">Registrarse</Link></p>
          <p>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (!formData.email) {
                  alert('Por favor ingresa tu email primero');
                  return;
                }
                setMessage({
                  type: 'info',
                  text: `📧 Se ha enviado un link de recuperación a ${formData.email}`
                });
              }}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </p>
        </div>

        {/* Cuentas demo */}
        <div className={styles.demoSection}>
          <h3 className={styles.demoTitle}>Cuentas de prueba</h3>
          <p className={styles.demoInfo}>Para probar el sistema puedes usar:</p>
          <div className={styles.demoAccounts}>
            {demoAccounts.map((account) => (
              <button
                key={account.id}
                type="button"
                className={styles.demoButton}
                onClick={() => handleDemoLogin(account)}
                disabled={isLoading}
              >
                <span>{account.avatar}</span>
                <div>
                  <strong>{account.role} Demo</strong>
                  <br />
                  <small>{account.email}</small>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;