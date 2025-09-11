/**
 * Script para crear usuarios de prueba
 * Ejecutar en la consola del navegador para poblar el sistema con datos de ejemplo
 */

function createTestUsers() {
    console.log('🎮 Creando usuarios de prueba para LevelUp...');
    
    const authSystem = new AuthSystem();
    const gamificationSystem = new GamificationSystem();
    
    // Limpiar datos existentes
    localStorage.removeItem('levelup_users');
    localStorage.removeItem('levelup_current_user');
    localStorage.removeItem('levelup_gamification');
    
    // Usuarios de prueba
    const testUsers = [
        {
            firstName: 'Admin',
            lastName: 'LevelUp',
            email: 'admin@duoc.cl',
            password: 'admin123',
            birthDate: '1990-01-15',
            phone: '912345678',
            terms: true,
            newsletter: true
        },
        {
            firstName: 'Maria',
            lastName: 'Estudiante',
            email: 'maria.estudiante@duoc.cl',
            password: 'pass123',
            birthDate: '2000-05-20',
            phone: '987654321',
            terms: true,
            newsletter: true
        },
        {
            firstName: 'Carlos',
            lastName: 'Gamer',
            email: 'carlos.gamer@gmail.com',
            password: 'game456',
            birthDate: '1995-08-10',
            phone: '956789123',
            terms: true,
            newsletter: false
        },
        {
            firstName: 'Ana',
            lastName: 'Profesora',
            email: 'ana.profesora@profesor.duoc.cl',
            password: 'prof789',
            birthDate: '1985-12-03',
            phone: '945678912',
            terms: true,
            newsletter: true
        }
    ];
    
    // Registrar usuarios
    testUsers.forEach((userData, index) => {
        try {
            const result = authSystem.register(userData);
            if (result.success) {
                console.log(`✅ Usuario creado: ${userData.firstName} ${userData.lastName} (${userData.email})`);
                
                // Añadir puntos de ejemplo
                const basePoints = [0, 250, 1200, 3500][index];
                if (basePoints > 0) {
                    gamificationSystem.addPoints(userData.email, basePoints, 'Puntos de prueba');
                    console.log(`   📊 Puntos añadidos: ${basePoints}`);
                }
            } else {
                console.log(`❌ Error creando usuario ${userData.email}: ${result.message}`);
            }
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
    });
    
    // Mostrar códigos de referido
    console.log('\n🔗 Códigos de referido generados:');
    testUsers.forEach(user => {
        const gameData = gamificationSystem.getUserGameData(user.email);
        console.log(`${user.firstName}: ${gameData.referralCode}`);
    });
    
    console.log('\n🎯 Datos de prueba creados exitosamente!');
    console.log('📝 Puedes usar estos usuarios para probar el sistema:');
    console.log('   admin@duoc.cl / admin123 (Admin)');
    console.log('   maria.estudiante@duoc.cl / pass123 (Estudiante)');
    console.log('   carlos.gamer@gmail.com / game456 (Gamer)');
    console.log('   ana.profesora@profesor.duoc.cl / prof789 (Profesora)');
}

// Función para limpiar todos los datos
function clearAllData() {
    localStorage.removeItem('levelup_users');
    localStorage.removeItem('levelup_current_user');
    localStorage.removeItem('levelup_gamification');
    localStorage.removeItem('levelup_cart');
    localStorage.removeItem('levelup_orders');
    localStorage.removeItem('levelup_reviews');
    console.log('🧹 Todos los datos han sido eliminados.');
}

// Función para mostrar estadísticas
function showStats() {
    const users = JSON.parse(localStorage.getItem('levelup_users') || '[]');
    const gamification = JSON.parse(localStorage.getItem('levelup_gamification') || '{}');
    
    console.log('📊 Estadísticas del sistema:');
    console.log(`👥 Usuarios registrados: ${users.length}`);
    console.log(`🎮 Usuarios con puntos: ${Object.keys(gamification).length}`);
    
    if (users.length > 0) {
        console.log('\n📋 Lista de usuarios:');
        users.forEach(user => {
            const gameData = gamification[user.email] || { points: 0, level: 1 };
            console.log(`   ${user.firstName} ${user.lastName} (${user.email}) - Nivel ${gameData.level}, ${gameData.points} puntos`);
        });
    }
}

// Exportar funciones para uso en consola
window.createTestUsers = createTestUsers;
window.clearAllData = clearAllData;
window.showStats = showStats;

console.log('🎮 LevelUp Test Utils cargadas!');
console.log('📝 Funciones disponibles:');
console.log('   createTestUsers() - Crear usuarios de prueba');
console.log('   clearAllData() - Limpiar todos los datos');
console.log('   showStats() - Mostrar estadísticas');
