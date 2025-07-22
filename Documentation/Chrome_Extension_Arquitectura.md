# 🏗️ Arquitectura Técnica de la Extensión Chrome

## Estructura de Archivos

src/
│
├── manifest.json
├── background.js
├── content.js
├── popup.html
├── popup.js
├── options.html
├── options.js
├── blocked.html          # Página mostrada cuando se bloquea un sitio
├── assets/               # Imágenes motivacionales
├── styles/               # CSS para la UI
└── utils/                # Funciones comunes (PIN, hora, etc)

## Componentes Principales

### 1. `manifest.json`
- Define permisos, scripts, UI (popup), y comportamiento general.
- Versión: `manifest_version: 3`

### 2. `popup.html` + `popup.js`
- Se muestra al hacer clic en el ícono de la extensión.
- Permite bloquear el sitio actual.
- Se comunica con `chrome.tabs` para obtener la URL.

### 3. `background.js`
- Script persistente que intercepta cada navegación.
- Consulta la lista de sitios bloqueados y horarios.
- Redirige a `blocked.html` si se cumple la condición.

### 4. `content.js`
- Se puede usar para inyectar mensajes o cambiar el contenido del sitio si no se quiere redirigir.

### 5. `blocked.html`
- Página motivacional que se muestra cuando un sitio es bloqueado.
- Muestra una imagen y mensaje personalizado.

### 6. `options.html` + `options.js`
- Interfaz para configurar sitios bloqueados, horarios y PIN.
- Incluye validación y guardado usando `chrome.storage.local`.

## Comunicación entre componentes

- `popup.js` usa `chrome.tabs.query` para detectar URL actual.
- `background.js` intercepta navegación usando `chrome.webRequest` o `declarativeNetRequest` (según permisos).
- `options.js` y `popup.js` usan `chrome.storage.local` para leer/escribir configuraciones.

## Almacenamiento

Se utiliza `chrome.storage.local` para guardar:
- Lista de sitios bloqueados.
- Horarios de bloqueo.
- PIN (idealmente hash, por ejemplo con SHA256).
- Configuraciones adicionales como modo estricto.

## Permisos necesarios (en `manifest.json`)

"permissions": [
  "storage",
  "tabs",
  "webNavigation",
  "activeTab"
],
"host_permissions": [
  "<all_urls>"
]

## Estilo
- CSS puro o TailwindCSS.
- Imágenes motivacionales pueden estar en `/assets` o cargarse desde URLs.
