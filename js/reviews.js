// LG-070: Sistema de reseñas y calificaciones (mock)
class ReviewSystem {
    constructor() {
        this.reviews = this.loadReviews();
        this.init();
    }

    // Agregar reseña (solo usuarios logueados)
    addReview(productCode, rating, comment) {
        const currentUser = JSON.parse(localStorage.getItem('levelup_current_user') || 'null');
        if (!currentUser) {
            alert('Debes iniciar sesión para escribir una reseña');
            return false;
        }

        const errors = this.validateReview(rating, comment);
        if (errors.length > 0) {
            this.showErrors(errors);
            return false;
        }

        // Verificar si el usuario ya reseñó este producto
        const existingReview = this.reviews.find(r => 
            r.productCode === productCode && r.userId === currentUser.id
        );

        const review = {
            id: Date.now(),
            productCode,
            userId: currentUser.id,
            userName: `${currentUser.firstName} ${currentUser.lastName.charAt(0)}.`,
            rating: parseInt(rating),
            comment: comment.trim(),
            date: new Date().toISOString(),
            helpful: 0
        };

        if (existingReview) {
            // Actualizar reseña existente
            const index = this.reviews.findIndex(r => r.id === existingReview.id);
            this.reviews[index] = { ...existingReview, ...review, id: existingReview.id };
            this.showSuccess('Reseña actualizada correctamente');
        } else {
            // Agregar nueva reseña
            this.reviews.push(review);
            this.showSuccess('Reseña agregada correctamente');
            
            // Otorgar puntos por reseña
            if (window.gamification) {
                window.gamification.addPoints(currentUser.id, 25, 'Escribir reseña');
            }
        }

        this.saveReviews();
        this.renderReviews(productCode);
        return true;
    }

    // Validar reseña
    validateReview(rating, comment) {
        const errors = [];
        
        // Validar rating 1-5
        const ratingNum = parseInt(rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            errors.push('La calificación debe ser entre 1 y 5 estrellas');
        }

        // Validar comentario máximo 300 caracteres
        if (!comment || comment.trim().length === 0) {
            errors.push('El comentario es requerido');
        } else if (comment.trim().length > 300) {
            errors.push('El comentario debe tener máximo 300 caracteres');
        }

        return errors;
    }

    // Obtener reseñas de un producto
    getProductReviews(productCode) {
        return this.reviews
            .filter(r => r.productCode === productCode)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Calcular promedio de rating
    getAverageRating(productCode) {
        const productReviews = this.getProductReviews(productCode);
        if (productReviews.length === 0) return 0;
        
        const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / productReviews.length).toFixed(1);
    }

    // Obtener distribución de ratings
    getRatingDistribution(productCode) {
        const productReviews = this.getProductReviews(productCode);
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        
        productReviews.forEach(review => {
            distribution[review.rating]++;
        });

        return distribution;
    }

    // Renderizar formulario de reseña
    renderReviewForm(productCode) {
        const currentUser = JSON.parse(localStorage.getItem('levelup_current_user') || 'null');
        const existingReview = currentUser ? 
            this.reviews.find(r => r.productCode === productCode && r.userId === currentUser.id) : null;

        return `
            <div class="review-form-container">
                ${!currentUser ? `
                    <div class="login-prompt">
                        <p>Inicia sesión para escribir una reseña</p>
                        <button onclick="openLoginModal()" class="btn-primary">Iniciar Sesión</button>
                    </div>
                ` : `
                    <h3>${existingReview ? 'Editar tu reseña' : 'Escribir reseña'}</h3>
                    <form id="review-form-${productCode}" class="review-form">
                        <div class="rating-input">
                            <label>Calificación:</label>
                            <div class="star-rating">
                                ${[1,2,3,4,5].map(star => `
                                    <input type="radio" name="rating" value="${star}" id="star-${productCode}-${star}" 
                                           ${existingReview && existingReview.rating === star ? 'checked' : ''}>
                                    <label for="star-${productCode}-${star}" class="star">★</label>
                                `).join('')}
                            </div>
                        </div>
                        <div class="comment-input">
                            <label for="comment-${productCode}">Comentario (máx. 300 caracteres):</label>
                            <textarea id="comment-${productCode}" name="comment" maxlength="300" rows="4" 
                                      placeholder="Comparte tu experiencia con este producto...">${existingReview ? existingReview.comment : ''}</textarea>
                            <div class="char-counter">
                                <span id="char-count-${productCode}">0</span>/300
                            </div>
                        </div>
                        <button type="submit" class="btn-primary">
                            ${existingReview ? 'Actualizar Reseña' : 'Publicar Reseña'}
                        </button>
                    </form>
                `}
            </div>
        `;
    }

