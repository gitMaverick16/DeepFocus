// DeepFocus - Options Page JavaScript
class DeepFocusOptions {
    constructor() {
        this.blockedSites = [];
        this.stats = {};
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.renderBlockedSites();
        this.updateStats();
    }

    async loadData() {
        try {
            // Cargar sitios bloqueados
            this.blockedSites = await DeepFocusStorage.getBlockedSites();
            
            // Cargar estadísticas
            this.stats = await DeepFocusStorage.getStats();
        } catch (error) {
            console.error('Error al cargar datos:', error);
            this.showMessage('Error al cargar los datos', 'error');
        }
    }

    setupEventListeners() {
        // Botón para agregar sitio
        document.getElementById('add-site-btn').addEventListener('click', () => {
            this.addNewSite();
        });

        // Enter en el input para agregar sitio
        document.getElementById('new-site-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addNewSite();
            }
        });

        // Botón para limpiar todo
        document.getElementById('clear-all-btn').addEventListener('click', () => {
            this.showConfirmModal('¿Estás seguro de que quieres eliminar todos los sitios bloqueados?', () => {
                this.clearAllSites();
            });
        });

        // Botón para volver al popup
        document.getElementById('back-to-popup').addEventListener('click', () => {
            window.close();
        });

        // Botones de acciones rápidas
        document.getElementById('export-data').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('import-data').addEventListener('click', () => {
            this.importData();
        });

        document.getElementById('reset-data').addEventListener('click', () => {
            this.showConfirmModal('¿Estás seguro de que quieres resetear todos los datos? Esta acción no se puede deshacer.', () => {
                this.resetAllData();
            });
        });

        // Modal de confirmación
        document.getElementById('confirm-yes').addEventListener('click', () => {
            this.executeConfirmedAction();
        });

        document.getElementById('confirm-no').addEventListener('click', () => {
            this.hideConfirmModal();
        });

        // Cerrar modal al hacer clic fuera
        document.getElementById('confirm-modal').addEventListener('click', (e) => {
            if (e.target.id === 'confirm-modal') {
                this.hideConfirmModal();
            }
        });
    }

    async addNewSite() {
        const input = document.getElementById('new-site-input');
        const domain = input.value.trim().toLowerCase();

        if (!domain) {
            this.showMessage('Por favor ingresa un dominio', 'error');
            return;
        }

        // Validar formato del dominio
        if (!this.isValidDomain(domain)) {
            this.showMessage('Por favor ingresa un dominio válido (ejemplo: google.com)', 'error');
            return;
        }

        // Verificar si ya existe
        if (this.blockedSites.includes(domain)) {
            this.showMessage('Este sitio ya está en la lista de bloqueados', 'error');
            return;
        }

        try {
            await DeepFocusStorage.addBlockedSite(domain);
            this.blockedSites.push(domain);
            this.renderBlockedSites();
            this.updateStats();
            input.value = '';
            this.showMessage(`Sitio "${domain}" agregado a la lista de bloqueados`, 'success');
        } catch (error) {
            console.error('Error al agregar sitio:', error);
            this.showMessage('Error al agregar el sitio', 'error');
        }
    }

    isValidDomain(domain) {
        // Validación básica de dominio
        const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return domainRegex.test(domain) && domain.length > 0 && domain.length <= 253;
    }

    async removeSite(domain) {
        try {
            await DeepFocusStorage.removeBlockedSite(domain);
            this.blockedSites = this.blockedSites.filter(site => site !== domain);
            this.renderBlockedSites();
            this.updateStats();
            this.showMessage(`Sitio "${domain}" removido de la lista de bloqueados`, 'success');
        } catch (error) {
            console.error('Error al remover sitio:', error);
            this.showMessage('Error al remover el sitio', 'error');
        }
    }

    async clearAllSites() {
        try {
            await DeepFocusStorage.set('blockedSites', []);
            this.blockedSites = [];
            this.renderBlockedSites();
            this.updateStats();
            this.showMessage('Todos los sitios han sido removidos', 'success');
        } catch (error) {
            console.error('Error al limpiar sitios:', error);
            this.showMessage('Error al limpiar los sitios', 'error');
        }
    }

    renderBlockedSites() {
        const container = document.getElementById('sites-container');
        const countElement = document.getElementById('site-count');

        // Actualizar contador
        const count = this.blockedSites.length;
        countElement.textContent = `${count} sitio${count !== 1 ? 's' : ''} bloqueado${count !== 1 ? 's' : ''}`;

        // Limpiar contenedor
        container.innerHTML = '';

        if (this.blockedSites.length === 0) {
            // Mostrar estado vacío
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🚫</div>
                    <div class="empty-state-text">No hay sitios bloqueados</div>
                    <div class="empty-state-hint">Agrega sitios usando el formulario de arriba</div>
                </div>
            `;
            return;
        }

        // Renderizar cada sitio
        this.blockedSites.forEach(domain => {
            const siteElement = document.createElement('div');
            siteElement.className = 'site-item';
            siteElement.innerHTML = `
                <span class="site-domain">${domain}</span>
                <div class="site-actions">
                    <button class="btn btn-danger btn-small remove-site-btn" data-domain="${domain}">
                        <span class="btn-icon">🗑️</span>
                        Eliminar
                    </button>
                </div>
            `;

            // Agregar event listener para eliminar
            const removeBtn = siteElement.querySelector('.remove-site-btn');
            removeBtn.addEventListener('click', () => {
                this.showConfirmModal(`¿Estás seguro de que quieres eliminar "${domain}" de la lista de bloqueados?`, () => {
                    this.removeSite(domain);
                });
            });

            container.appendChild(siteElement);
        });
    }

    updateStats() {
        // Actualizar estadísticas
        const totalBlocks = this.blockedSites.length;
        const totalSessions = this.stats.blockSessions || 0;
        const totalTime = this.stats.totalBlockTime || 0;

        document.getElementById('total-blocks').textContent = totalBlocks;
        document.getElementById('total-sessions').textContent = totalSessions;
        document.getElementById('total-time').textContent = this.formatTime(totalTime);
    }

    formatTime(minutes) {
        if (minutes < 60) {
            return `${minutes}m`;
        } else {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
        }
    }

    showConfirmModal(message, callback) {
        const modal = document.getElementById('confirm-modal');
        const messageElement = document.getElementById('confirm-message');
        
        messageElement.textContent = message;
        modal.style.display = 'block';
        
        // Guardar callback para ejecutar cuando se confirme
        this.pendingAction = callback;
    }

    hideConfirmModal() {
        const modal = document.getElementById('confirm-modal');
        modal.style.display = 'none';
        this.pendingAction = null;
    }

    executeConfirmedAction() {
        if (this.pendingAction) {
            this.pendingAction();
        }
        this.hideConfirmModal();
    }

    async exportData() {
        try {
            const data = {
                blockedSites: this.blockedSites,
                stats: this.stats,
                exportDate: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `deepfocus-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showMessage('Datos exportados correctamente', 'success');
        } catch (error) {
            console.error('Error al exportar datos:', error);
            this.showMessage('Error al exportar los datos', 'error');
        }
    }

    async importData() {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = async (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        
                        if (data.blockedSites && Array.isArray(data.blockedSites)) {
                            await DeepFocusStorage.set('blockedSites', data.blockedSites);
                            this.blockedSites = data.blockedSites;
                            this.renderBlockedSites();
                            this.updateStats();
                            this.showMessage('Datos importados correctamente', 'success');
                        } else {
                            this.showMessage('Archivo de datos inválido', 'error');
                        }
                    } catch (error) {
                        console.error('Error al procesar archivo:', error);
                        this.showMessage('Error al procesar el archivo', 'error');
                    }
                };
                
                reader.readAsText(file);
            };
            
            input.click();
        } catch (error) {
            console.error('Error al importar datos:', error);
            this.showMessage('Error al importar los datos', 'error');
        }
    }

    async resetAllData() {
        try {
            await DeepFocusStorage.clear();
            this.blockedSites = [];
            this.stats = {};
            this.renderBlockedSites();
            this.updateStats();
            this.showMessage('Todos los datos han sido reseteados', 'success');
        } catch (error) {
            console.error('Error al resetear datos:', error);
            this.showMessage('Error al resetear los datos', 'error');
        }
    }

    showMessage(message, type = 'info') {
        // Crear elemento de mensaje
        const messageElement = document.createElement('div');
        messageElement.className = `message message-${type}`;
        messageElement.textContent = message;
        
        // Estilos para el mensaje
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1001;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
        `;

        // Colores según tipo
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8',
            warning: '#ffc107'
        };

        messageElement.style.background = colors[type] || colors.info;

        // Agregar al DOM
        document.body.appendChild(messageElement);

        // Remover después de 3 segundos
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    if (messageElement.parentNode) {
                        document.body.removeChild(messageElement);
                    }
                }, 300);
            }
        }, 3000);
    }
}

// Agregar estilos para animaciones de mensajes
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

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    new DeepFocusOptions();
}); 