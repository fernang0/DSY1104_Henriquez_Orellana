import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validationRules, authMessages } from '../../data/authData';
import styles from './Auth.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
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
    if (isAuthenticated()) {
      navigate('/', { replace: true });
    }
  }, [navigate, isAuthenticated]);

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
      await login(formData.email, formData.password);
      
      setMessage({ 
        type: 'success', 
        text: authMessages.login.success
      });

      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Error al iniciar sesión. Verifica tus credenciales.' 
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


      </div>
    </div>
  );
};

export default Login;