    // Renderizar lista de reseñas
    renderReviews(productCode) {
        const reviews = this.getProductReviews(productCode);
        const averageRating = this.getAverageRating(productCode);
        const distribution = this.getRatingDistribution(productCode);

        const reviewsContainer = document.getElementById(`reviews-${productCode}`);
        if (!reviewsContainer) return;

        let html = `
            <div class="reviews-summary">
                <div class="average-rating">
                    <div class="rating-score">${averageRating}</div>
                    <div class="rating-stars">${this.renderStars(parseFloat(averageRating))}</div>
                    <div class="rating-count">(${reviews.length} reseña${reviews.length !== 1 ? 's' : ''})</div>
                </div>
                <div class="rating-distribution">
                    ${[5,4,3,2,1].map(star => `
                        <div class="rating-bar">
                            <span class="star-label">${star}★</span>
                            <div class="bar">
                                <div class="bar-fill" style="width: ${reviews.length ? (distribution[star] / reviews.length) * 100 : 0}%"></div>
                            </div>
                            <span class="count">(${distribution[star]})</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        html += this.renderReviewForm(productCode);

        html += '<div class="reviews-list">';
        if (reviews.length === 0) {
            html += '<p class="no-reviews">No hay reseñas aún. ¡Sé el primero en reseñar este producto!</p>';
        } else {
            reviews.forEach(review => {
                html += `
                    <div class="review-item">
                        <div class="review-header">
                            <div class="reviewer-name">${review.userName}</div>
                            <div class="review-rating">${this.renderStars(review.rating)}</div>
                            <div class="review-date">${this.formatDate(review.date)}</div>
                        </div>
                        <div class="review-comment">${review.comment}</div>
                        <div class="review-actions">
                            <button onclick="reviewSystem.markHelpful('${review.id}')" class="btn-helpful">
                                👍 Útil (${review.helpful})
                            </button>
                        </div>
                    </div>
                `;
            });
        }
        html += '</div>';

        reviewsContainer.innerHTML = html;

        // Agregar event listeners
        this.addFormListeners(productCode);
    }

    // Renderizar estrellas
    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return '★'.repeat(fullStars) + 
               (hasHalfStar ? '☆' : '') + 
               '☆'.repeat(emptyStars);
    }

    // Formatear fecha
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Marcar reseña como útil
    markHelpful(reviewId) {
        const review = this.reviews.find(r => r.id == reviewId);
        if (review) {
            review.helpful++;
            this.saveReviews();
            // Re-renderizar solo el contador
            const helpfulBtn = document.querySelector(`button[onclick="reviewSystem.markHelpful('${reviewId}')"]`);
            if (helpfulBtn) {
                helpfulBtn.innerHTML = `👍 Útil (${review.helpful})`;
            }
        }
    }

    // Event listeners para formularios
    addFormListeners(productCode) {
        const form = document.getElementById(`review-form-${productCode}`);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const rating = formData.get('rating');
                const comment = formData.get('comment');
                
                if (this.addReview(productCode, rating, comment)) {
                    form.reset();
                    this.updateCharCounter(productCode, 0);
                }
            });

            // Contador de caracteres
            const textarea = document.getElementById(`comment-${productCode}`);
            if (textarea) {
                textarea.addEventListener('input', (e) => {
                    this.updateCharCounter(productCode, e.target.value.length);
                });
                // Inicializar contador
                this.updateCharCounter(productCode, textarea.value.length);
            }
        }
    }

    updateCharCounter(productCode, count) {
        const counter = document.getElementById(`char-count-${productCode}`);
        if (counter) {
            counter.textContent = count;
            counter.style.color = count > 280 ? 'var(--error)' : 'var(--text-muted)';
        }
    }

    // Almacenamiento
    loadReviews() {
        const stored = localStorage.getItem('levelup_reviews');
        return stored ? JSON.parse(stored) : [];
    }

    saveReviews() {
        localStorage.setItem('levelup_reviews', JSON.stringify(this.reviews));
    }

    // Feedback
    showErrors(errors) {
        const container = document.getElementById('review-messages');
        if (container) {
            container.innerHTML = `
                <div class="message error" role="alert" aria-live="polite">
                    ${errors.map(error => `<p>${error}</p>`).join('')}
                </div>
            `;
            setTimeout(() => container.innerHTML = '', 5000);
        } else {
            alert('Errores:\n' + errors.join('\n'));
        }
    }

    showSuccess(message) {
        const container = document.getElementById('review-messages');
        if (container) {
            container.innerHTML = `
                <div class="message success" role="alert" aria-live="polite">
                    <p>${message}</p>
                </div>
            `;
            setTimeout(() => container.innerHTML = '', 3000);
        }
    }

    init() {
        // Renderizar reseñas existentes al cargar la página
        const reviewContainers = document.querySelectorAll('[id^="reviews-"]');
        reviewContainers.forEach(container => {
            const productCode = container.id.replace('reviews-', '');
            this.renderReviews(productCode);
        });
    }
}

// Inicializar sistema de reseñas
window.addEventListener('DOMContentLoaded', () => {
    window.reviewSystem = new ReviewSystem();
});
