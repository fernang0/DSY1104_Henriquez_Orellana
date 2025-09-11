// LG-060, LG-061, LG-062: Sistema de gamificación y referidos
class GamificationSystem {
    constructor() {
        this.levelThresholds = [0, 100, 300, 600, 1000, 1500, 2500, 4000, 6000, 10000];
        this.rewards = {
            exchange: {
                100: 'Descuento 5% en próxima compra',
                250: 'Envío gratis en próxima compra',
                500: 'Producto sorpresa LevelUp',
                1000: 'Descuento 15% en próxima compra',
                2000: 'Kit gamer exclusivo'
            }
        };
        this.init();
    }

    // LG-060: Código de referido en registro
    validateReferralCode(code) {
        if (!code) return { valid: false, message: '' };
        
        // Validar formato alfanumérico 6-10 caracteres
        const isValid = /^[a-zA-Z0-9]{6,10}$/.test(code);
        
        if (!isValid) {
            return { 
                valid: false, 
                message: 'El código debe ser alfanumérico de 6-10 caracteres' 
            };
        }

        // Simular verificación de código (en producción sería consulta a BD)
        const validCodes = ['FRIEND2024', 'LEVELUP01', 'GAMER123', 'DUOC2024'];
        const isValidCode = validCodes.includes(code.toUpperCase());
        
        return {
            valid: isValidCode,
            message: isValidCode ? '¡Código válido! +100 puntos LevelUp' : 'Código no válido',
            points: isValidCode ? 100 : 0
        };
    }

