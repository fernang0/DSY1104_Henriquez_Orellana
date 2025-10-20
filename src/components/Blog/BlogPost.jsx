import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { blogPosts, blogCategories } from '../../data/blogData';
import styles from './BlogPost.module.css';

/**
 * Componente para mostrar un artículo individual del blog
 */
const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscar el post por slug
    const foundPost = blogPosts.find(p => p.slug === slug);
    
    if (foundPost) {
      setPost(foundPost);
      
      // Encontrar posts relacionados
      const related = blogPosts
        .filter(p => 
          p.id !== foundPost.id && 
          (p.category === foundPost.category || 
           p.tags.some(tag => foundPost.tags.includes(tag)))
        )
        .slice(0, 3);
      
      setRelatedPosts(related);
    }
    
    setLoading(false);
  }, [slug]);

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Simular contenido del artículo basado en la categoría
  const generateContent = (post) => {
    const contentMap = {
      'Guías': `
        <h2>🎯 Introducción</h2>
        <p>En esta guía completa, te mostraremos paso a paso cómo dominar ${post.title.toLowerCase()}. Desde los conceptos básicos hasta las técnicas más avanzadas, cubriremos todo lo que necesitas saber.</p>
        
        <h2>📋 Requisitos Previos</h2>
        <ul>
          <li>Conocimientos básicos de gaming</li>
          <li>Hardware compatible</li>
          <li>Tiempo dedicado para practicar</li>
        </ul>
        
        <h2>🚀 Paso a Paso</h2>
        <p>Comenzaremos con los fundamentos y progresaremos hacia técnicas más avanzadas. Cada sección incluye ejemplos prácticos y consejos de profesionales.</p>
        
        <h2>💡 Consejos Pro</h2>
        <p>Los jugadores experimentados recomiendan enfocarse en la práctica constante y la paciencia. El dominio viene con el tiempo y la dedicación.</p>
        
        <h2>🎖️ Conclusión</h2>
        <p>Con esta guía, tienes todas las herramientas necesarias para mejorar significativamente. ¡Recuerda que la práctica hace al maestro!</p>
      `,
      'Noticias': `
        <h2>📰 Lo Último en Gaming</h2>
        <p>La industria del gaming continúa evolucionando a un ritmo vertiginoso. En este artículo, analizamos los desarrollos más recientes y su impacto en la comunidad gamer.</p>
        
        <h2>🔍 Análisis Detallado</h2>
        <p>Los expertos de la industria señalan que estas tendencias marcarán el futuro del gaming en los próximos años. Es crucial entender estas dinámicas para mantenerse al día.</p>
        
        <h2>📊 Datos y Estadísticas</h2>
        <p>Los números hablan por sí solos: el crecimiento del sector gaming supera todas las expectativas, con millones de nuevos jugadores uniéndose cada mes.</p>
        
        <h2>🌟 Impacto en la Comunidad</h2>
        <p>La comunidad gamer ha recibido estas noticias con gran entusiasmo. Las redes sociales y foros especializados no paran de discutir las implicaciones.</p>
      `,
      'Reviews': `
        <h2>🎮 Primera Impresión</h2>
        <p>Después de horas de gameplay intensivo, podemos ofrecer una evaluación completa de esta experiencia gaming. Aquí están nuestras impresiones detalladas.</p>
        
        <h2>✅ Lo Bueno</h2>
        <ul>
          <li>Gráficos impresionantes y optimización excepcional</li>
          <li>Gameplay fluido y controles responsivos</li>
          <li>Historia envolvente y personajes bien desarrollados</li>
        </ul>
        
        <h2>❌ Lo Mejorable</h2>
        <ul>
          <li>Algunas mecánicas podrían ser más intuitivas</li>
          <li>Curva de dificultad ocasionalmente irregular</li>
        </ul>
        
        <h2>🏆 Veredicto Final</h2>
        <p>Una experiencia gaming sólida que vale la pena. Con algunos ajustes menores, podría ser perfecto para cualquier tipo de jugador.</p>
        
        <div class="rating-box">
          <h3>⭐ Calificación: 8.5/10</h3>
          <p>Recomendado para fans del género y gamers casuales por igual.</p>
        </div>
      `,
      'Tutorials': `
        <h2>🎓 Tutorial Completo</h2>
        <p>Este tutorial te guiará paso a paso a través del proceso completo. Diseñado tanto para principiantes como para usuarios intermedios.</p>
        
        <h2>🛠️ Herramientas Necesarias</h2>
        <p>Antes de comenzar, asegúrate de tener todo lo necesario. Una preparación adecuada garantiza mejores resultados.</p>
        
        <h2>📝 Instrucciones Detalladas</h2>
        <p>Sigue cada paso cuidadosamente. Hemos incluido capturas de pantalla y ejemplos para hacer el proceso lo más claro posible.</p>
        
        <h2>🔧 Solución de Problemas</h2>
        <p>Si encuentras algún problema, consulta esta sección. Cubrimos los errores más comunes y sus soluciones.</p>
        
        <h2>🎯 Próximos Pasos</h2>
        <p>Una vez completado este tutorial, estarás listo para avanzar al siguiente nivel. ¡Felicitaciones por tu progreso!</p>
      `
    };

    return contentMap[post.category] || contentMap['Noticias'];
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Container>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando artículo...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.notFound}>
        <Container>
          <div className="text-center py-5">
            <h1 className="display-4 text-white">😞 Artículo no encontrado</h1>
            <p className="lead text-muted">El artículo que buscas no existe o ha sido movido.</p>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/blog')}
            >
              ← Volver al Blog
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <article className={styles.blogPostContainer}>
      {/* Header del Artículo */}
      <section className={styles.postHeader}>
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              {/* Breadcrumb */}
              <nav className={styles.breadcrumb}>
                <Button
                  variant="link"
                  className={styles.breadcrumbLink}
                  onClick={() => navigate('/blog')}
                >
                  📚 Blog
                </Button>
                <span className={styles.breadcrumbSeparator}>→</span>
                <span className={styles.breadcrumbCurrent}>
                  {blogCategories.find(cat => cat.name.toLowerCase() === post.category.toLowerCase())?.icon || '📖'} {post.category}
                </span>
              </nav>

              {/* Título */}
              <h1 className={styles.postTitle}>{post.title}</h1>
              
              {/* Meta información */}
              <div className={styles.postMeta}>
                <div className={styles.authorSection}>
                  <img
                    src={post.authorImage}
                    alt={post.author}
                    className={styles.authorAvatar}
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/50x50/252b3d/00d4ff?text=${post.author.charAt(0)}`;
                    }}
                  />
                  <div>
                    <div className="text-white fw-bold">{post.author}</div>
                    <div className="text-muted small">
                      📅 {formatDate(post.publishedAt)} • 🕒 {post.readTime} • 👁️ {post.views} views
                    </div>
                  </div>
                </div>

                <div className={styles.postStats}>
                  <span className={styles.stat}>❤️ {post.likes}</span>
                  <span className={styles.stat}>💬 {post.comments || 0}</span>
                  <span className={styles.stat}>📤 Compartir</span>
                </div>
              </div>

              {/* Tags */}
              <div className={styles.postTags}>
                {post.tags.map(tag => (
                  <span key={tag} className={styles.tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Imagen destacada */}
      <section className={styles.featuredImage}>
        <Container>
          <Row>
            <Col lg={10} className="mx-auto">
              <img
                src={post.image}
                alt={post.title}
                className={styles.postImage}
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/1000x400/1a1f2e/00d4ff?text=${encodeURIComponent(post.title)}`;
                }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contenido del artículo */}
      <section className={styles.postContent}>
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              {/* Excerpt */}
              <div className={styles.postExcerpt}>
                <p className="lead">{post.excerpt}</p>
              </div>

              {/* Contenido principal */}
              <div 
                className={styles.postBody}
                dangerouslySetInnerHTML={{ 
                  __html: generateContent(post) 
                }}
              />

              {/* Interacciones */}
              <div className={styles.postActions}>
                <div className={styles.actionButtons}>
                  <button className={styles.actionBtn}>
                    ❤️ Me gusta ({post.likes})
                  </button>
                  <button className={styles.actionBtn}>
                    💬 Comentar
                  </button>
                  <button className={styles.actionBtn}>
                    📤 Compartir
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Artículos relacionados */}
      {relatedPosts.length > 0 && (
        <section className={styles.relatedPosts}>
          <Container>
            <h2 className={styles.sectionTitle}>📖 Artículos Relacionados</h2>
            <Row>
              {relatedPosts.map(relatedPost => (
                <Col md={4} key={relatedPost.id} className="mb-4">
                  <article className={styles.relatedPostCard}>
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className={styles.relatedPostImage}
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/300x150/252b3d/00d4ff?text=${encodeURIComponent(relatedPost.category)}`;
                      }}
                    />
                    <div className={styles.relatedPostContent}>
                      <span className={styles.relatedPostCategory}>
                        {blogCategories.find(cat => cat.name.toLowerCase() === relatedPost.category.toLowerCase())?.icon || '📖'} {relatedPost.category}
                      </span>
                      <h3 className={styles.relatedPostTitle}>
                        <a href={`/blog/${relatedPost.slug}`}>
                          {relatedPost.title}
                        </a>
                      </h3>
                      <p className={styles.relatedPostExcerpt}>
                        {relatedPost.excerpt.substring(0, 100)}...
                      </p>
                      <div className={styles.relatedPostMeta}>
                        {relatedPost.readTime} • {relatedPost.views} views
                      </div>
                    </div>
                  </article>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* Navegación */}
      <section className={styles.postNavigation}>
        <Container>
          <Row>
            <Col className="text-center">
              <Button
                variant="outline-primary"
                size="lg"
                onClick={() => navigate('/blog')}
              >
                ← Volver al Blog
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </article>
  );
};

export default BlogPost;