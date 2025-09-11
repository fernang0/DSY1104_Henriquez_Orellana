// ===== FUNCIONALIDAD BANNER DE LOGIN EN PRODUCTOS =====
class LoginBanner {
    constructor() {
        this.banner = document.getElementById('loginBanner');
        this.closeBtn = document.getElementById('closeBanner');
        this.loginBtn = document.querySelector('.nav-login-btn');
        this.isLoggedIn = this.checkLoginStatus();
        
        this.init();
    }

    init() {
        // Actualizar estado del botón de login
        this.updateLoginButton();

        // Si el usuario ya está logueado, ocultar el banner
        if (this.isLoggedIn) {
            this.hideBanner();
            return;
        }

        // Si el usuario ya cerró el banner, mantenerlo oculto
        if (localStorage.getItem('loginBannerClosed') === 'true') {
            this.hideBanner();
            return;
        }

        // Configurar eventos
        this.bindEvents();
        
        console.log('🎮 Login Banner initialized');
    }

    updateLoginButton() {
        if (!this.loginBtn) return;

        if (this.isLoggedIn) {
            // Cambiar a botón de perfil/logout
            const userData = JSON.parse(localStorage.getItem('levelup_user') || '{}');
            const userName = userData.name || userData.email || 'Usuario';
            
            this.loginBtn.innerHTML = `
                <span class="user-icon">👤</span>
                <span class="login-text">${userName}</span>
            `;
            this.loginBtn.href = './perfil.html';
            this.loginBtn.setAttribute('aria-label', 'Ver perfil de usuario');
            this.loginBtn.classList.add('logged-in');

            // También ocultar el div de user-info si existe y está duplicado
            const userInfo = document.getElementById('user-info');
            if (userInfo && userInfo.style.display !== 'none') {
                // Si hay conflicto, priorizar el botón de login
                this.loginBtn.style.display = 'flex';
            }
        } else {
            // Mantener botón de login normal
            this.loginBtn.innerHTML = `
                <span class="user-icon">⚡</span>
                <span class="login-text">Iniciar Sesión</span>
            `;
            this.loginBtn.href = './login.html';
            this.loginBtn.setAttribute('aria-label', 'Iniciar sesión');
            this.loginBtn.classList.remove('logged-in');
            this.loginBtn.style.display = 'flex';
        }
    }

    bindEvents() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeBanner());
        }

        // Auto-ocultar después de 30 segundos si no hay interacción
        setTimeout(() => {
            if (this.banner && this.banner.style.display !== 'none') {
                this.addAutoCloseWarning();
            }
        }, 25000);

        // Cerrar con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.banner && this.banner.style.display !== 'none') {
                this.closeBanner();
            }
        });
    }

    checkLoginStatus() {
        // Verificar si hay un token de sesión o usuario logueado
        return localStorage.getItem('levelup_user') !== null || 
               localStorage.getItem('userLoggedIn') === 'true';
    }

    closeBanner() {
        if (this.banner) {
            // Animación de salida
            this.banner.style.transform = 'translateY(-100%)';
            this.banner.style.opacity = '0';
            
            setTimeout(() => {
                this.hideBanner();
            }, 300);

            // Recordar que el usuario cerró el banner
            localStorage.setItem('loginBannerClosed', 'true');
            
            // Mostrar mensaje sutil
            this.showMessage('Banner cerrado. Puedes iniciar sesión desde el botón del header.', 'info');
        }
    }

    hideBanner() {
        if (this.banner) {
            this.banner.style.display = 'none';
        }
    }

    addAutoCloseWarning() {
        if (!this.banner) return;

        const warningText = document.createElement('div');
        warningText.className = 'auto-close-warning';
        warningText.innerHTML = '⏰ Este banner se cerrará automáticamente en 5 segundos...';
        warningText.style.cssText = `
            position: absolute;
            top: 10px;
            right: 50px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 10;
        `;

        this.banner.appendChild(warningText);

        // Auto-cerrar después de 5 segundos más
        setTimeout(() => {
            this.closeBanner();
        }, 5000);
    }

    showMessage(text, type = 'info') {
        // Crear mensaje temporal
        const message = document.createElement('div');
        message.className = `temp-message temp-message-${type}`;
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'info' ? 'var(--primary)' : 'var(--danger)'};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(message);

        // Auto-remover después de 4 segundos
        setTimeout(() => {
            message.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, 4000);
    }

    // Método público para reactivar el banner (si el usuario se desloguea)
    show() {
        localStorage.removeItem('loginBannerClosed');
        if (this.banner) {
            this.banner.style.display = 'block';
            this.banner.style.transform = 'translateY(0)';
            this.banner.style.opacity = '1';
        }
    }
}

// Agregar animaciones CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .login-banner {
        transition: all 0.3s ease-out;
    }
`;
document.head.appendChild(style);

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.loginBanner = new LoginBanner();
});
