// DeepFocus - Storage Utilities
class DeepFocusStorage {
    static async get(key) {
        try {
            const result = await chrome.storage.local.get([key]);
            return result[key];
        } catch (error) {
            console.error(`Error al obtener ${key}:`, error);
            return null;
        }
    }

    static async set(key, value) {
        try {
            await chrome.storage.local.set({ [key]: value });
            return true;
        } catch (error) {
            console.error(`Error al guardar ${key}:`, error);
            return false;
        }
    }

    static async getMultiple(keys) {
        try {
            const result = await chrome.storage.local.get(keys);
            return result;
        } catch (error) {
            console.error('Error al obtener múltiples valores:', error);
            return {};
        }
    }

    static async setMultiple(data) {
        try {
            await chrome.storage.local.set(data);
            return true;
        } catch (error) {
            console.error('Error al guardar múltiples valores:', error);
            return false;
        }
    }

    static async remove(key) {
        try {
            await chrome.storage.local.remove([key]);
            return true;
        } catch (error) {
            console.error(`Error al eliminar ${key}:`, error);
            return false;
        }
    }

    static async clear() {
        try {
            await chrome.storage.local.clear();
            return true;
        } catch (error) {
            console.error('Error al limpiar storage:', error);
            return false;
        }
    }

    // Métodos específicos para DeepFocus
    static async getBlockedSites() {
        const sites = await this.get('blockedSites');
        return sites || [];
    }

    static async addBlockedSite(site) {
        const sites = await this.getBlockedSites();
        if (!sites.includes(site)) {
            sites.push(site);
            return await this.set('blockedSites', sites);
        }
        return true;
    }

    static async removeBlockedSite(site) {
        const sites = await this.getBlockedSites();
        const updatedSites = sites.filter(s => s !== site);
        return await this.set('blockedSites', updatedSites);
    }

    static async getStats() {
        const stats = await this.get('stats');
        return stats || {};
    }

    static async updateStat(key, increment = 1) {
        const stats = await this.getStats();
        stats[key] = (stats[key] || 0) + increment;
        stats.lastUpdated = new Date().toISOString();
        return await this.set('stats', stats);
    }

    static async getSettings() {
        const settings = await this.get('settings');
        return settings || {
            blockingSchedule: {
                enabled: false,
                days: [1, 2, 3, 4, 5], // Lunes a Viernes
                startTime: '09:00',
                endTime: '17:00'
            },
            pin: null,
            strictMode: false
        };
    }

    static async setSettings(settings) {
        return await this.set('settings', settings);
    }
}

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeepFocusStorage;
} 