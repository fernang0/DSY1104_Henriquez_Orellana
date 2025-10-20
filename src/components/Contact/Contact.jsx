import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  contactInfo,
  companyContact,
  socialNetworks,
  contactFormOptions,
  formConfig,
  additionalInfo,
  contactConfig 
} from '../../data/contactData';
import styles from './Contact.module.css';

/**
 * Componente Contact para React
 * Sección "Contacto" con información, formulario y redes sociales
 * Integrado with Bootstrap y tema gaming
 */
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Validación en tiempo real
  const validateField = (name, value) => {
    const validation = formConfig.validation[name];
    const messages = formConfig.messages.validation;
    
    if (!validation) return '';
    
    if (validation.required && !value.trim()) {
      return messages[`${name}Required`] || 'Este campo es requerido';
    }
    
    if (validation.minLength && value.length < validation.minLength) {
      return messages[`${name}MinLength`] || `Mínimo ${validation.minLength} caracteres`;
    }
    
    if (validation.maxLength && value.length > validation.maxLength) {
      return `Máximo ${validation.maxLength} caracteres`;
    }
    
    if (validation.pattern && !validation.pattern.test(value)) {
      return messages[`${name}Pattern`] || 'Formato inválido';
    }
    
    return '';
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validación en tiempo real
    if (formErrors[name]) {
      const error = validateField(name, value);
      setFormErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  // Validar todo el formulario
  const validateForm = () => {
    const errors = {};
    
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Simular envío del formulario
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aquí iría la lógica real de envío
      console.log('Formulario enviado:', formData);
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => setSubmitStatus(null), 5000);
      
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.contactContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <Container>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              {contactInfo.title}
            </h1>
            <p className={styles.heroSubtitle}>
              {contactInfo.description}
            </p>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className={styles.mainContent}>
        <Container>
          <div className={styles.contentGrid}>
            {/* Contact Information */}
            <div className={styles.contactInfoSection}>
              <h2 className={styles.sectionTitle}>
                📞 Información de Contacto
              </h2>

              {/* Dirección */}
              <div className={styles.contactCard}>
                <div className={styles.contactCardHeader}>
                  <span className={styles.contactIcon}>
                    {companyContact.address.icon}
                  </span>
                  <h3 className={styles.contactCardTitle}>
                    {companyContact.address.title}
                  </h3>
                </div>
                <div className={styles.contactValue}>
                  {companyContact.address.value}
                </div>
                <div className={styles.contactDetails}>
                  {companyContact.address.details}
                </div>
              </div>

              {/* Teléfono */}
              <div className={styles.contactCard}>
                <div className={styles.contactCardHeader}>
                  <span className={styles.contactIcon}>
                    {companyContact.phone.icon}
                  </span>
                  <h3 className={styles.contactCardTitle}>
                    {companyContact.phone.title}
                  </h3>
                </div>
                <div className={styles.contactValue}>
                  {companyContact.phone.value}
                </div>
                <div className={styles.contactDetails}>
                  WhatsApp: {companyContact.phone.whatsapp}
                </div>
              </div>

              {/* Email */}
              <div className={styles.contactCard}>
                <div className={styles.contactCardHeader}>
                  <span className={styles.contactIcon}>
                    {companyContact.email.icon}
                  </span>
                  <h3 className={styles.contactCardTitle}>
                    {companyContact.email.title}
                  </h3>
                </div>
                <div className={styles.contactValue}>
                  {companyContact.email.primary}
                </div>
                <div className={styles.contactDetails}>
                  Soporte: {companyContact.email.support}<br/>
                  Ventas: {companyContact.email.sales}
                </div>
              </div>

              {/* Horarios */}
              <div className={styles.contactCard}>
                <div className={styles.contactCardHeader}>
                  <span className={styles.contactIcon}>
                    {companyContact.schedule.icon}
                  </span>
                  <h3 className={styles.contactCardTitle}>
                    {companyContact.schedule.title}
                  </h3>
                </div>
                
                <div className={styles.scheduleItem}>
                  <div>
                    <div className={styles.scheduleDays}>
                      {companyContact.schedule.weekdays.days}
                    </div>
                    <div className={styles.scheduleDescription}>
                      {companyContact.schedule.weekdays.description}
                    </div>
                  </div>
                  <div className={styles.scheduleHours}>
                    {companyContact.schedule.weekdays.hours}
                  </div>
                </div>
                
                <div className={styles.scheduleItem}>
                  <div>
                    <div className={styles.scheduleDays}>
                      {companyContact.schedule.saturday.days}
                    </div>
                    <div className={styles.scheduleDescription}>
                      {companyContact.schedule.saturday.description}
                    </div>
                  </div>
                  <div className={styles.scheduleHours}>
                    {companyContact.schedule.saturday.hours}
                  </div>
                </div>
                
                <div className={styles.scheduleItem}>
                  <div>
                    <div className={styles.scheduleDays}>
                      {companyContact.schedule.sunday.days}
                    </div>
                    <div className={styles.scheduleDescription}>
                      {companyContact.schedule.sunday.description}
                    </div>
                  </div>
                  <div className={styles.scheduleHours}>
                    {companyContact.schedule.sunday.hours}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className={styles.contactFormSection}>
              <div className={styles.formContent}>
                <h2 className={styles.sectionTitle}>
                  💬 Envíanos un mensaje
                </h2>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className={styles.successMessage}>
                    ✅ {formConfig.messages.success}
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className={styles.errorMessage}>
                    ❌ {formConfig.messages.error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className={styles.contactForm}>
                  {/* Nombre */}
                  <div className={`${styles.formGroup} ${formErrors.name ? styles.error : ''}`}>
                    <label htmlFor="name" className={styles.formLabel}>
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="Ingresa tu nombre completo"
                      disabled={isSubmitting}
                    />
                    {formErrors.name && (
                      <div className={styles.errorMessage}>
                        ⚠️ {formErrors.name}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className={`${styles.formGroup} ${formErrors.email ? styles.error : ''}`}>
                    <label htmlFor="email" className={styles.formLabel}>
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="tu@email.com"
                      disabled={isSubmitting}
                    />
                    {formErrors.email && (
                      <div className={styles.errorMessage}>
                        ⚠️ {formErrors.email}
                      </div>
                    )}
                  </div>

                  {/* Asunto */}
                  <div className={`${styles.formGroup} ${formErrors.subject ? styles.error : ''}`}>
                    <label htmlFor="subject" className={styles.formLabel}>
                      Asunto
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={styles.formSelect}
                      disabled={isSubmitting}
                    >
                      {contactFormOptions.subjects.map(option => (
                        <option 
                          key={option.value} 
                          value={option.value}
                          disabled={option.disabled}
                        >
                          {option.icon ? `${option.icon} ` : ''}{option.label}
                        </option>
                      ))}
                    </select>
                    {formErrors.subject && (
                      <div className={styles.errorMessage}>
                        ⚠️ {formErrors.subject}
                      </div>
                    )}
                  </div>

                  {/* Mensaje */}
                  <div className={`${styles.formGroup} ${formErrors.message ? styles.error : ''}`}>
                    <label htmlFor="message" className={styles.formLabel}>
                      Mensaje
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className={styles.formTextarea}
                      placeholder="Escribe tu mensaje aquí..."
                      disabled={isSubmitting}
                      rows={5}
                    />
                    {formErrors.message && (
                      <div className={styles.errorMessage}>
                        ⚠️ {formErrors.message}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className={`${styles.submitButton} ${isSubmitting ? styles.loading : ''}`}
                    disabled={isSubmitting}
                  >
                    <div className={styles.buttonContent}>
                      {isSubmitting ? (
                        <>
                          <div className={styles.loadingSpinner}></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          🚀 Enviar Mensaje
                        </>
                      )}
                    </div>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Social Networks */}
      <section className={styles.socialSection}>
        <Container>
          <h2 className={styles.sectionTitle}>
            🌐 Síguenos en Redes Sociales
          </h2>
          
          <div className={styles.socialGrid}>
            {socialNetworks.map(social => (
              <div 
                key={social.id} 
                className={styles.socialCard}
                data-social={social.name.toLowerCase()}
              >
                <span className={styles.socialIcon}>
                  {social.icon}
                </span>
                <h3 className={styles.socialName}>
                  {social.name}
                </h3>
                <div className={styles.socialUsername}>
                  {social.username}
                </div>
                <p className={styles.socialDescription}>
                  {social.description}
                </p>
                <div className={styles.socialStats}>
                  {social.followers && `${social.followers} seguidores`}
                  {social.members && `${social.members} miembros`}
                  {social.subscribers && `${social.subscribers} suscriptores`}
                </div>
                <a 
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  Seguir →
                </a>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Additional Information */}
      <section className={styles.additionalSection}>
        <Container>
          <h2 className={styles.sectionTitle}>
            ℹ️ Información Adicional
          </h2>
          
          <div className={styles.additionalGrid}>
            {additionalInfo.map(info => (
              <div key={info.id} className={styles.additionalCard}>
                <h3 className={styles.additionalTitle}>
                  {info.title}
                </h3>
                <div className={styles.additionalDescription}>
                  {info.description}
                </div>
                <div className={styles.additionalDetails}>
                  {info.details}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Contact;