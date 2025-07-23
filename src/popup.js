// DeepFocus - Popup JavaScript
class DeepFocusPopup {
    constructor() {
        this.currentUrl = '';
        this.currentDomain = '';
        this.isBlocked = false;
        this.init();
    }

    async init() {
        await this.loadCurrentTab();
        this.setupEventListeners();
        this.updateUI();
    }

    async loadCurrentTab() {
        try {
            // Obtener la pestaña activa
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (tab && tab.url) {
                this.currentUrl = tab.url;
                this.currentDomain = this.extractDomain(tab.url);
                
                // Verificar si el sitio está bloqueado
                await this.checkIfBlocked();
            } else {
                this.currentUrl = 'No disponible';
                this.currentDomain = '';
            }
        } catch (error) {
            console.error('Error al cargar la pestaña actual:', error);
            this.currentUrl = 'Error al cargar';
            this.currentDomain = '';
        }
    }

    extractDomain(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch (error) {
            return '';
        }
    }

    async checkIfBlocked() {
        try {
            const result = await chrome.storage.local.get(['blockedSites']);
            const blockedSites = result.blockedSites || [];
            
            this.isBlocked = blockedSites.includes(this.currentDomain);
        } catch (error) {
            console.error('Error al verificar si está bloqueado:', error);
            this.isBlocked = false;
        }
    }

    setupEventListeners() {
        // Botón para bloquear sitio
        document.getElementById('block-site').addEventListener('click', () => {
            this.blockCurrentSite();
        });

        // Botón para desbloquear sitio
        document.getElementById('unblock-site').addEventListener('click', () => {
            this.unblockCurrentSite();
        });

        // Botón para abrir opciones (próximamente)
        document.getElementById('open-options').addEventListener('click', () => {
            this.showMessage('Página de configuración próximamente', 'info');
        });

        // Botón para ver estadísticas
        document.getElementById('view-stats').addEventListener('click', () => {
            this.showStats();
        });
    }

    async blockCurrentSite() {
        if (!this.currentDomain) {
            this.showMessage('No se puede bloquear este sitio', 'error');
            return;
        }

        try {
            // Obtener sitios bloqueados actuales
            const result = await chrome.storage.local.get(['blockedSites']);
            const blockedSites = result.blockedSites || [];

            // Agregar el sitio actual si no está ya bloqueado
            if (!blockedSites.includes(this.currentDomain)) {
                blockedSites.push(this.currentDomain);
                
                // Guardar en storage
                await chrome.storage.local.set({ blockedSites });
                
                // Actualizar estadísticas
                await this.updateStats('sitesBlocked', 1);
                
                this.isBlocked = true;
                this.updateUI();
                this.showMessage('Sitio bloqueado exitosamente. Refrescando página...', 'success');
                
                // Refrescar la página actual después de un breve delay
                setTimeout(async () => {
                    try {
                        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                        if (tab) {
                            await chrome.tabs.reload(tab.id);
                        }
                    } catch (error) {
                        console.error('Error al refrescar la página:', error);
                    }
                }, 1500);
            }
        } catch (error) {
            console.error('Error al bloquear sitio:', error);
            this.showMessage('Error al bloquear el sitio', 'error');
        }
    }

    async unblockCurrentSite() {
        if (!this.currentDomain) {
            this.showMessage('No se puede desbloquear este sitio', 'error');
            return;
        }

        try {
            // Obtener sitios bloqueados actuales
            const result = await chrome.storage.local.get(['blockedSites']);
            const blockedSites = result.blockedSites || [];

            // Remover el sitio actual
            const updatedBlockedSites = blockedSites.filter(site => site !== this.currentDomain);
            
            // Guardar en storage
            await chrome.storage.local.set({ blockedSites: updatedBlockedSites });
            
            this.isBlocked = false;
            this.updateUI();
            this.showMessage('Sitio desbloqueado exitosamente', 'success');
        } catch (error) {
            console.error('Error al desbloquear sitio:', error);
            this.showMessage('Error al desbloquear el sitio', 'error');
        }
    }

    updateUI() {
        // Actualizar URL actual
        const urlElement = document.getElementById('current-url');
        urlElement.textContent = this.currentUrl;

        // Actualizar estado del sitio
        const statusElement = document.getElementById('site-status');
        if (this.isBlocked) {
            statusElement.textContent = '🚫 Bloqueado';
            statusElement.className = 'site-status blocked';
        } else {
            statusElement.textContent = '✅ Accesible';
            statusElement.className = 'site-status unblocked';
        }

        // Mostrar/ocultar botones según el estado
        const blockButton = document.getElementById('block-site');
        const unblockButton = document.getElementById('unblock-site');

        if (this.isBlocked) {
            blockButton.style.display = 'none';
            unblockButton.style.display = 'flex';
        } else {
            blockButton.style.display = 'flex';
            unblockButton.style.display = 'none';
        }

        // Actualizar texto motivacional
        this.updateMotivationalText();
    }

    updateMotivationalText() {
        const motivationalTexts = [
            '"Cada minuto que pasas enfocado es una inversión en tu futuro"',
            '"La concentración es la clave del éxito"',
            '"Tu tiempo es tu recurso más valioso"',
            '"Pequeñas acciones, grandes resultados"',
            '"El enfoque es la diferencia entre el éxito y el fracaso"'
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

    showStats() {
        // Por ahora, mostrar un mensaje simple
        // En futuras versiones, esto abrirá una página de estadísticas
        this.showMessage('Funcionalidad de estadísticas próximamente', 'info');
    }

    showMessage(message, type = 'info') {
        // Crear un elemento de notificación temporal
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos básicos para la notificación
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

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new DeepFocusPopup();
});

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