import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  validationRules, 
  authMessages, 
  registerFormFields
} from '../../data/authData';
import styles from './Auth.module.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    phone: '',
    password: '',
    referralCode: '',
    terms: false,
    newsletter: false
  });
  const [errors, setErrors] = useState({});
  const [validationStatus, setValidationStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [referralFeedback, setReferralFeedback] = useState('');

  // Verificar si ya está logueado
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/', { replace: true });
    }
  }, [navigate, isAuthenticated]);

  // Validación de campo individual
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value) {
          error = `El ${name === 'firstName' ? 'nombre' : 'apellido'} es obligatorio`;
        } else if (value.length < validationRules.name.minLength) {
          error = `Mínimo ${validationRules.name.minLength} caracteres`;
        } else if (value.length > validationRules.name.maxLength) {
          error = `Máximo ${validationRules.name.maxLength} caracteres`;
        } else if (!validationRules.name.pattern.test(value)) {
          error = validationRules.name.message;
        }
        break;

      case 'email':
        if (!value) {
          error = 'El email es obligatorio';
        } else if (!validationRules.email.pattern.test(value)) {
          error = validationRules.email.message;
        } else if (!validationRules.email.checkDomain(value)) {
          error = authMessages.validation.emailDomainNotAllowed;
        }
        break;

      case 'birthDate':
        if (!value) {
          error = 'La fecha de nacimiento es obligatoria';
        } else if (!validationRules.birthDate.checkAge(value)) {
          error = authMessages.validation.ageInvalid;
        }
        break;

      case 'phone':
        if (value && !validationRules.phone.pattern.test(value)) {
          error = validationRules.phone.message;
        }
        break;

      case 'password':
        if (!value) {
          error = 'La contraseña es obligatoria';
        } else if (value.length < validationRules.password.minLength) {
          error = authMessages.validation.passwordTooShort;
        } else if (value.length > validationRules.password.maxLength) {
          error = authMessages.validation.passwordTooLong;
        }
        break;

      case 'referralCode':
        if (value && !validationRules.referralCode.validate(value)) {
          error = authMessages.validation.referralInvalid;
        }
        break;

      case 'terms':
        if (!value) {
          error = authMessages.register.termsRequired;
        }
        break;
    }

    return error;
  };

  // Calcular edad
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    let actualAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      actualAge--;
    }
    
    return actualAge;
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
    if (name !== 'newsletter') {
      const error = validateField(name, fieldValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));

      // Estado de validación
      setValidationStatus(prev => ({
        ...prev,
        [name]: error ? 'error' : (fieldValue ? 'success' : '')
      }));
    }

    // Validaciones especiales
    if (name === 'birthDate' && fieldValue) {
      const age = calculateAge(fieldValue);
      if (age >= 18) {
        setValidationStatus(prev => ({
          ...prev,
          birthDate: 'success'
        }));
      }
    }

    if (name === 'email' && fieldValue) {
      const domain = fieldValue.split('@')[1];
      if (domain && (domain.includes('duoc.cl'))) {
        // Mostrar beneficio para estudiantes Duoc
        setValidationStatus(prev => ({
          ...prev,
          email: 'success'
        }));
      }
    }

    if (name === 'referralCode') {
      if (fieldValue.length === 0) {
        setReferralFeedback('');
      } else if (validationRules.referralCode.validate(fieldValue)) {
        setReferralFeedback('✓ Código válido (+100 puntos)');
      } else {
        setReferralFeedback('✗ Código inválido');
      }
    }

    // Limpiar mensajes
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };



  // Validar formulario completo
  const validateForm = () => {
    const newErrors = {};
    
    Object.keys(formData).forEach(key => {
      if (key !== 'newsletter') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    return newErrors;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setMessage({
        type: 'error',
        text: 'Por favor corrige los errores en el formulario'
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const registerData = {
        nombre: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        telefono: formData.phone || null,
        fechaNacimiento: formData.birthDate || null
      };

      await register(registerData);
      
      setMessage({ 
        type: 'success', 
        text: '¡Registro exitoso! Redirigiendo al login...' 
      });

      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Error al registrar. Intenta nuevamente.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={`${styles.authCard} ${styles.authCardWide}`}>
        <h1 className={styles.authTitle}>🚀 Únete a LevelUp</h1>
        <p className={styles.authSubtitle}>
          Crea tu cuenta y comienza a ganar puntos en el mundo gaming
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
          {/* Nombres */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName" className={styles.formLabel}>
                Nombre *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`${styles.formInput} ${
                  validationStatus.firstName === 'error' ? styles.error : 
                  validationStatus.firstName === 'success' ? styles.success : ''
                }`}
                placeholder="Tu nombre"
                maxLength="50"
                required
              />
              {errors.firstName && (
                <small className={`${styles.formHelp} ${styles.error}`}>
                  {errors.firstName}
                </small>
              )}
              {!errors.firstName && (
                <small className={styles.formHelp}>Máximo 50 caracteres</small>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName" className={styles.formLabel}>
                Apellido *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`${styles.formInput} ${
                  validationStatus.lastName === 'error' ? styles.error : 
                  validationStatus.lastName === 'success' ? styles.success : ''
                }`}
                placeholder="Tu apellido"
                maxLength="50"
                required
              />
              {errors.lastName && (
                <small className={`${styles.formHelp} ${styles.error}`}>
                  {errors.lastName}
                </small>
              )}
              {!errors.lastName && (
                <small className={styles.formHelp}>Máximo 50 caracteres</small>
              )}
            </div>
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              Correo electrónico *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.formInput} ${
                validationStatus.email === 'error' ? styles.error : 
                validationStatus.email === 'success' ? styles.success : ''
              }`}
              placeholder="tu@email.com"
              maxLength="100"
              required
            />
            {errors.email && (
              <small className={`${styles.formHelp} ${styles.error}`}>
                {errors.email}
              </small>
            )}
            {!errors.email && formData.email.includes('duoc.cl') && (
              <small className={`${styles.formHelp} ${styles.success}`}>
                ¡Email válido - Tendrás 20% de descuento! ✓
              </small>
            )}
            {!errors.email && !formData.email.includes('duoc.cl') && (
              <small className={styles.formHelp}>
                Solo @duoc.cl, @profesor.duoc.cl o @gmail.com (máx. 100 caracteres)
              </small>
            )}
          </div>

          {/* Fecha de nacimiento */}
          <div className={styles.formGroup}>
            <label htmlFor="birthDate" className={styles.formLabel}>
              Fecha de nacimiento *
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className={`${styles.formInput} ${
                validationStatus.birthDate === 'error' ? styles.error : 
                validationStatus.birthDate === 'success' ? styles.success : ''
              }`}
              required
            />
            {errors.birthDate && (
              <small className={`${styles.formHelp} ${styles.error}`}>
                {errors.birthDate}
              </small>
            )}
            {!errors.birthDate && formData.birthDate && (
              <small className={`${styles.formHelp} ${styles.success}`}>
                Edad: {calculateAge(formData.birthDate)} años ✓
              </small>
            )}
            {!errors.birthDate && !formData.birthDate && (
              <small className={styles.formHelp}>Debes ser mayor de 18 años</small>
            )}
          </div>

          {/* Teléfono */}
          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.formLabel}>
              Teléfono
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`${styles.formInput} ${
                validationStatus.phone === 'error' ? styles.error : 
                validationStatus.phone === 'success' ? styles.success : ''
              }`}
              placeholder="+56 9 1234 5678"
              minLength="8"
              maxLength="15"
            />
            {errors.phone && (
              <small className={`${styles.formHelp} ${styles.error}`}>
                {errors.phone}
              </small>
            )}
            {!errors.phone && (
              <small className={styles.formHelp}>Opcional (8-15 caracteres)</small>
            )}
          </div>

          {/* Contraseña */}
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Contraseña *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`${styles.formInput} ${
                validationStatus.password === 'error' ? styles.error : 
                validationStatus.password === 'success' ? styles.success : ''
              }`}
              placeholder="Tu contraseña"
              minLength="4"
              maxLength="10"
              required
            />
            {errors.password && (
              <small className={`${styles.formHelp} ${styles.error}`}>
                {errors.password}
              </small>
            )}
            {!errors.password && (
              <small className={styles.formHelp}>Entre 4 y 10 caracteres</small>
            )}
          </div>

          {/* Código de referido */}
          <div className={styles.formGroup}>
            <label htmlFor="referralCode" className={styles.formLabel}>
              Código de referido
            </label>
            <input
              type="text"
              id="referralCode"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
              className={`${styles.formInput} ${
                validationStatus.referralCode === 'error' ? styles.error : 
                validationStatus.referralCode === 'success' ? styles.success : ''
              }`}
              placeholder="DUOC2025"
              maxLength="10"
            />
            {referralFeedback && (
              <small className={`${styles.formHelp} ${
                referralFeedback.includes('✓') ? styles.success : styles.error
              }`}>
                {referralFeedback}
              </small>
            )}
            {!referralFeedback && (
              <small className={styles.formHelp}>
                Opcional - Alfanumérico de 6-10 caracteres (+100 puntos)
              </small>
            )}
          </div>

          {/* Términos */}
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className={styles.checkboxInput}
                required
              />
              <span>
                Acepto los <a href="#" target="_blank">términos y condiciones</a> *
              </span>
            </label>
            {errors.terms && (
              <small className={`${styles.formHelp} ${styles.error}`}>
                {errors.terms}
              </small>
            )}
          </div>

          {/* Newsletter */}
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleChange}
                className={styles.checkboxInput}
              />
              <span>Quiero recibir ofertas y novedades por email</span>
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
              {isLoading ? 'Creando cuenta...' : '🚀 Crear cuenta'}
            </div>
          </button>
        </form>

        {/* Footer */}
        <div className={styles.authFooter}>
          <p>¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link></p>
        </div>

        {/* Beneficios */}
        <div className={styles.benefitsSection}>
          <h3 className={styles.benefitsTitle}>Beneficios de ser miembro</h3>
          <ul className={styles.benefitsList}>
            {authConfig.benefits.map((benefit, index) => (
              <li key={index} className={styles.benefitItem}>
                <span className={styles.benefitIcon}>{benefit.icon}</span>
                <div className={styles.benefitContent}>
                  <div className={styles.benefitTitle}>{benefit.title}</div>
                  <div className={styles.benefitDescription}>{benefit.description}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;