    // Asignar puntos por acciones
    addPoints(userId, points, reason = '') {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            users[userIndex].levelupPoints = (users[userIndex].levelupPoints || 0) + points;
            users[userIndex].level = this.calculateLevel(users[userIndex].levelupPoints);
            
            localStorage.setItem('levelup_users', JSON.stringify(users));
            
            // Actualizar usuario actual si es el mismo
            const currentUser = JSON.parse(localStorage.getItem('levelup_current_user') || 'null');
            if (currentUser && currentUser.id === userId) {
                currentUser.levelupPoints = users[userIndex].levelupPoints;
                currentUser.level = users[userIndex].level;
                localStorage.setItem('levelup_current_user', JSON.stringify(currentUser));
            }

            this.showPointsNotification(points, reason);
            this.updateLevelDisplay();
            return true;
        }
        return false;
    }

    // LG-061: Cálculo de niveles por puntos
    calculateLevel(points) {
        for (let i = this.levelThresholds.length - 1; i >= 0; i--) {
            if (points >= this.levelThresholds[i]) {
                return i;
            }
        }
        return 0;
    }

    getLevelInfo(points) {
        const currentLevel = this.calculateLevel(points);
        const nextLevel = currentLevel + 1;
        const currentThreshold = this.levelThresholds[currentLevel] || 0;
        const nextThreshold = this.levelThresholds[nextLevel] || this.levelThresholds[this.levelThresholds.length - 1];
        
        const progress = nextLevel < this.levelThresholds.length 
            ? ((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100
            : 100;

        return {
            level: currentLevel,
            points,
            nextLevel,
            currentThreshold,
            nextThreshold,
            progress: Math.min(progress, 100),
            pointsToNext: Math.max(0, nextThreshold - points)
        };
    }

    getLevelBadge(level) {
        const badges = {
            0: '🎮 Novato',
            1: '🕹️ Jugador',
            2: '🎯 Aficionado',
            3: '⚡ Entusiasta',
            4: '🔥 Experto',
            5: '⭐ Veterano',
            6: '💎 Elite',
            7: '👑 Maestro',
            8: '🏆 Leyenda',
            9: '🌟 LevelUp Hero'
        };
        return badges[level] || badges[0];
    }

    // LG-062: Canje de puntos (UI informativa)
    showExchangeModal() {
        const modal = document.getElementById('points-exchange-modal');
        if (!modal) {
            this.createExchangeModal();
            return;
        }
        
        const currentUser = JSON.parse(localStorage.getItem('levelup_current_user') || 'null');
        if (!currentUser) {
            alert('Debes iniciar sesión para canjear puntos');
            return;
        }

        const userPoints = currentUser.levelupPoints || 0;
        const exchangeList = document.getElementById('exchange-list');
        
        let exchangeHTML = '<h3>Canje de Puntos LevelUp</h3>';
        exchangeHTML += `<p>Tienes <strong>${userPoints} puntos</strong> disponibles</p>`;
        exchangeHTML += '<div class="exchange-items">';
        
        for (const [points, reward] of Object.entries(this.rewards.exchange)) {
            const canExchange = userPoints >= parseInt(points);
            exchangeHTML += `
                <div class="exchange-item ${canExchange ? 'available' : 'unavailable'}">
                    <div class="exchange-points">${points} puntos</div>
                    <div class="exchange-reward">${reward}</div>
                    <button ${canExchange ? '' : 'disabled'} 
                            onclick="gamification.simulateExchange(${points}, '${reward}')"
                            class="btn-exchange">
                        ${canExchange ? 'Canjear' : 'Insuficiente'}
                    </button>
                </div>
            `;
        }
        
        exchangeHTML += '</div>';
        exchangeHTML += '<div class="exchange-terms">';
        exchangeHTML += '<h4>Términos y Condiciones:</h4>';
        exchangeHTML += '<ul>';
        exchangeHTML += '<li>Los puntos no son transferibles</li>';
        exchangeHTML += '<li>Las recompensas tienen vigencia de 30 días</li>';
        exchangeHTML += '<li>LevelUp se reserva el derecho de modificar recompensas</li>';
        exchangeHTML += '<li>Máximo un canje por categoría al mes</li>';
        exchangeHTML += '</ul>';
        exchangeHTML += '</div>';
        
        exchangeList.innerHTML = exchangeHTML;
        modal.showModal();
    }

    simulateExchange(points, reward) {
        const currentUser = JSON.parse(localStorage.getItem('levelup_current_user') || 'null');
        if (!currentUser || (currentUser.levelupPoints || 0) < points) {
            alert('Puntos insuficientes');
            return;
        }

        if (confirm(`¿Confirmar canje de ${points} puntos por "${reward}"?`)) {
            alert(`🎉 ¡Canje exitoso!\n\nHas canjeado ${points} puntos por:\n"${reward}"\n\n(Esta es una simulación - En producción se aplicaría automáticamente)`);
            document.getElementById('points-exchange-modal').close();
        }
    }

    createExchangeModal() {
        const modal = document.createElement('dialog');
        modal.id = 'points-exchange-modal';
        modal.className = 'modal-exchange';
        modal.setAttribute('aria-modal', 'true');
        modal.innerHTML = `
            <form method="dialog">
                <div id="exchange-list"></div>
                <button type="submit" class="btn-close">Cerrar</button>
            </form>
        `;
        document.body.appendChild(modal);
        this.showExchangeModal();
    }

    // Actualizar UI de nivel y progreso
    updateLevelDisplay() {
        const currentUser = JSON.parse(localStorage.getItem('levelup_current_user') || 'null');
        if (!currentUser) return;

        const levelInfo = this.getLevelInfo(currentUser.levelupPoints || 0);
        const levelDisplay = document.getElementById('level-display');
        
        if (levelDisplay) {
            levelDisplay.innerHTML = `
                <div class="level-badge">${this.getLevelBadge(levelInfo.level)}</div>
                <div class="level-info">
                    <div class="level-text">Nivel ${levelInfo.level} • ${levelInfo.points} puntos</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${levelInfo.progress}%"></div>
                    </div>
                    <div class="next-level">
                        ${levelInfo.pointsToNext > 0 
                            ? `${levelInfo.pointsToNext} puntos para nivel ${levelInfo.nextLevel}` 
                            : '¡Nivel máximo alcanzado!'}
                    </div>
                </div>
            `;
        }

        // Actualizar contador de puntos en header
        const pointsCounter = document.getElementById('points-counter');
        if (pointsCounter) {
            pointsCounter.textContent = `${levelInfo.points} pts`;
        }
    }

    // Notificación de puntos ganados
    showPointsNotification(points, reason) {
        const notification = document.createElement('div');
        notification.className = 'points-notification';
        notification.innerHTML = `
            <div class="points-earned">+${points} puntos</div>
            ${reason ? `<div class="points-reason">${reason}</div>` : ''}
        `;
        
        document.body.appendChild(notification);
        
        // Animación
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    // Utilidades
    getUsers() {
        const stored = localStorage.getItem('levelup_users');
        return stored ? JSON.parse(stored) : [];
    }

    init() {
        // Actualizar display al cargar
        this.updateLevelDisplay();

        // Event listener para campo de código de referido
        const referralInput = document.getElementById('referral-code');
        if (referralInput) {
            referralInput.addEventListener('blur', (e) => {
                const code = e.target.value.trim();
                if (code) {
                    const result = this.validateReferralCode(code);
                    const feedback = document.getElementById('referral-feedback');
                    if (feedback) {
                        feedback.innerHTML = `
                            <div class="referral-message ${result.valid ? 'success' : 'error'}">
                                ${result.message}
                            </div>
                        `;
                    }
                }
            });
        }
    }
}

// Acciones que otorgan puntos
function awardPointsForAction(action, userId = null) {
    const currentUser = JSON.parse(localStorage.getItem('levelup_current_user') || 'null');
    const targetUserId = userId || (currentUser ? currentUser.id : null);
    
    if (!targetUserId) return;

    const pointsMap = {
        'register': { points: 50, reason: 'Registro en LevelUp' },
        'first_purchase': { points: 100, reason: 'Primera compra' },
        'review': { points: 25, reason: 'Escribir reseña' },
        'referral_used': { points: 100, reason: 'Código de referido usado' },
        'daily_login': { points: 10, reason: 'Visita diaria' },
        'purchase': { points: 20, reason: 'Compra realizada' }
    };

    const reward = pointsMap[action];
    if (reward && window.gamification) {
        window.gamification.addPoints(targetUserId, reward.points, reward.reason);
    }
}

// Inicializar sistema de gamificación
window.addEventListener('DOMContentLoaded', () => {
    window.gamification = new GamificationSystem();
});
