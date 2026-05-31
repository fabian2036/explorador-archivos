# ⬡ NexusFiles - Funcionalidades Completas

## 📋 Funcionalidades Implementadas

### ✅ Navegación y Exploración
- [x] Navegar entre carpetas (doble clic)
- [x] Historial de navegación (Atrás ⬅, Adelante ➡)
- [x] Subir a carpeta padre (⬆)
- [x] Actualizar contenido (F5)
- [x] Breadcrumbs para navegación rápida
- [x] Accesos rápidos al sidebar (Inicio, Escritorio, Documentos, etc.)
- [x] Soporte para múltiples unidades de disco

### 📁 Operaciones de Archivos y Carpetas
- [x] **Crear Carpeta** - Con nombre personalizado
- [x] **Crear Archivo** - Con nombre y extensión personalizada
- [x] **Renombrar** (F2) - Edición en línea
- [x] **Eliminar** - Mover a papelera (DEL)
- [x] **Copiar** (Ctrl+C) - Con portapapeles
- [x] **Cortar** (Ctrl+X) - Mover elementos
- [x] **Pegar** (Ctrl+V) - Completa la operación
- [x] **Duplicar** (Ctrl+D) - Crea copias con nombre automático
- [x] **Abrir** - Con aplicación predeterminada
- [x] **Comprimir a ZIP** - Crear archivos .zip
- [x] **Extraer ZIP** - Descomprimir en la carpeta actual

### 🔐 Control de Permisos
- [x] **Cambiar Permisos** - Toggle Solo Lectura / Editable
- [x] Interfaz en propiedades
- [x] Opción en menú contextual
- [x] Visualización de estado (🔒 / 🔓)

### 🔍 Búsqueda y Filtrado
- [x] **Búsqueda en tiempo real** - Por nombre
- [x] **Mostrar/Ocultar Archivos Ocultos** (Ctrl+H)
- [x] Filtra automáticamente archivos que comienzan con punto (.)

### 📊 Visualización
- [x] **Vista Grid** (Cuadrícula)
- [x] **Vista List** (Tabla)
- [x] **Ordenamiento Multi-columna**
  - Nombre
  - Fecha Modificación
  - Tipo
  - Tamaño
- [x] Ordenamiento ascendente/descendente

### 📋 Selección
- [x] **Seleccionar** - Click individual
- [x] **Seleccionar múltiples** - Ctrl+Click
- [x] **Seleccionar rango** - Shift+Click
- [x] **Seleccionar Todo** (Ctrl+A) ✨ NUEVO
- [x] **Deseleccionar Todo** (Esc) ✨ NUEVO

### ℹ️ Información y Propiedades
- [x] **Propiedades Detalladas**
  - Ruta completa
  - Tipo (Archivo/Carpeta)
  - Tamaño (B, KB, MB, GB)
  - Fecha de creación
  - Fecha de modificación
  - Estado de permisos

### 🎯 Interfaz de Usuario
- [x] Menú contextual (botón derecho)
- [x] Barra de herramientas personalizada
- [x] Barra de estado con información
- [x] Toast notifications (mensajes flotantes)
- [x] Panel de propiedades lateral
- [x] Interfaz moderna y oscura
- [x] Controles de ventana personalizados

### ⌨️ Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| **Ctrl+A** | Seleccionar todo |
| **Ctrl+C** | Copiar |
| **Ctrl+D** | Duplicar ✨ NUEVO |
| **Ctrl+H** | Mostrar/ocultar ocultos ✨ NUEVO |
| **Ctrl+V** | Pegar |
| **Ctrl+X** | Cortar |
| **F2** | Renombrar |
| **F5** | Actualizar |
| **DEL** | Eliminar |
| **Esc** | Deseleccionar |
| **Backspace** | Atrás |

### 📦 Soporte de Archivos

**Tipos detectados y con iconos:**
- Documentos: PDF, DOC, DOCX, XLS, XLSX, TXT, MD
- Imágenes: JPG, JPEG, PNG, GIF
- Audio: MP3, FLAC
- Video: MP4, MOV, AVI
- Compresión: ZIP, RAR, 7Z ✨ Ahora con soporte para extraer
- Código: JS, JSX, TS, TSX, HTML, CSS, JSON, PY, JAVA, C, CPP, CS
- Sistema: EXE, MSI, BAT, PS1
- Y más...

---

## 🆕 Funcionalidades Nuevas Agregadas

### 1️⃣ Duplicar Archivos/Carpetas
**Ubicación:** Menú contextual, Action bar, Ctrl+D

```
Original archivo.txt
  ↓ Duplicar
Copia: archivo (copia).txt
```
- Soporta múltiples duplicaciones
- Nombres automáticos sin conflictos
- Funciona con archivos y carpetas

