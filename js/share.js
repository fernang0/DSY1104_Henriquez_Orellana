// Función para inicializar los botones de compartir
function initShareButtons() {
    const productTitle = document.querySelector('.product-title').textContent;
    const productPrice = document.querySelector('.current-price').textContent;
    const productUrl = window.location.href;
    const shareText = `¡Mira este producto en LevelUp! ${productTitle} - ${productPrice}`;
    
    // Facebook
    const facebookBtn = document.querySelector('.share-facebook');
    if (facebookBtn) {
        facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
    }

    // Instagram - Como Instagram no tiene una API de compartir directa, 
    // redirigimos al perfil de la tienda
    const instagramBtn = document.querySelector('.share-instagram');
    if (instagramBtn) {
        instagramBtn.href = 'https://www.instagram.com/tu_tienda_levelup/'; // Actualizar con tu usuario de Instagram
    }

    // WhatsApp
    const whatsappBtn = document.querySelector('.share-whatsapp');
    if (whatsappBtn) {
        whatsappBtn.href = `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + productUrl)}`;
    }

    // Si el navegador soporta la Web Share API, usamos esa
    if (navigator.share) {
        const shareButtons = document.querySelector('.share-buttons');
        const nativeShareBtn = document.createElement('button');
        nativeShareBtn.className = 'share-button';
        nativeShareBtn.innerHTML = `
            <img src="icons/share.svg" alt="" aria-hidden="true">
            <span>Compartir</span>
        `;
        
        nativeShareBtn.addEventListener('click', async () => {
            try {
                await navigator.share({
                    title: productTitle,
                    text: shareText,
                    url: productUrl
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error al compartir:', err);
                }
            }
        });

        shareButtons.prepend(nativeShareBtn);
    }
}

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', initShareButtons);

// Exportar la función para usarla en otros módulos si es necesario
export { initShareButtons };
