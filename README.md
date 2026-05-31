# ⬡ NexusFiles

## Un Explorador de Archivos Moderno y Potente

NexusFiles es un explorador de archivos de escritorio construido con **Electron** y **React**, diseñado para ser rápido, intuitivo y feature-rich. Proporciona todas las funcionalidades que esperas de un explorador moderno, plus características avanzadas.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Windows-0078D4)

---

## ✨ Características Principales

### 📁 Navegación Completa
- Navegar entre carpetas con doble clic
- Historial (atrás, adelante, subir)
- Breadcrumbs interactivos
- Accesos rápidos a carpetas especiales

### 📋 Operaciones de Archivos
- ✅ Crear carpetas y archivos
- ✅ Renombrar (F2)
- ✅ Copiar/Cortar/Pegar
- ✅ **Duplicar (Ctrl+D)**
- ✅ Eliminar (a papelera)
- ✅ Cambiar permisos 
- ✅ Comprimir a ZIP
- ✅ Extraer archivos ZIP 

### 🔍 Búsqueda y Filtrado
- Búsqueda en tiempo real
- Mostrar/Ocultar archivos ocultos 
- Filtrado por tipo, tamaño, fecha

### 📊 Visualización Flexible
- Vista en cuadrícula (grid)
- Vista en lista (tabla)
- Ordenamiento por: nombre, tipo, tamaño, fecha
- Orden ascendente/descendente

### ⌨️ Atajos de Teclado
```
Ctrl+A     Seleccionar todo
Ctrl+C     Copiar
Ctrl+D     Duplicar (NUEVO)
Ctrl+H     Mostrar ocultos (NUEVO)
Ctrl+V     Pegar
Ctrl+X     Cortar
F2         Renombrar
F5         Actualizar
Esc        Deseleccionar
Del        Eliminar
```

### 🎨 Interfaz Moderna
- Tema oscuro profesional
- Menú contextual completo
- Propiedades detalladas
- Notificaciones visuales (toasts)
- Controles de ventana personalizados

---

## 🚀 Instalación y Uso

### Requisitos
- Node.js 14+
- npm o yarn
- Windows 7+

### Instalación

```bash
# Clonar o descargar el proyecto
cd explorador-archivos

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm start

# O ejecutar separadamente:
# Terminal 1:
npm run dev

# Terminal 2:
npm run electron
```

### Compilar para Distribución

```bash
npm run build
```

---

## 📚 Documentación

- **[FUNCIONALIDADES.md](./FUNCIONALIDADES.md)** - Lista completa de características
- **[GUIA_RAPIDA.md](./GUIA_RAPIDA.md)** - Cómo usar cada función

---

## 🛠️ Tecnología

### Stack
- **Frontend:** React 18.2 + Vite 5
- **Desktop:** Electron 30
- **Compresión:** Archiver + Extract-zip
- **Styling:** CSS-in-JS (inline styles)
- **Font:** JetBrains Mono

### Estructura del Proyecto

```
explorador-archivos/
├── main.js              # Backend (Electron)
├── preload.js           # IPC bridge
├── src/
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Entry point React
│   ├── App.css          # Estilos
│   └── index.css        # Estilos globales
├── public/              # Assets públicos
├── vite.config.js       # Config Vite
├── package.json         # Dependencias
└── README.md            # Este archivo
```

---

## 📦 Dependencias Principales

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "archiver": "^6.0.0",       // Comprimir ZIP
    "extract-zip": "^2.0.1"     // Descomprimir
  },
  "devDependencies": {
    "electron": "^30.0.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}
```

---

## 🎯 Casos de Uso

### Para Usuarios
- Navegar y organizar archivos eficientemente
- Respaldar carpetas (duplicar + ZIP)
- Comprimir archivos para compartir
- Buscar archivos rápidamente
- Proteger archivos importantes (solo lectura)

### Para Desarrolladores
- Aprender Electron + React
- Referencia de IPC communication
- Implementación de file system operations
- Arquitectura de aplicaciones desktop

---

## 🐛 Resolución de Problemas

### Problema: "Archivo no encontrado"
- Verifica que el archivo exista
- Actualiza con F5
- Revisa permisos de carpeta padre

### Problema: "No se puede comprimir"
- Verifica espacio en disco
- Comprueba permisos de escritura
- Cierra archivos abiertos que podrían estar en uso

### Problema: "ZIP no se extrae"
- Verifica que sea ZIP válido
- Intenta descargar de nuevo
- Comprueba espacio en disco

---

## 💡 Tips y Trucos

1. **Duplica y modifica** en lugar de crear desde cero
2. **Usa Ctrl+H** para encontrar archivos de configuración
3. **Cambiar permisos** protege archivos importantes
4. **ZIP antes de compartir** para reducir tamaño
5. **Menú contextual** es más rápido que toolbar

---

**Última actualización:** 31 de Mayo de 2026
**Versión:** 1.0.0 Completa

---

## 🔗 Enlaces Relacionados

- [Documentación de Electron](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev)
- [Archiver npm](https://www.npmjs.com/package/archiver)
- [Extract-zip npm](https://www.npmjs.com/package/extract-zip)

---

## 📞 Soporte

Para reportar bugs o sugerir mejoras, revisa las funcionalidades en [FUNCIONALIDADES.md](./FUNCIONALIDADES.md) o la guía de usuario en [GUIA_RAPIDA.md](./GUIA_RAPIDA.md).

¡Disfruta explorando tus archivos! 🚀