### 2️⃣ Cambiar Permisos
**Ubicación:** Menú contextual, Propiedades

- 🔒 **Solo lectura** - Bloquea edición
- 🔓 **Editable** - Permite modificaciones
- Cambio inmediato
- Visual indicator en propiedades

### 3️⃣ Crear Archivo con Extensión Personalizada
**Ubicación:** Action bar "＋ Archivo", Menú contextual

- Modal con input para nombre.extensión
- Soporte para cualquier extensión
- Ej: `script.py`, `documento.docx`, `index.html`

### 4️⃣ Seleccionar Todo / Deseleccionar
**Ubicación:** Action bar

- **✔ Todo** - Selecciona todos los items visibles (Ctrl+A)
- **✕ Deseleccionar** - Limpia la selección (Esc)
- Botones rápidos sin tocar menús

### 5️⃣ Mostrar/Ocultar Archivos Ocultos
**Ubicación:** Action bar, Ctrl+H

- Toggle visual 👁 Ocultos
- Filtra archivos que comienzan con "."
- Estado persistente durante la sesión

### 6️⃣ Comprimir a ZIP
**Ubicación:** Action bar "📦 ZIP", Menú contextual

```
archivo.txt → archivo.txt.zip (9KB)
carpeta/ → carpeta.zip (2.3MB)
```
- Soporta archivos y carpetas
- Compresión máxima (nivel 9)
- Opción en menú contextual

### 7️⃣ Extraer Archivos ZIP
**Ubicación:** Menú contextual (para .zip)

```
documento.zip → [Extraer aquí]
  ↓
documento/ (carpeta extraída)
```
- Extrae en el directorio actual
- Soporta cualquier ZIP válido

---

## 🎨 Interfaz Mejorada

### Barra de Acciones Expandida
```
[+ Carpeta] [+ Archivo] | [✔ Todo] [✕ Des.] | [🗑] [📋] [⎘] [✂] [⎙] [📦]
| [👁 Ocultos] [Ordenar▼] [↑↓]
```

### Menú Contextual Completo
- ↗ Abrir
- ✏️ Renombrar (F2)
- ⎘ Copiar
- ✂ Cortar
- ⎙ Pegar
- 📋 Duplicar (Ctrl+D) ✨ NUEVO
- ＋ Nueva Carpeta
- ＋ Nuevo Archivo
- 📦 Comprimir (ZIP) ✨ NUEVO
- 📂 Extraer aquí ✨ NUEVO (para ZIP)
- 🗑 Eliminar
- 🔒/🔓 Permisos ✨ NUEVO
- ℹ️ Propiedades

---

## 📝 Detalles Técnicos

### Nuevas Dependencias
- **archiver** (v6.0.0+) - Para comprimir archivos a ZIP
- **extract-zip** (v2.0.1+) - Para descomprimir ZIP

### Nuevos IPC Handlers
- `change-permissions` - Cambiar permisos de archivo
- `duplicate-item` - Duplicar archivo/carpeta
- `compress-item` - Crear archivo ZIP
- `extract-item` - Extraer archivo ZIP

### Nuevos Estados React
- `showHidden` - Mostrar archivos ocultos
- `creatingWithExt` - Modal para crear con extensión

---

## 🚀 Cómo Usar

### Duplicar un Archivo
1. Click derecho → "Duplicar"
2. O: Ctrl+D (con archivo seleccionado)
3. Se crea automáticamente: "nombre (copia).ext"

### Cambiar Permisos
1. Click derecho → "Permisos"
2. O: Abrir Propiedades → botón "Permitir/Bloquear"

### Comprimir a ZIP
1. Seleccionar archivo/carpeta
2. Click derecho → "Comprimir (ZIP)"
3. O: Botón "📦 ZIP" en toolbar

### Extraer ZIP
1. Click derecho en .zip → "Extraer aquí"
2. Se extrae en la carpeta actual

### Ver Archivos Ocultos
1. Botón "👁 Ocultos" en toolbar
2. O: Atajo Ctrl+H

---

## ✨ Mejoras Futuras Posibles

- [ ] Búsqueda avanzada (por tipo, tamaño, fecha)
- [ ] Vista previa de imágenes
- [ ] Búsqueda en contenido de archivos
- [ ] Soporte para RAR/7Z
- [ ] Cambiar permisos avanzados (rwx)
- [ ] Tamaño total de carpetas
- [ ] Sincronización con la nube
- [ ] Historial completo de cambios

---

**Última actualización:** 31 de Mayo de 2026
**Versión:** 1.0.0 Completa
