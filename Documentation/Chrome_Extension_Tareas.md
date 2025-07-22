# 📝 Tareas para Extensión Chrome: Bloqueador de Sitios

## Fase 1: MVP

- [ ] Crear estructura básica del proyecto
- [ ] Definir y configurar `manifest.json`
- [ ] Crear `popup.html` con botón "Bloquear sitio actual"
- [ ] Obtener URL actual desde `popup.js`
- [ ] Guardar sitios bloqueados en `chrome.storage.local`
- [ ] Crear `background.js` para interceptar navegación
- [ ] Redirigir a `blocked.html` si el sitio está bloqueado
- [ ] Diseñar `blocked.html` con imagen + frase motivacional

## Fase 2: Funciones adicionales

- [ ] Implementar horarios configurables para bloqueo
- [ ] Crear `options.html` para configurar lista y horarios
- [ ] Validar horarios en `background.js`
- [ ] Protección por PIN para cambiar configuraciones
- [ ] Validar PIN al desbloquear sitio o cambiar opciones

## Fase 3: Mejora de UX

- [ ] Permitir mensajes personalizados
- [ ] Permitir múltiples imágenes motivacionales aleatorias
- [ ] Modo estricto/flexible (desbloqueo condicional)

## Fase 4: Extras

- [ ] Contador de intentos de acceso bloqueados
- [ ] Panel con estadísticas de ahorro de tiempo
- [ ] Posible integración con técnicas Pomodoro
- [ ] Guardado y sincronización en la nube (opcional)
