# Explorador de Archivos

Aplicación de escritorio web creada en React + Vite para simular un explorador de archivos con acceso rápido, vista de lista y cuadrícula, manejo de selección múltiple y operaciones básicas como crear, copiar, cortar, pegar y borrar elementos.

## Especificaciones

- Interfaz tipo explorador con barra de título, menú de herramientas y panel lateral.
- Vista principal con elementos de carpeta y archivo.
- Funcionalidades incluidas:
  - Navegación entre carpetas
  - Selección de uno o varios elementos
  - Búsqueda de archivos en el directorio actual
  - Creación de carpetas y archivos nuevos
  - Eliminación de archivos y restauración desde papelera
  - Copiar, cortar y pegar elementos
  - Alternar entre vista cuadrícula y vista lista
  - Panel de propiedades para detalles de archivos/carpetas
  - Diseño adaptativo para ocupar toda la pantalla

## Estructura del proyecto

- `src/App.jsx` - Componente principal de la aplicación y lógica del explorador.
- `src/App.css` - Estilos de componentes y apariencia de la aplicación.
- `src/index.css` - Estilos base y layout general.
- `src/main.jsx` - Punto de entrada de React.
- `public/` - Archivos estáticos y recursos del proyecto.

## Ramas de Git

- `main` - rama principal con el código desplegable.
- `fabian` - rama secundaria creada según la solicitud.

> Nota: todo el contenido relevante debe permanecer en `main`.

## Cómo ejecutar

```bash
npm install
npm run dev
```

Luego abre la URL que muestre Vite en tu navegador.

## Repositorio remoto

Remoto: `https://github.com/fabian2036/explorador-archivos.git`

## Descripción breve

Este proyecto es un simulador de explorador de archivos orientado a una interfaz moderna y responsiva. Está pensado como una app de práctica para comprender manejo de estado, renderizado dinámico y UI personalizada en React.
