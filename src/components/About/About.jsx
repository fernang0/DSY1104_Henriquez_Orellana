import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  companyInfo, 
  companyHistory, 
  companyMission, 
  companyVision,
  companyValues, 
  companyStats, 
  teamMembers, 
  achievements, 
  partners,
  aboutConfig 
} from '../../data/aboutData';
import styles from './About.module.css';

/**
 * Componente About para React
 * Sección "Nosotros" con información de la empresa LevelUp Gaming
 * Integrado con Bootstrap y tema gaming
 */
const About = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState({});

  // Effect para animaciones de scroll
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    }, observerOptions);

    // Observar todas las secciones
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Formatear números para estadísticas
  const formatNumber = (num) => {
    if (typeof num === 'string') return num;
    return num.toLocaleString();
  };

  return (
    <div className={styles.aboutContainer}>
      {/* Hero Section */}
      <section 
        className={styles.heroSection}
        id="hero"
        data-section="hero"
      >
        <Container>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              {aboutConfig.pageTitle}
            </h1>
            <p className={styles.heroSubtitle}>
              {aboutConfig.pageDescription}
            </p>
            
            {/* Stats destacadas */}
            <div className={styles.heroStats}>
              {companyStats.slice(0, 3).map(stat => (
                <div key={stat.id} className={styles.heroStat}>
                  <span className={styles.heroStatNumber}>
                    {stat.icon} {stat.number}
                  </span>
                  <span className={styles.heroStatLabel}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Historia Section */}
      <section 
        className={styles.section}
        id="history"
        data-section="history"
      >
        <Container>
          <h2 className={styles.sectionTitle}>
            {companyHistory.title}
          </h2>
          
          <div className={styles.historyContent}>
            <div className={styles.historyText}>
              <p>{companyHistory.content}</p>
            </div>
            
            {/* Timeline */}
            <div className={styles.timeline}>
              {companyHistory.timeline.map((item, index) => (
                <div key={index} className={styles.timelineItem}>
                  <div className={styles.timelineDate}>
                    {item.month} {item.year}
                  </div>
                  <h3 className={styles.timelineTitle}>
                    <span className={styles.timelineIcon}>{item.icon}</span>
                    {item.title}
                  </h3>
                  <p className={styles.timelineDescription}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Misión y Visión */}
      <section 
        className={styles.section}
        id="mission-vision"
        data-section="mission-vision"
      >
        <Container>
          <Row>
            <Col lg={6} className="mb-4">
              <div className={styles.missionCard}>
                <h2 className={styles.cardTitle}>
                  {companyMission.title}
                </h2>
                <p className={styles.cardContent}>
                  {companyMission.content}
                </p>
                <ul className={styles.objectivesList}>
                  {companyMission.objectives.map((objective, index) => (
                    <li key={index}>✓ {objective}</li>
                  ))}
                </ul>
              </div>
            </Col>
            
            <Col lg={6} className="mb-4">
              <div className={styles.visionCard}>
                <h2 className={styles.cardTitle}>
                  {companyVision.title}
                </h2>
                <p className={styles.cardContent}>
                  {companyVision.content}
                </p>
                <ul className={styles.goalsList}>
                  {companyVision.goals.map((goal, index) => (
                    <li key={index}>🎯 {goal}</li>
                  ))}
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Valores */}
      <section 
        className={styles.section}
        id="values"
        data-section="values"
      >
        <Container>
          <h2 className={styles.sectionTitle}>
            ⭐ Nuestros Valores
          </h2>
          
          <div className={styles.valuesGrid}>
            {companyValues.map(value => (
              <div key={value.id} className={styles.valueCard}>
                <span className={styles.valueIcon}>
                  {value.icon}
                </span>
                <h3 className={styles.valueTitle}>
                  {value.title}
                </h3>
                <p className={styles.valueDescription}>
                  {value.description}
                </p>
                <p className={styles.valueDetails}>
                  {value.details}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Estadísticas */}
      <section 
        className={styles.section}
        id="stats"
        data-section="stats"
      >
        <Container>
          <h2 className={styles.sectionTitle}>
            📊 LevelUp en Números
          </h2>
          
          <div className={styles.statsGrid}>
            {companyStats.map(stat => (
              <div key={stat.id} className={styles.statCard}>
                <span className={styles.statIcon}>
                  {stat.icon}
                </span>
                <span className={styles.statNumber}>
                  {stat.number}
                </span>
                <div className={styles.statLabel}>
                  {stat.label}
                </div>
                <div className={styles.statDescription}>
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Equipo */}
      <section 
        className={styles.section}
        id="team"
        data-section="team"
      >
        <Container>
          <h2 className={styles.sectionTitle}>
            👥 Nuestro Equipo
          </h2>
          
          <div className={styles.teamGrid}>
            {teamMembers.map(member => (
              <div key={member.id} className={styles.teamCard}>
                <img
                  src={member.avatar}
                  alt={member.name}
                  className={styles.teamAvatar}
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/120x120/252b3d/00d4ff?text=${member.name.split(' ').map(n => n[0]).join('')}`;
                  }}
                />
                <h3 className={styles.teamName}>
                  {member.name}
                </h3>
                <div className={styles.teamPosition}>
                  {member.position}
                </div>
                <div className={styles.teamSpecialty}>
                  {member.specialty}
                </div>
                <p className={styles.teamDescription}>
                  {member.description}
                </p>
                <div className={styles.teamSocial}>
                  {Object.entries(member.social).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      className={styles.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Ver ${platform} de ${member.name}`}
                    >
                      {getSocialIcon(platform)}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Logros */}
      <section 
        className={styles.section}
        id="achievements"
        data-section="achievements"
      >
        <Container>
          <h2 className={styles.sectionTitle}>
            🏆 Nuestros Logros
          </h2>
          
          <div className={styles.achievementsGrid}>
            {achievements.map(achievement => (
              <div key={achievement.id} className={styles.achievementCard}>
                <span className={styles.achievementIcon}>
                  {achievement.icon}
                </span>
                <h3 className={styles.achievementTitle}>
                  {achievement.title}
                </h3>
                <div className={styles.achievementOrg}>
                  {achievement.organization} • {achievement.date}
                </div>
                <p className={styles.achievementDescription}>
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Partners */}
      <section 
        className={styles.section}
        id="partners"
        data-section="partners"
      >
        <Container>
          <h2 className={styles.sectionTitle}>
            🤝 Nuestros Partners
          </h2>
          
          <div className={styles.partnersGrid}>
            {partners.map(partner => (
              <div key={partner.id} className={styles.partnerCard}>
                <span className={styles.partnerLogo}>
                  {partner.logo}
                </span>
                <h3 className={styles.partnerName}>
                  {partner.name}
                </h3>
                <div className={styles.partnerCategory}>
                  {partner.category}
                </div>
                <p className={styles.partnerDescription}>
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
};

/**
 * Helper function para iconos de redes sociales
 */
const getSocialIcon = (platform) => {
  const icons = {
    linkedin: '💼',
    twitter: '🐦',
    github: '💻',
    twitch: '🎮',
    instagram: '📸',
    discord: '💬'
  };
  
  return icons[platform] || '🔗';
};

export default About;