import React from 'react';
import { useCarousel } from '../../hooks/useCarousel';
import { carouselSlides } from '../../data/carouselData';
import styles from './HeroCarousel.module.css';

/**
 * Componente HeroCarousel para React
 * Basado en el carousel original de LevelUp
 * Integra Bootstrap y React Router
 */
const HeroCarousel = () => {
  const {
    currentSlide,
    nextSlide,
    prevSlide,
    goToSlide,
    carouselHandlers
  } = useCarousel(carouselSlides.length);

  return (
    <section className={styles.heroCarousel} {...carouselHandlers}>
      <div className={styles.carouselContainer}>
        <div className={styles.carouselTrack}>
          {carouselSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`${styles.carouselSlide} ${
                index === currentSlide ? styles.active : ''
              }`}
              style={{
                backgroundImage: `url(${slide.image})`
              }}
            >
              {/* Overlay con gradiente personalizado por slide */}
              <div 
                className={styles.slideOverlay}
                style={{ background: slide.gradient }}
              />
              
              {/* Contenido del slide */}
              <div className={styles.carouselContent}>
                <h1 className={styles.carouselTitle}>
                  {slide.title}
                </h1>
                <p className={styles.carouselDescription}>
                  {slide.description}
                </p>
                <div className={styles.carouselButtons}>
                  <a 
                    href={slide.buttonLink}
                    className={`${styles.carouselBtn} btn`}
                  >
                    {slide.buttonText}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botones de navegación anterior/siguiente */}
        <button
          className={`${styles.navBtn} ${styles.prevBtn} btn`}
          onClick={prevSlide}
          aria-label="Slide anterior"
          type="button"
        >
          <svg 
            className={styles.navIcon}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>

        <button
          className={`${styles.navBtn} ${styles.nextBtn} btn`}
          onClick={nextSlide}
          aria-label="Slide siguiente"
          type="button"
        >
          <svg 
            className={styles.navIcon}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>

        {/* Indicadores dots */}
        <div className={styles.carouselDots}>
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${
                index === currentSlide ? styles.active : ''
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir al slide ${index + 1}`}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;