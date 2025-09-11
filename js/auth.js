// LG-050, LG-051, LG-052: Sistema de autenticación y perfil de usuarios
class AuthSystem {
    constructor() {
        this.currentUser = this.loadUser();
        this.validDomains = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];
        this.init();
    }

    // LG-050: Registro 18+ con correo Duoc (descuento)
    register(userData) {
        const errors = this.validateRegistration(userData);
        if (errors.length > 0) {
            this.showErrors(errors);
            return false;
        }

        // Calcular descuento según dominio
        const email = userData.email.toLowerCase();
        const isDuocEmail = email.includes('@duoc.cl') || email.includes('@profesor.duoc.cl');
        
        // LG-060: Validar y procesar código de referido
        let referralPoints = 0;
        let referralValid = false;
        if (userData.referralCode) {
            const referralResult = this.processReferralCode(userData.referralCode);
            if (referralResult.valid) {
                referralPoints = 100;
                referralValid = true;
            }
        }
        
        const user = {
            id: Date.now(),
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
            lastName: userData.lastName,
            birthDate: userData.birthDate,
            phone: userData.phone,
            hasDiscount: isDuocEmail,
            discountPercentage: isDuocEmail ? 20 : 0,
            levelupPoints: referralPoints, // Puntos por referido
            level: 1,
            myReferralCode: this.generateReferralCode(), // Generar código propio
            usedReferralCode: referralValid ? userData.referralCode : null,
            createdAt: new Date().toISOString()
        };

        // Guardar en localStorage
        const users = this.getUsers();
        users.push(user);
        localStorage.setItem('levelup_users', JSON.stringify(users));
        
        this.showSuccess('¡Registro exitoso! ' + (isDuocEmail ? 'Tienes 20% de descuento.' : ''));
        return true;
    }

    // LG-051: Login (mock)
    login(email, password) {
        const errors = this.validateLogin(email, password);
        if (errors.length > 0) {
            this.showErrors(errors);
            return false;
        }

        const users = this.getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('levelup_current_user', JSON.stringify(user));
            this.showSuccess('¡Bienvenido, ' + user.firstName + '!');
            this.updateUIForLoggedUser();
            return true;
        } else {
            this.showErrors(['Email o contraseña incorrectos']);
            return false;
        }
    }

    // LG-052: Perfil de usuario
    updateProfile(userData) {
        if (!this.currentUser) return false;

        const errors = this.validateProfile(userData);
        if (errors.length > 0) {
            this.showErrors(errors);
            return false;
        }

        // Actualizar usuario actual
        Object.assign(this.currentUser, userData);
        
        // Actualizar en lista de usuarios
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === this.currentUser.id);
        if (index !== -1) {
            users[index] = this.currentUser;
            localStorage.setItem('levelup_users', JSON.stringify(users));
            localStorage.setItem('levelup_current_user', JSON.stringify(this.currentUser));
        }

        this.showSuccess('Perfil actualizado correctamente');
        return true;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('levelup_current_user');
        this.updateUIForLoggedUser();
        this.showSuccess('Sesión cerrada');
    }

    // Validaciones
    validateRegistration(data) {
        const errors = [];
        
        // Validar edad ≥18
        const age = this.calculateAge(data.birthDate);
        if (age < 18) {
            errors.push('Debes ser mayor de 18 años para registrarte');
        }

        // Validar email
        if (!data.email || data.email.length > 100) {
            errors.push('Email debe tener máximo 100 caracteres');
        }
        
        const emailDomain = data.email.split('@')[1];
        if (!this.validDomains.includes(emailDomain)) {
            errors.push('Solo se permiten emails de duoc.cl, profesor.duoc.cl o gmail.com');
        }

        // Validar password 4-10 caracteres
        if (!data.password || data.password.length < 4 || data.password.length > 10) {
            errors.push('La contraseña debe tener entre 4 y 10 caracteres');
        }

        // Verificar email no duplicado
        const users = this.getUsers();
        if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
            errors.push('Este email ya está registrado');
        }

        return errors;
    }

    validateLogin(email, password) {
        const errors = [];
        
        if (!email) {
            errors.push('Email es requerido');
        }
        
        const emailDomain = email.split('@')[1];
        if (!this.validDomains.includes(emailDomain)) {
            errors.push('Dominio de email no permitido');
        }

        if (!password || password.length < 4 || password.length > 10) {
            errors.push('Contraseña debe tener entre 4 y 10 caracteres');
        }

        return errors;
    }

    validateProfile(data) {
        const errors = [];
        
        if (data.firstName && data.firstName.length > 50) {
            errors.push('Nombre debe tener máximo 50 caracteres');
        }
        
        if (data.lastName && data.lastName.length > 50) {
            errors.push('Apellido debe tener máximo 50 caracteres');
        }
        
        if (data.phone && (data.phone.length < 8 || data.phone.length > 15)) {
            errors.push('Teléfono debe tener entre 8 y 15 caracteres');
        }

        return errors;
    }

    // Utilidades
    calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    getUsers() {
        const stored = localStorage.getItem('levelup_users');
        return stored ? JSON.parse(stored) : [];
    }

    loadUser() {
        const stored = localStorage.getItem('levelup_current_user');
        return stored ? JSON.parse(stored) : null;
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    // UI y feedback
    showErrors(errors) {
        const container = document.getElementById('auth-messages');
        if (container) {
            container.innerHTML = `
                <div class="message error" role="alert" aria-live="polite">
                    ${errors.map(error => `<p>${error}</p>`).join('')}
                </div>
            `;
            setTimeout(() => container.innerHTML = '', 5000);
        }
    }

    showSuccess(message) {
        const container = document.getElementById('auth-messages');
        if (container) {
            container.innerHTML = `
                <div class="message success" role="alert" aria-live="polite">
                    <p>${message}</p>
                </div>
            `;
            setTimeout(() => container.innerHTML = '', 3000);
        }
    }

    updateUIForLoggedUser() {
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        const profileBtn = document.getElementById('profile-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const userInfo = document.getElementById('user-info');

        if (this.isLoggedIn()) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            if (profileBtn) profileBtn.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'block';
            if (userInfo) {
                userInfo.innerHTML = `
                    <span>Hola, ${this.currentUser.firstName}</span>
                    ${this.currentUser.hasDiscount ? '<span class="discount-badge">20% OFF</span>' : ''}
                `;
                userInfo.style.display = 'block';
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (registerBtn) registerBtn.style.display = 'block';
            if (profileBtn) profileBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (userInfo) userInfo.style.display = 'none';
        }
    }

    init() {
        this.updateUIForLoggedUser();
        
        // Event listeners para formularios
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(registerForm);
                const userData = Object.fromEntries(formData);
                if (this.register(userData)) {
                    registerForm.reset();
                }
            });
        }

        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(loginForm);
                const email = formData.get('email');
                const password = formData.get('password');
                if (this.login(email, password)) {
                    loginForm.reset();
                }
            });
        }

        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(profileForm);
                const userData = Object.fromEntries(formData);
                this.updateProfile(userData);
            });
        }
    }

    // LG-060: Generar código de referido alfanumérico 6-10 caracteres
    generateReferralCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const length = Math.floor(Math.random() * 5) + 6; // 6-10 caracteres
        let result = '';
        
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        // Verificar que no exista ya este código
        const users = this.getUsers();
        const exists = users.some(user => user.myReferralCode === result);
        
        if (exists) {
            return this.generateReferralCode(); // Recursión si existe
        }
        
        return result;
    }

    // LG-060: Validar código de referido
    validateReferralCode(code) {
        if (!code) return { valid: true, message: 'Código opcional' };
        
        // Validar formato: alfanumérico 6-10 caracteres
        const regex = /^[A-Z0-9]{6,10}$/;
        if (!regex.test(code.toUpperCase())) {
            return {
                valid: false,
                message: 'El código debe ser alfanumérico de 6-10 caracteres'
            };
        }
        
        return { valid: true, message: 'Formato válido' };
    }

    // LG-060: Procesar código de referido
    processReferralCode(code) {
        if (!code) return { valid: false, message: 'Código vacío' };
        
        const validation = this.validateReferralCode(code);
        if (!validation.valid) {
            return validation;
        }
        
        const users = this.getUsers();
        const referrer = users.find(user => user.myReferralCode === code.toUpperCase());
        
        if (referrer) {
            // Otorgar puntos al referidor
            referrer.levelupPoints = (referrer.levelupPoints || 0) + 50;
            
            // Actualizar en localStorage
            const updatedUsers = users.map(user => 
                user.id === referrer.id ? referrer : user
            );
            localStorage.setItem('levelup_users', JSON.stringify(updatedUsers));
            
            return {
                valid: true,
                message: `¡Código válido! Recibirás 100 puntos. ${referrer.firstName} recibe 50 puntos.`,
                referrerName: referrer.firstName
            };
        } else {
            return {
                valid: false,
                message: 'Código de referido no encontrado'
            };
        }
    }

    // LG-060: Feedback visual para código de referido
    setupReferralFeedback() {
        const referralInput = document.getElementById('referral');
        const feedbackDiv = document.getElementById('referral-feedback');
        
        if (referralInput && feedbackDiv) {
            referralInput.addEventListener('input', (e) => {
                const code = e.target.value.trim();
                
                if (code === '') {
                    feedbackDiv.innerHTML = '';
                    return;
                }
                
                const result = this.validateReferralCode(code);
                
                if (result.valid && code.length >= 6) {
                    // Verificar si existe el código
                    const processResult = this.processReferralCode(code);
                    if (processResult.valid) {
                        feedbackDiv.innerHTML = `
                            <div class="feedback-success">
                                ✅ ${processResult.message}
                            </div>
                        `;
                    } else {
                        feedbackDiv.innerHTML = `
                            <div class="feedback-error">
                                ❌ ${processResult.message}
                            </div>
                        `;
                    }
                } else if (!result.valid) {
                    feedbackDiv.innerHTML = `
                        <div class="feedback-error">
                            ❌ ${result.message}
                        </div>
                    `;
                } else {
                    feedbackDiv.innerHTML = `
                        <div class="feedback-info">
                            ℹ️ ${result.message}
                        </div>
                    `;
                }
            });
        }
    }

    // LG-061: Sistema de niveles por puntos
    getLevelInfo(points = 0) {
        const levels = [
            { name: 'Bronze', min: 0, max: 499, color: '#cd7f32', icon: '🥉' },
            { name: 'Silver', min: 500, max: 1499, color: '#c0c0c0', icon: '🥈' },
            { name: 'Gold', min: 1500, max: 4999, color: '#ffd700', icon: '🥇' },
            { name: 'Platinum', min: 5000, max: Infinity, color: '#e5e4e2', icon: '💎' }
        ];

        const currentLevel = levels.find(level => points >= level.min && points <= level.max);
        const nextLevel = levels.find(level => level.min > points);
        
        const progress = nextLevel ? 
            ((points - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;
            
        return {
            current: currentLevel,
            next: nextLevel,
            progress: Math.min(progress, 100),
            pointsToNext: nextLevel ? nextLevel.min - points : 0
        };
    }

    // LG-061: Actualizar UI con información de nivel
    updateLevelUI() {
        if (!this.currentUser) return;
        
        const levelInfo = this.getLevelInfo(this.currentUser.levelupPoints || 0);
        
        // Actualizar elementos de nivel en la UI
        const levelBadge = document.getElementById('user-level-badge');
        const levelName = document.getElementById('user-level-name');
        const levelProgress = document.getElementById('level-progress-bar');
        const levelPoints = document.getElementById('user-level-points');
        const pointsToNext = document.getElementById('points-to-next');
        
        if (levelBadge) {
            levelBadge.innerHTML = `${levelInfo.current.icon} ${levelInfo.current.name}`;
            levelBadge.style.color = levelInfo.current.color;
        }
        
        if (levelName) {
            levelName.textContent = levelInfo.current.name;
            levelName.style.color = levelInfo.current.color;
        }
        
        if (levelProgress) {
            levelProgress.style.width = `${levelInfo.progress}%`;
            levelProgress.style.background = `linear-gradient(90deg, ${levelInfo.current.color}, ${levelInfo.next ? levelInfo.next.color : levelInfo.current.color})`;
        }
        
        if (levelPoints) {
            levelPoints.textContent = this.currentUser.levelupPoints || 0;
        }
        
        if (pointsToNext && levelInfo.next) {
            pointsToNext.textContent = `${levelInfo.pointsToNext} puntos para ${levelInfo.next.name}`;
        } else if (pointsToNext) {
            pointsToNext.textContent = '¡Nivel máximo alcanzado!';
        }
    }

    // LG-061: Agregar puntos y actualizar nivel
    addPoints(points, reason = 'Actividad en la plataforma') {
        if (!this.currentUser || points <= 0) return false;
        
        const oldPoints = this.currentUser.levelupPoints || 0;
        const oldLevel = this.getLevelInfo(oldPoints).current;
        
        this.currentUser.levelupPoints = oldPoints + points;
        const newLevel = this.getLevelInfo(this.currentUser.levelupPoints).current;
        
        // Guardar cambios
        this.saveCurrentUser();
        
        // Mostrar notificación
        this.showMessage(`+${points} puntos: ${reason}`, 'success');
        
        // Verificar si subió de nivel
        if (newLevel.name !== oldLevel.name) {
            this.showLevelUpNotification(oldLevel, newLevel);
        }
        
        // Actualizar UI
        this.updateLevelUI();
        
        return true;
    }

    // LG-061: Notificación de subida de nivel
    showLevelUpNotification(oldLevel, newLevel) {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="level-up-content">
                <h3>🎉 ¡SUBISTE DE NIVEL!</h3>
                <div class="level-transition">
                    <span class="old-level" style="color: ${oldLevel.color}">
                        ${oldLevel.icon} ${oldLevel.name}
                    </span>
                    <span class="arrow">➡️</span>
                    <span class="new-level" style="color: ${newLevel.color}">
                        ${newLevel.icon} ${newLevel.name}
                    </span>
                </div>
                <p>¡Sigue acumulando puntos para desbloquear más beneficios!</p>
                <button class="btn btn-primary close-notification">¡Genial!</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Cerrar notificación
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto-cerrar después de 8 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 8000);
    }

    // Guardar usuario actual
    saveCurrentUser() {
        if (!this.currentUser) return;
        
        localStorage.setItem('levelup_current_user', JSON.stringify(this.currentUser));
        
        // También actualizar en la lista de usuarios
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === this.currentUser.id);
        if (index !== -1) {
            users[index] = this.currentUser;
            localStorage.setItem('levelup_users', JSON.stringify(users));
        }
    }
}

// Inicializar sistema de autenticación
window.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
    
    // Configurar feedback de código de referido
    if (window.authSystem.setupReferralFeedback) {
        window.authSystem.setupReferralFeedback();
    }
});
