# 🎯 DeepFocus - Bloqueador de Distracciones

Una extensión de Chrome diseñada para ayudarte a mantener el enfoque bloqueando sitios distractores y mostrando mensajes motivacionales.

## ✨ Características

- **Bloqueo de sitios**: Bloquea fácilmente cualquier sitio web desde el popup
- **Mensajes motivacionales**: Frases inspiradoras que te ayudan a mantener el enfoque
- **Interfaz moderna**: Diseño atractivo y fácil de usar
- **Estadísticas**: Seguimiento de sitios bloqueados e intentos de acceso
- **Página de bloqueo**: Interfaz motivacional cuando intentas acceder a sitios bloqueados

## 🚀 Instalación

### Instalación Manual (Desarrollo)

1. Descarga o clona este repositorio
2. Abre Chrome y ve a `chrome://extensions/`
3. Activa el "Modo desarrollador" en la esquina superior derecha
4. Haz clic en "Cargar extensión sin empaquetar"
5. Selecciona la carpeta `blocker-extension`
6. ¡Listo! La extensión aparecerá en tu barra de herramientas

### Instalación desde Chrome Web Store

*Próximamente disponible*

## 📖 Uso

### Bloquear un sitio

1. Navega al sitio que quieres bloquear
2. Haz clic en el ícono de DeepFocus en la barra de herramientas
3. Haz clic en "Bloquear Sitio"
4. El sitio quedará bloqueado inmediatamente

### Desbloquear un sitio

1. Haz clic en el ícono de DeepFocus
2. Si el sitio está bloqueado, verás el botón "Desbloquear Sitio"
3. Haz clic en "Desbloquear Sitio"

### Ver estadísticas

1. Abre el popup de DeepFocus
2. Haz clic en "Estadísticas" para ver tu progreso

## 🏗️ Estructura del Proyecto

```
blocker-extension/
├── manifest.json          # Configuración de la extensión
├── popup.html            # Interfaz del popup
├── popup.js              # Lógica del popup
├── background.js         # Service worker (intercepta navegación)
├── content.js            # Script inyectado en páginas web
├── blocked.html          # Página mostrada cuando se bloquea un sitio
├── blocked.js            # Lógica de la página de bloqueo
├── options.html          # Página de configuración (próximamente)
├── options.js            # Lógica de configuración (próximamente)
├── styles/
│   └── popup.css        # Estilos del popup
├── utils/
│   └── storage.js       # Utilidades para almacenamiento
└── assets/              # Iconos e imágenes
```

## 🔧 Desarrollo

### Requisitos

- Google Chrome (versión 88 o superior)
- Conocimientos básicos de HTML, CSS y JavaScript

### Estructura de Archivos

- **manifest.json**: Configuración principal de la extensión
- **popup.html/js**: Interfaz que aparece al hacer clic en el ícono
- **background.js**: Service worker que maneja la lógica de bloqueo
- **content.js**: Script que se inyecta en las páginas web
- **blocked.html/js**: Página que se muestra cuando se bloquea un sitio

### Funcionalidades Implementadas

✅ **Fase 1 - MVP**:
- [x] Estructura básica del proyecto
- [x] Configuración de manifest.json
- [x] Popup con botón "Bloquear sitio actual"
- [x] Obtención de URL actual desde popup.js
- [x] Guardado de sitios bloqueados en chrome.storage.local
- [x] Background.js para interceptar navegación
- [x] Redirección a blocked.html si el sitio está bloqueado
- [x] Diseño de blocked.html con imagen + frase motivacional

🔄 **Fase 2 - Funciones adicionales** (En desarrollo):
- [ ] Horarios configurables para bloqueo
- [ ] Página de opciones para configurar lista y horarios
- [ ] Validación de horarios en background.js
- [ ] Protección por PIN para cambiar configuraciones
- [ ] Validación de PIN al desbloquear sitio o cambiar opciones

📋 **Fase 3 - Mejora de UX** (Planificado):
- [ ] Mensajes personalizados
- [ ] Múltiples imágenes motivacionales aleatorias
- [ ] Modo estricto/flexible (desbloqueo condicional)

📊 **Fase 4 - Extras** (Planificado):
- [ ] Contador de intentos de acceso bloqueados
- [ ] Panel con estadísticas de ahorro de tiempo
- [ ] Integración con técnicas Pomodoro
- [ ] Guardado y sincronización en la nube

## 🎨 Personalización

### Cambiar mensajes motivacionales

Edita el archivo `popup.js` y `blocked.js` para modificar los mensajes motivacionales:

```javascript
const motivationalTexts = [
    '"Tu mensaje personalizado aquí"',
    '"Otro mensaje motivacional"',
    // Agrega más mensajes...
];
```

### Cambiar colores

Edita el archivo `styles/popup.css` para personalizar los colores:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #28a745;
    --danger-color: #dc3545;
}
```

## 🐛 Solución de Problemas

### La extensión no aparece

1. Verifica que esté habilitada en `chrome://extensions/`
2. Asegúrate de que el "Modo desarrollador" esté activado
3. Recarga la extensión si es necesario

### Los sitios no se bloquean

1. Verifica que la extensión tenga los permisos necesarios
2. Revisa la consola del navegador para errores
3. Asegúrate de que el sitio esté en la lista de bloqueo

### Error de permisos

1. Ve a `chrome://extensions/`
2. Encuentra DeepFocus
3. Haz clic en "Detalles"
4. Verifica que todos los permisos estén habilitados

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas o sugerencias:

1. Abre un issue en GitHub
2. Describe el problema detalladamente
3. Incluye información sobre tu versión de Chrome y sistema operativo

---

**¡Mantén el enfoque y alcanza tus metas con DeepFocus! 🎯** 