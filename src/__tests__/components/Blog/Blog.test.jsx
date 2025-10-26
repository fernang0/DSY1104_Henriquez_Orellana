import { render, screen, fireEvent, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Blog from '../../../components/Blog/Blog';
import { blogPosts, blogCategories, popularTags } from '../../../data/blogData';
import '@testing-library/jest-dom';

// Helper para renderizar el componente
const renderBlog = () => {
  return render(
    <BrowserRouter>
      <Blog />
    </BrowserRouter>
  );
};

describe('Blog', () => {
  // Pruebas de renderizado inicial
  describe('renderizado', () => {
    it('debe mostrar el título y subtítulo del blog', () => {
      renderBlog();
      
      expect(screen.getByText(/levelup gaming blog/i)).toBeInTheDocument();
      expect(screen.getByText(/tu fuente definitiva/i)).toBeInTheDocument();
    });

    it('debe mostrar todas las categorías', () => {
      renderBlog();
      
      expect(screen.getByText(/todos los posts/i)).toBeInTheDocument();
      blogCategories.forEach(category => {
        expect(screen.getByText(new RegExp(`${category.name}.*\\(${category.count}\\)`))).toBeInTheDocument();
      });
    });

    it('debe mostrar la barra de búsqueda', () => {
      renderBlog();
      
      expect(screen.getByPlaceholderText(/buscar artículos/i)).toBeInTheDocument();
    });

    it('debe mostrar artículos destacados por defecto', () => {
      renderBlog();
      
      const featuredPosts = blogPosts.filter(post => post.featured);
      const featuredSection = screen.getByRole('region', { 
        name: /artículos destacados/i 
      });
      
      featuredPosts.forEach(post => {
        const postCards = within(featuredSection)
          .getAllByRole('article', { name: post.title });
        expect(postCards[0]).toHaveClass('_featured_3fbb37');
        expect(within(postCards[0]).getByText(post.title)).toBeInTheDocument();
      });
      
      expect(screen.getByText(/artículos destacados/i)).toBeInTheDocument();
    });
  });

  // Pruebas de filtrado
  describe('filtrado', () => {
    it('debe filtrar por categoría', () => {
      renderBlog();
      const category = blogCategories[0];
      
      fireEvent.click(screen.getByText(new RegExp(`${category.name}.*\\(${category.count}\\)`)));
      
      const categoryPosts = blogPosts.filter(post => 
        post.category.toLowerCase() === category.name.toLowerCase()
      );
      categoryPosts.forEach(post => {
        const postTitle = screen.getAllByText(post.title)
          .find(el => el.closest('._postCard_3fbb37'));
        expect(postTitle).toBeInTheDocument();
      });
    });

    it('debe filtrar por término de búsqueda', () => {
      renderBlog();
      const searchTerm = blogPosts[0].title.slice(0, 10);
      
      const searchInput = screen.getByPlaceholderText(/buscar artículos/i);
      fireEvent.change(searchInput, { target: { value: searchTerm } });
      
      const postTitle = screen.getAllByText(blogPosts[0].title)[0];
      expect(postTitle).toBeInTheDocument();
    });

    it('debe mostrar mensaje cuando no hay resultados', () => {
      renderBlog();
      
      const searchInput = screen.getByPlaceholderText(/buscar artículos/i);
      fireEvent.change(searchInput, { target: { value: 'xxxxxxxxxxx' } });
      
      expect(screen.getByText(/no se encontraron artículos/i)).toBeInTheDocument();
    });
  });

  // Pruebas de paginación
  describe('paginación', () => {
    it('debe mostrar controles de paginación cuando hay más de una página', () => {
      renderBlog();
      
      if (blogPosts.length > 6) {  // asumiendo 6 posts por página
        expect(screen.getByText(/siguiente/i)).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
      }
    });

    it('debe cambiar de página al hacer click en los botones', () => {
      renderBlog();
      
      if (blogPosts.length > 6) {
        const nextButton = screen.getByText(/siguiente/i);
        fireEvent.click(nextButton);
        expect(screen.getByText('2')).toHaveClass('active');
      }
    });
  });

  // Pruebas del sidebar
  describe('sidebar', () => {
    it('debe mostrar posts populares', () => {
      renderBlog();
      
      const popularPosts = blogPosts
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);
      
      popularPosts.forEach(post => {
        const postLinks = screen.getAllByText(post.title);
        expect(postLinks.some(link => link.closest('._popularPost_3fbb37'))).toBe(true);
      });
    });

    it('debe mostrar tags populares', () => {
      renderBlog();
      
      const sidebarTags = screen.getAllByRole('button', { class: /tag/ });
      popularTags.forEach(tag => {
        expect(sidebarTags.some(t => t.textContent.includes(tag))).toBe(true);
      });
    });

    it('debe filtrar por tag al hacer click', () => {
      renderBlog();
      
      const tag = popularTags[0];
      const tagButtons = screen.getAllByRole('button', { class: /tag/ });
      const tagButton = tagButtons.find(btn => btn.textContent.includes(tag));
      fireEvent.click(tagButton);
      
      const taggedPosts = blogPosts.filter(post => 
        post.tags.includes(tag)
      );
      
      if (taggedPosts.length > 0) {
        const postTitle = screen.getAllByText(taggedPosts[0].title)[0];
        expect(postTitle).toBeInTheDocument();
      }
    });
  });
});