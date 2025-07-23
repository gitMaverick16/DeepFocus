// DeepFocus - Blocked Page JavaScript
class DeepFocusBlocked {
    constructor() {
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadStats();
        this.updateMotivationalText();
    }

    setupEventListeners() {
        // Botón para volver atrás
        document.getElementById('go-back').addEventListener('click', () => {
            window.history.back();
        });

        // Botón para abrir opciones (próximamente)
        document.getElementById('open-options').addEventListener('click', () => {
            this.showMessage('Página de configuración próximamente', 'info');
        });
    }

    async loadStats() {
        try {
            const result = await chrome.storage.local.get(['stats']);
            const stats = result.stats || {};
            
            // Actualizar estadísticas en la UI
            document.getElementById('blocked-attempts').textContent = stats.blockedAttempts || 0;
            document.getElementById('sites-blocked').textContent = stats.sitesBlocked || 0;
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    }

    updateMotivationalText() {
        const motivationalTexts = [
            '"Cada minuto que pasas enfocado es una inversión en tu futuro"',
            '"La concentración es la clave del éxito"',
            '"Tu tiempo es tu recurso más valioso"',
            '"Pequeñas acciones, grandes resultados"',
            '"El enfoque es la diferencia entre el éxito y el fracaso"',
            '"La disciplina es el puente entre las metas y los logros"',
            '"Cada distracción es una oportunidad perdida"',
            '"Tu futuro se construye con las decisiones de hoy"',
            '"La consistencia es más poderosa que la perfección"',
            '"Cada \'no\' a una distracción es un \'sí\' a tus metas"'
        ];

        const randomText = motivationalTexts[Math.floor(Math.random() * motivationalTexts.length)];
        document.getElementById('motivational-text').textContent = randomText;
    }



    async updateStats(key, increment = 1) {
        try {
            const result = await chrome.storage.local.get(['stats']);
            const stats = result.stats || {};
            
            stats[key] = (stats[key] || 0) + increment;
            stats.lastUpdated = new Date().toISOString();
            
            await chrome.storage.local.set({ stats });
        } catch (error) {
            console.error('Error al actualizar estadísticas:', error);
        }
    }

    showMessage(message, type = 'info') {
        // Crear una notificación temporal
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 16px;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            font-family: 'Segoe UI', sans-serif;
        `;

        // Colores según el tipo
        if (type === 'success') {
            notification.style.background = '#28a745';
        } else if (type === 'error') {
            notification.style.background = '#dc3545';
        } else {
            notification.style.background = '#667eea';
        }

        // Agregar al DOM
        document.body.appendChild(notification);

        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Agregar estilos para las animaciones de notificación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new DeepFocusBlocked();
}); 