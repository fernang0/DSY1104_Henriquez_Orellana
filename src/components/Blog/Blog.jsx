import React, { useState, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { blogPosts, blogCategories, popularTags, blogConfig } from '../../data/blogData';
import styles from './Blog.module.css';

/**
 * Componente Blog para React
 * Lista de artículos gaming con filtros, búsqueda y categorías
 * Integrado con Bootstrap y tema gaming
 */
const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrar posts basado en categoría y búsqueda
  const filteredPosts = useMemo(() => {
    let filtered = blogPosts;

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => 
        post.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  }, [selectedCategory, searchTerm]);

  // Paginación
  const totalPages = Math.ceil(filteredPosts.length / blogConfig.postsPerPage);
  const startIndex = (currentPage - 1) * blogConfig.postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + blogConfig.postsPerPage);

  // Posts destacados
  const featuredPosts = blogPosts.filter(post => post.featured).slice(0, blogConfig.featuredPostsCount);

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Manejar cambio de categoría
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Manejar búsqueda
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className={styles.blogContainer}>
      {/* Header del Blog */}
      <section className={styles.blogHeader}>
        <Container>
          <h1 className={styles.blogTitle}>🎮 LevelUp Gaming Blog</h1>
          <p className={styles.blogSubtitle}>
            Tu fuente definitiva de noticias, guías y reviews gaming. 
            Mantente al día con las últimas tendencias del mundo gamer.
          </p>
        </Container>
      </section>

      {/* Filtros y Categorías */}
      <section className={styles.blogFilters}>
        <Container>
          {/* Categorías */}
          <div className={styles.categoryTabs}>
            <button
              className={`${styles.categoryTab} ${selectedCategory === 'all' ? styles.active : ''}`}
              onClick={() => handleCategoryChange('all')}
            >
              🎯 Todos los Posts
            </button>
            {blogCategories.map(category => (
              <button
                key={category.id}
                className={`${styles.categoryTab} ${
                  selectedCategory === category.id ? styles.active : ''
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.icon} {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* Búsqueda */}
          <div className={styles.searchBox}>
            <svg 
              className={styles.searchIcon}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar artículos..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </Container>
      </section>

      {/* Contenido Principal */}
      <Container>
        <Row>
          {/* Posts Principales */}
          <Col lg={8}>
            {/* Posts Destacados */}
            {selectedCategory === 'all' && !searchTerm && (
              <section className="mb-5">
                <h2 className="h3 mb-4 text-white">
                  ⭐ Artículos Destacados
                </h2>
                <div className={styles.postsGrid}>
                  {featuredPosts.map(post => (
                    <PostCard key={`featured-${post.id}`} post={post} featured={true} />
                  ))}
                </div>
              </section>
            )}

            {/* Todos los Posts */}
            <section>
              <h2 className="h3 mb-4 text-white">
                {selectedCategory === 'all' ? '📚 Últimos Artículos' : `📖 ${blogCategories.find(cat => cat.id === selectedCategory)?.name || 'Artículos'}`}
                <span className="text-muted ms-2">({filteredPosts.length})</span>
              </h2>
              
              {currentPosts.length > 0 ? (
                <>
                  <div className={styles.postsGrid}>
                    {currentPosts.map(post => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>

                  {/* Paginación */}
                  {totalPages > 1 && (
                    <div className={styles.pagination}>
                      <button
                        className={styles.paginationBtn}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        ← Anterior
                      </button>
                      
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          className={`${styles.paginationBtn} ${
                            currentPage === index + 1 ? styles.active : ''
                          }`}
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </button>
                      ))}
                      
                      <button
                        className={styles.paginationBtn}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Siguiente →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-5">
                  <h3 className="text-muted">No se encontraron artículos</h3>
                  <p className="text-muted">
                    Intenta con otros términos de búsqueda o selecciona una categoría diferente.
                  </p>
                </div>
              )}
            </section>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            <aside className={styles.sidebar}>
              <h3 className={styles.sidebarTitle}>🔥 Posts Populares</h3>
              <ul className={styles.popularPosts}>
                {blogPosts
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map(post => (
                    <li key={post.id} className={styles.popularPost}>
                      <a href={`/blog/${post.slug}`} className={styles.popularPostLink}>
                        {post.title}
                        <div className="text-muted small mt-1">
                          {post.views} views • {post.readTime}
                        </div>
                      </a>
                    </li>
                  ))}
              </ul>

              <h3 className={`${styles.sidebarTitle} mt-5`}>🏷️ Tags Populares</h3>
              <div className={styles.postTags}>
                {popularTags.map(tag => (
                  <button
                    key={tag}
                    className={styles.tag}
                    onClick={() => setSearchTerm(tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </aside>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

/**
 * Componente para cada tarjeta de post
 */
const PostCard = ({ post, featured = false }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <article className={`${styles.postCard} ${featured ? styles.featured : ''}`}>
      <div className={styles.postImage}>
        <img
          src={post.image}
          alt={post.title}
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/400x200/1a1f2e/00d4ff?text=${encodeURIComponent(post.category)}`;
          }}
        />
        {featured && (
          <div className={styles.featuredBadge}>⭐ Destacado</div>
        )}
        <div className={styles.categoryBadge}>
          {blogCategories.find(cat => cat.name.toLowerCase() === post.category.toLowerCase())?.icon || '📖'} {post.category}
        </div>
      </div>

      <div className={styles.postContent}>
        <div className={styles.postMeta}>
          <div className={styles.authorInfo}>
            <img
              src={post.authorImage}
              alt={post.author}
              className={styles.authorAvatar}
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/40x40/252b3d/00d4ff?text=${post.author.charAt(0)}`;
              }}
            />
            <div>
              <div className="text-white small fw-bold">{post.author}</div>
              <div className="text-light small" style={{ 
                color: '#ffffff !important',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'
              }}>{formatDate(post.publishedAt)}</div>
            </div>
          </div>
          <div className={styles.postStats}>
            <span>👁️ {post.views}</span>
            <span>❤️ {post.likes}</span>
            <span>🕒 {post.readTime}</span>
          </div>
        </div>

        <h3 className={styles.postTitle}>
          <a href={`/blog/${post.slug}`}>
            {post.title}
          </a>
        </h3>

        <p className={styles.postExcerpt}>{post.excerpt}</p>

        <div className={styles.postTags}>
          {post.tags.slice(0, 3).map(tag => (
            <span key={tag} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>

        <a href={`/blog/${post.slug}`} className={styles.readMoreBtn}>
          Leer más →
        </a>
      </div>
    </article>
  );
};

export default Blog;