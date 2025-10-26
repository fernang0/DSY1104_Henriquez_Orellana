import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, useParams, useNavigate } from 'react-router-dom';
import BlogPost from '../../../components/Blog/BlogPost';
import { blogPosts, blogCategories } from '../../../data/blogData';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock de react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn()
  };
});

// Mock del navegador
const mockNavigate = vi.fn();

// Mock del post para pruebas
const mockPost = blogPosts[0];
const mockRelatedPosts = blogPosts.slice(1, 4);

// Configuración inicial para cada prueba
beforeEach(() => {
  useParams.mockReturnValue({ slug: mockPost.slug });
  useNavigate.mockReturnValue(mockNavigate);
  vi.clearAllMocks();
});

// Helper para renderizar el componente
const renderBlogPost = () => {
  return render(
    <BrowserRouter>
      <BlogPost />
    </BrowserRouter>
  );
};

describe('BlogPost', () => {
  // Pruebas de renderizado
  describe('renderizado del artículo', () => {
    it('debe mostrar la información básica del artículo', async () => {
      renderBlogPost();
      
      expect(await screen.findByText(mockPost.title)).toBeInTheDocument();
      expect(await screen.findByText(mockPost.excerpt)).toBeInTheDocument();
      expect(await screen.findByText(mockPost.author)).toBeInTheDocument();
      expect(await screen.findByAltText(mockPost.title)).toBeInTheDocument();
    });

    it('debe mostrar los metadatos del artículo', async () => {
      renderBlogPost();
      
      const metaDiv = await screen.findByText(mockPost.author).then(el => 
        el.closest('._authorSection_ff0e4c')
      );
      expect(metaDiv).toHaveTextContent(mockPost.readTime);
      expect(metaDiv).toHaveTextContent(`${mockPost.views} views`);
      
      const statsContainer = await screen.findByTestId('post-stats');
      expect(statsContainer).toHaveTextContent(String(mockPost.likes));
    });

    it('debe mostrar las etiquetas del artículo', async () => {
      renderBlogPost();
      
      for (const tag of mockPost.tags) {
        const tagElement = await screen.findByText((content, element) => {
          return element.textContent === `#${tag}` && 
                 element.className.includes('_tag_');
        });
        expect(tagElement).toBeInTheDocument();
      }
    });
  });

  // Pruebas de navegación
  describe('navegación', () => {
    it('debe tener un enlace para volver al blog', async () => {
      renderBlogPost();
      
      const backButton = await screen.findByText(/volver al blog/i);
      fireEvent.click(backButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/blog');
    });

    it('debe mostrar breadcrumbs con categoría', async () => {
      renderBlogPost();
      
      const breadcrumbs = await screen.findByRole('navigation', { name: /breadcrumb/i });
      expect(breadcrumbs).toHaveTextContent(/blog/i);
      expect(breadcrumbs).toHaveTextContent(new RegExp(mockPost.category));
    });
  });

  // Pruebas de artículos relacionados
  describe('artículos relacionados', () => {
    it('debe mostrar artículos relacionados', async () => {
      renderBlogPost();
      
      expect(await screen.findByText(/artículos relacionados/i)).toBeInTheDocument();
      for (const relatedPost of mockRelatedPosts) {
        if (
          relatedPost.category === mockPost.category ||
          relatedPost.tags.some(tag => mockPost.tags.includes(tag))
        ) {
          const postElement = await screen.findByText(relatedPost.title);
          expect(postElement).toBeInTheDocument();
        }
      }
    });
  });

  // Pruebas de interacción
  describe('interacciones', () => {
    it('debe tener botones de interacción funcionales', async () => {
      renderBlogPost();
      
      const likeButton = await screen.findByRole('button', { name: /me gusta/i });
      const commentButton = await screen.findByRole('button', { name: /comentar/i });
      const shareButton = await screen.findByRole('button', { name: /compartir/i });
      
      expect(likeButton).toBeInTheDocument();
      expect(commentButton).toBeInTheDocument();
      expect(shareButton).toBeInTheDocument();
    });
  });

  // Pruebas de manejo de errores
  describe('manejo de errores', () => {
    it('debe mostrar mensaje de error para artículo no encontrado', async () => {
      useParams.mockReturnValue({ slug: 'invalid-slug' });
      renderBlogPost();
      
      await new Promise(resolve => setTimeout(resolve, 200));
      expect(await screen.findByText(/artículo no encontrado/i)).toBeInTheDocument();
      expect(await screen.findByText(/el artículo que buscas no existe/i)).toBeInTheDocument();
    });

    it('debe mostrar imagen por defecto si falla la carga', async () => {
      renderBlogPost();
      
      const img = await screen.findByAltText(mockPost.title);
      fireEvent.error(img);
      
      expect(img.src).toContain('placeholder.com');
    });
  });

  // Pruebas de estado de carga
  describe('estado de carga', () => {
    it('debe mostrar spinner mientras carga', () => {
      const setState = vi.fn();
      const useStateSpy = vi.spyOn(React, 'useState');
      useStateSpy.mockReturnValueOnce([true, setState]);

      renderBlogPost();
      
      const loadingText = screen.getByText((content, element) => {
        return element.classList.contains('visually-hidden') &&
               content.toLowerCase().includes('cargando');
      });
      expect(loadingText).toBeInTheDocument();
    });
  });
});