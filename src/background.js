// DeepFocus - Background Service Worker
class DeepFocusBackground {
    constructor() {
        this.init();
    }

    init() {
        // Escuchar eventos de navegación
        chrome.webNavigation.onBeforeNavigate.addListener(
            this.handleNavigation.bind(this),
            { url: [{ schemes: ['http', 'https'] }] }
        );

        // Escuchar cuando se instala la extensión
        chrome.runtime.onInstalled.addListener(this.handleInstall.bind(this));

        // Escuchar mensajes del popup
        chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    }

    async handleNavigation(details) {
        try {
            // Solo procesar navegaciones principales (no sub-frames)
            if (details.frameId !== 0) return;

            const url = new URL(details.url);
            const domain = url.hostname;

            // Verificar si el sitio está bloqueado
            const isBlocked = await this.isSiteBlocked(domain);
            
            if (isBlocked) {
                // Verificar horarios de bloqueo
                const shouldBlock = await this.shouldBlockBySchedule();
                
                if (shouldBlock) {
                    // Actualizar estadísticas
                    await this.updateStats('blockedAttempts', 1);
                    
                    // Redirigir a la página de bloqueo
                    chrome.tabs.update(details.tabId, {
                        url: chrome.runtime.getURL('blocked.html')
                    });
                    
                    return { cancel: true };
                }
            }
        } catch (error) {
            console.error('Error en handleNavigation:', error);
        }
    }

    async isSiteBlocked(domain) {
        try {
            const result = await chrome.storage.local.get(['blockedSites']);
            const blockedSites = result.blockedSites || [];
            
            return blockedSites.includes(domain);
        } catch (error) {
            console.error('Error al verificar si el sitio está bloqueado:', error);
            return false;
        }
    }

    async shouldBlockBySchedule() {
        try {
            const result = await chrome.storage.local.get(['blockingSchedule']);
            const schedule = result.blockingSchedule || {};
            
            // Si no hay horario configurado, bloquear siempre
            if (!schedule.enabled) {
                return true;
            }

            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes(); // Minutos desde medianoche
            const currentDay = now.getDay(); // 0 = Domingo, 1 = Lunes, etc.

            // Verificar si estamos en un día de bloqueo
            if (schedule.days && !schedule.days.includes(currentDay)) {
                return false;
            }

            // Verificar si estamos en el horario de bloqueo
            if (schedule.startTime && schedule.endTime) {
                const startMinutes = this.timeToMinutes(schedule.startTime);
                const endMinutes = this.timeToMinutes(schedule.endTime);
                
                if (startMinutes <= endMinutes) {
                    // Horario en el mismo día (ej: 9:00 - 17:00)
                    return currentTime >= startMinutes && currentTime <= endMinutes;
                } else {
                    // Horario que cruza medianoche (ej: 22:00 - 6:00)
                    return currentTime >= startMinutes || currentTime <= endMinutes;
                }
            }

            return true; // Si no hay horario específico, bloquear siempre
        } catch (error) {
            console.error('Error al verificar horario de bloqueo:', error);
            return true;
        }
    }

    timeToMinutes(timeString) {
        // Convertir "HH:MM" a minutos desde medianoche
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
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

    handleInstall(details) {
        if (details.reason === 'install') {
            // Configuración inicial
            this.initializeDefaultSettings();
        }
    }

    async initializeDefaultSettings() {
        try {
            // Configuración por defecto
            const defaultSettings = {
                blockedSites: [],
                blockingSchedule: {
                    enabled: false,
                    days: [1, 2, 3, 4, 5], // Lunes a Viernes
                    startTime: '09:00',
                    endTime: '17:00'
                },
                stats: {
                    sitesBlocked: 0,
                    blockedAttempts: 0,
                    lastUpdated: new Date().toISOString()
                },
                pin: null,
                strictMode: false
            };

            await chrome.storage.local.set(defaultSettings);
            console.log('Configuración inicial establecida');
        } catch (error) {
            console.error('Error al inicializar configuración:', error);
        }
    }

    handleMessage(request, sender, sendResponse) {
        switch (request.action) {
            case 'getStats':
                this.getStats().then(sendResponse);
                return true; // Indica que la respuesta será asíncrona
                
            case 'updateStats':
                this.updateStats(request.key, request.increment).then(() => {
                    sendResponse({ success: true });
                });
                return true;
                
            case 'checkBlockedSites':
                this.getBlockedSites().then(sendResponse);
                return true;
                
            default:
                sendResponse({ error: 'Acción no reconocida' });
        }
    }

    async getStats() {
        try {
            const result = await chrome.storage.local.get(['stats']);
            return result.stats || {};
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            return {};
        }
    }

    async getBlockedSites() {
        try {
            const result = await chrome.storage.local.get(['blockedSites']);
            return result.blockedSites || [];
        } catch (error) {
            console.error('Error al obtener sitios bloqueados:', error);
            return [];
        }
    }
}

// Inicializar el service worker
new DeepFocusBackground(); 