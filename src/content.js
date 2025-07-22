// DeepFocus - Content Script
// Este script se inyecta en todas las páginas web

class DeepFocusContent {
    constructor() {
        this.init();
    }

    init() {
        // Verificar si estamos en una página bloqueada
        this.checkIfBlocked();
        
        // Escuchar mensajes del background script
        chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    }

    async checkIfBlocked() {
        try {
            const currentDomain = window.location.hostname;
            const result = await chrome.storage.local.get(['blockedSites']);
            const blockedSites = result.blockedSites || [];
            
            if (blockedSites.includes(currentDomain)) {
                // Si estamos en una página bloqueada, mostrar una advertencia sutil
                this.showBlockedWarning();
            }
        } catch (error) {
            console.error('Error al verificar si la página está bloqueada:', error);
        }
    }

    showBlockedWarning() {
        // Crear una notificación sutil en la esquina superior derecha
        const warning = document.createElement('div');
        warning.id = 'deepfocus-warning';
        warning.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                font-family: 'Segoe UI', sans-serif;
                font-size: 14px;
                font-weight: 600;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                animation: slideInRight 0.3s ease-out;
                max-width: 300px;
            ">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 16px;">🎯</span>
                    <span>Este sitio está en tu lista de bloqueo</span>
                </div>
                <div style="
                    margin-top: 8px;
                    font-size: 12px;
                    opacity: 0.9;
                    font-weight: normal;
                ">
                    Considera usar tu tiempo de manera más productiva
                </div>
                <button id="deepfocus-close-warning" style="
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 16px;
                    opacity: 0.7;
                ">×</button>
            </div>
        `;

        // Agregar estilos CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
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
        document.body.appendChild(warning);

        // Evento para cerrar la advertencia
        document.getElementById('deepfocus-close-warning').addEventListener('click', () => {
            warning.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (warning.parentNode) {
                    warning.parentNode.removeChild(warning);
                }
            }, 300);
        });

        // Auto-ocultar después de 10 segundos
        setTimeout(() => {
            if (warning.parentNode) {
                warning.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => {
                    if (warning.parentNode) {
                        warning.parentNode.removeChild(warning);
                    }
                }, 300);
            }
        }, 10000);
    }

    handleMessage(request, sender, sendResponse) {
        switch (request.action) {
            case 'showMotivationalMessage':
                this.showMotivationalMessage(request.message);
                sendResponse({ success: true });
                break;
                
            case 'updatePageContent':
                this.updatePageContent(request.content);
                sendResponse({ success: true });
                break;
                
            default:
                sendResponse({ error: 'Acción no reconocida' });
        }
    }

    showMotivationalMessage(message) {
        // Crear un overlay motivacional temporal
        const overlay = document.createElement('div');
        overlay.id = 'deepfocus-motivational-overlay';
        overlay.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
                animation: fadeIn 0.3s ease-out;
            ">
                <div style="
                    background: white;
                    padding: 30px;
                    border-radius: 12px;
                    text-align: center;
                    max-width: 400px;
                    margin: 20px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                ">
                    <div style="font-size: 48px; margin-bottom: 20px;">🎯</div>
                    <h2 style="
                        color: #333;
                        margin-bottom: 15px;
                        font-family: 'Segoe UI', sans-serif;
                    ">Mantén el Enfoque</h2>
                    <p style="
                        color: #666;
                        line-height: 1.6;
                        margin-bottom: 20px;
                        font-family: 'Segoe UI', sans-serif;
                    ">${message}</p>
                    <button id="deepfocus-close-motivational" style="
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        font-family: 'Segoe UI', sans-serif;
                    ">Entendido</button>
                </div>
            </div>
        `;

        // Agregar estilos adicionales
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(overlay);

        // Evento para cerrar el overlay
        document.getElementById('deepfocus-close-motivational').addEventListener('click', () => {
            overlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        });
    }

    updatePageContent(content) {
        // Función para actualizar el contenido de la página
        // Esto se puede usar para mostrar mensajes motivacionales
        // o modificar el contenido de sitios bloqueados
        console.log('Actualizando contenido de la página:', content);
    }
}

// Inicializar el content script
new DeepFocusContent(); 